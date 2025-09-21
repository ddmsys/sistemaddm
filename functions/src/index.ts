// functions/src/index.ts
// ------------------------------------------------------------
// 1) Bootstrap do Firebase Admin (uma vez por execução)
// ------------------------------------------------------------
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth as getAdminAuth } from "firebase-admin/auth";

import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import {
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
} from "firebase-functions/v2/firestore";

import PDFDocument from "pdfkit";
import type * as PDFKit from "pdfkit";
import dayjs from "dayjs";
import { createHash } from "node:crypto";
import path from "node:path";
import fs from "node:fs";

// Templates de PDF (usar .js pois o build gera .js)
import { renderQuotePdf } from "./pdfs/quoteTemplate.js";
import { renderInvoicePdf as renderInvoicePdfBuffer } from "./pdfs/invoiceTemplate.js";

// Health (mantém como “teste de empacote/deploy”; usar .js)
export { health } from "./health.js";

if (!getApps().length) {
  initializeApp();
}

// ------------------------------------------------------------
// 2) Região padrão do projeto
// ------------------------------------------------------------
export const region = "southamerica-east1" as const;

// ------------------------------------------------------------
// 3) Resolver bucket do Storage de forma segura
// ------------------------------------------------------------
function getProjectId(): string {
  try {
    const cfg = process.env.FIREBASE_CONFIG
      ? JSON.parse(process.env.FIREBASE_CONFIG)
      : {};
    return (
      cfg.projectId ||
      process.env.GCLOUD_PROJECT ||
      process.env.GCP_PROJECT ||
      "sistemaddm-dev"
    );
  } catch {
    return (
      process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || "sistemaddm-dev"
    );
  }
}

function getEnvBucket(): string | undefined {
  try {
    const cfg = process.env.FIREBASE_CONFIG
      ? JSON.parse(process.env.FIREBASE_CONFIG)
      : {};
    return cfg.storageBucket;
  } catch {
    return undefined;
  }
}

const projectId = getProjectId();
const envBucket = getEnvBucket();

// Preferência do projeto DDM; se não houver, cai no appspot.
const defaultAppspotBucket = `${projectId}.appspot.com`;
const ddmPreferredBucket = "sistemaddm-dev.firebasestorage.app";
const chosenBucketName =
  envBucket || ddmPreferredBucket || defaultAppspotBucket;

export const bucket = getStorage().bucket(chosenBucketName);
const db = getFirestore();

console.log("[INIT] projectId:", projectId);
console.log("[INIT] storageBucket (env):", envBucket);
console.log("[INIT] storageBucket (chosen):", chosenBucketName);

// ------------------------------------------------------------
// 4) Utils genéricos
// ------------------------------------------------------------
async function deleteQueryBatch(q: FirebaseFirestore.Query, limit = 300) {
  while (true) {
    const snap = await q.limit(limit).get();
    if (snap.empty) break;
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    if (snap.size < limit) break;
  }
}

async function deleteSubcollection(
  parentPath: string,
  sub: string,
  page = 300
) {
  const subRef = db.doc(parentPath).collection(sub);
  await deleteQueryBatch(subRef, page);
}

async function existsAny(q: FirebaseFirestore.Query): Promise<boolean> {
  const s = await q.limit(1).get();
  return !s.empty;
}

async function listIds(q: FirebaseFirestore.Query): Promise<string[]> {
  const s = await q.get();
  return s.docs.map((d) => d.id);
}

const onlyDigits = (s?: string) => (s || "").replace(/\D+/g, "");
const normEmail = (s?: string) => (s || "").trim().toLowerCase();

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT:${label}`)), ms)
    ),
  ]) as Promise<T>;
}

function normPhoneBR(s?: string) {
  let d = onlyDigits(s);
  if (!d) return "";
  if (!d.startsWith("55") && (d.length === 10 || d.length === 11)) d = "55" + d;
  return d;
}
const normCPF = (s?: string) => {
  const d = onlyDigits(s);
  return d ? d.padStart(11, "0") : "";
};
const normCNPJ = (s?: string) => {
  const d = onlyDigits(s);
  return d ? d.padStart(14, "0") : "";
};
const normRG = (s?: string) => onlyDigits(s);
const normIE = (s?: string) => onlyDigits(s);

// ------------------------------------------------------------
// 5) Fonts PDF (tenta Inter; senão Helvetica)
// ------------------------------------------------------------
export function registerFontsOrFallback(doc: PDFKit.PDFDocument) {
  const inLib = (p: string) => path.join(__dirname, "fonts", p);
  const inRootSibling = (p: string) => path.join(__dirname, "../fonts", p);
  const CANDIDATES = [
    { regular: inLib("Inter-Regular.ttf"), bold: inLib("Inter-Bold.ttf") },
    {
      regular: inRootSibling("Inter-Regular.ttf"),
      bold: inRootSibling("Inter-Bold.ttf"),
    },
  ];
  for (const c of CANDIDATES) {
    try {
      if (fs.existsSync(c.regular)) doc.registerFont("Regular", c.regular);
      if (fs.existsSync(c.bold)) doc.registerFont("Bold", c.bold);
      if (fs.existsSync(c.regular)) {
        doc.font("Regular");
        return;
      }
    } catch {}
  }
  try {
    doc.font("Helvetica");
  } catch {}
}

// ------------------------------------------------------------
// 6) Core de deleção (Cliente / Projeto)
// ------------------------------------------------------------
async function deleteClientCore(clientId: string, uid: string) {
  if (!uid) throw new HttpsError("unauthenticated", "UNAUTHENTICATED");
  if (!clientId) throw new HttpsError("invalid-argument", "Missing clientId");

  const hasProjects = await existsAny(
    db.collection("projects").where("clientId", "==", clientId)
  );
  const hasOrders = await existsAny(
    db.collection("orders").where("clientId", "==", clientId)
  );
  const hasInvoices = await existsAny(
    db.collection("invoices").where("clientId", "==", clientId)
  );

  const deps: string[] = [];
  if (hasProjects) deps.push("projects");
  if (hasOrders) deps.push("orders");
  if (hasInvoices) deps.push("invoices");
  if (deps.length)
    throw new HttpsError(
      "failed-precondition",
      `HAS_DEPENDENCIES:${deps.join(",")}`
    );

  await db.collection("clients").doc(clientId).delete();
  return { ok: true, id: clientId };
}

type DeleteProjectInput = { id: string; force?: boolean };

async function deleteProjectCore(data: DeleteProjectInput, uid: string) {
  if (!uid) throw new HttpsError("unauthenticated", "UNAUTHENTICATED");
  const projectId = String(data?.id || "");
  const force = !!data?.force;
  if (!projectId)
    throw new HttpsError("invalid-argument", "Missing project id");

  const orderIds = await listIds(
    db.collection("orders").where("projectId", "==", projectId)
  );
  for (const oid of orderIds) {
    await deleteSubcollection(`orders/${oid}`, "financial_entries", 500);
  }
  await deleteQueryBatch(
    db.collection("orders").where("projectId", "==", projectId),
    500
  );

  const invQ = db.collection("invoices").where("projectId", "==", projectId);
  const hasInvoices = await existsAny(invQ);
  if (hasInvoices && !force)
    throw new HttpsError("failed-precondition", "HAS_INVOICES");
  if (hasInvoices && force) await deleteQueryBatch(invQ, 400);

  await deleteSubcollection(`projects/${projectId}`, "tasks", 500);
  await deleteSubcollection(`projects/${projectId}`, "productionItems", 500);
  await db
    .collection("projects_previews")
    .doc(projectId)
    .delete()
    .catch(() => {});

  const quotesSnap = await db
    .collection("quotes")
    .where("projectId", "==", projectId)
    .get();
  if (!quotesSnap.empty) {
    const batch = db.batch();
    quotesSnap.docs.forEach((d) => batch.update(d.ref, { projectId: null }));
    await batch.commit();
  }

  await db.collection("projects").doc(projectId).delete();
  return { ok: true, id: projectId, deletedOrders: orderIds.length };
}

// ------------------------------------------------------------
// 7) Índice de unicidade (clients/leads)
// ------------------------------------------------------------
type UniqueKey = {
  coll: "clients" | "leads";
  field: "email" | "phone" | "cpf" | "rg" | "cnpj" | "ie";
  value: string;
};
const uniqueDocId = (k: UniqueKey) =>
  `${k.coll}:${k.field}:${createHash("sha256").update(k.value).digest("hex")}`;

async function reserveKeysOrThrow(ownerId: string, keys: UniqueKey[]) {
  const ts = Date.now();
  await db.runTransaction(async (tx) => {
    for (const k of keys) {
      if (!k.value) continue;
      const ref = db.collection("unique_index").doc(uniqueDocId(k));
      const snap = await tx.get(ref);
      const exist = snap.exists ? (snap.data() as any) : null;
      if (exist && exist.ownerId !== ownerId) {
        throw new HttpsError("already-exists", `DUPLICATE:${k.field}`);
      }
    }
    for (const k of keys) {
      if (!k.value) continue;
      const ref = db.collection("unique_index").doc(uniqueDocId(k));
      tx.set(ref, { ownerId, ...k, updatedAt: ts }, { merge: true });
    }
  });
}

async function releaseKeys(ownerId: string, keys: UniqueKey[]) {
  await db.runTransaction(async (tx) => {
    for (const k of keys) {
      if (!k.value) continue;
      const ref = db.collection("unique_index").doc(uniqueDocId(k));
      const snap = await tx.get(ref);
      const exist = snap.exists ? (snap.data() as any) : null;
      if (exist && exist.ownerId === ownerId) tx.delete(ref);
    }
  });
}

async function releaseAllKeysForOwner(
  coll: "clients" | "leads",
  ownerId: string
) {
  const qs = await db
    .collection("unique_index")
    .where("coll", "==", coll)
    .where("ownerId", "==", ownerId)
    .get();
  const batch = db.batch();
  qs.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

// ------------------------------------------------------------
// 8) Client core
// ------------------------------------------------------------
type ClientInput = {
  id?: string;
  name?: string;
  nome?: string;
  contato?: string;
  email?: string;
  phone?: string;
  phones?: string[];
  cpf?: string;
  cnpj?: string;
  cpfCnpj?: string;
  rg?: string;
  rgNumero?: string;
  ie?: string;
  inscricaoEstadual?: string;
  indication?: string;
  birthday?: string;
  personType?: "PF" | "PJ";
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
};

async function upsertClientCore(data: ClientInput, uid: string) {
  if (!uid) throw new HttpsError("unauthenticated", "UNAUTHENTICATED");

  const id = data.id || db.collection("clients").doc().id;
  const ref = db.collection("clients").doc(id);

  const allPhonesRaw = [
    ...(Array.isArray(data.phones) ? data.phones : []),
    data.phone,
  ].filter(Boolean) as string[];
  const nPhones = Array.from(
    new Set(allPhonesRaw.map(normPhoneBR).filter(Boolean))
  );

  const combo = onlyDigits(data.cpfCnpj);
  const nCPF = normCPF(data.cpf || (combo.length === 11 ? combo : ""));
  const nCNPJ = normCNPJ(data.cnpj || (combo.length === 14 ? combo : ""));
  const nRG = normRG(data.rg || data.rgNumero);
  const nIE = normIE(data.ie || data.inscricaoEstadual);
  const nEmail = normEmail(data.email);

  const prevSnap = await ref.get();
  const prev = prevSnap.exists ? (prevSnap.data() as any) : {};

  const prevPhones = Array.from(
    new Set(
      [...(Array.isArray(prev.phones) ? prev.phones : []), prev.phone].filter(
        Boolean
      )
    )
  )
    .map(normPhoneBR)
    .filter(Boolean);

  const prevKeys: UniqueKey[] = [
    prev.email
      ? { coll: "clients", field: "email", value: normEmail(prev.email) }
      : null,
    ...prevPhones.map(
      (p: string) =>
        ({ coll: "clients", field: "phone", value: p } as UniqueKey)
    ),
    prev.cpf
      ? { coll: "clients", field: "cpf", value: normCPF(prev.cpf) }
      : null,
    prev.cnpj
      ? { coll: "clients", field: "cnpj", value: normCNPJ(prev.cnpj) }
      : null,
    prev.rg ? { coll: "clients", field: "rg", value: normRG(prev.rg) } : null,
    prev.ie ? { coll: "clients", field: "ie", value: normIE(prev.ie) } : null,
  ].filter(Boolean) as UniqueKey[];

  const newKeys: UniqueKey[] = [
    nEmail ? { coll: "clients", field: "email", value: nEmail } : null,
    ...nPhones.map(
      (p) => ({ coll: "clients", field: "phone", value: p } as UniqueKey)
    ),
    nCPF ? { coll: "clients", field: "cpf", value: nCPF } : null,
    nCNPJ ? { coll: "clients", field: "cnpj", value: nCNPJ } : null,
    nRG ? { coll: "clients", field: "rg", value: nRG } : null,
    nIE ? { coll: "clients", field: "ie", value: nIE } : null,
  ].filter(Boolean) as UniqueKey[];

  const toRelease = prevKeys.filter(
    (pk) =>
      !newKeys.find((nk) => nk.field === pk.field && nk.value === pk.value)
  );
  if (toRelease.length) await releaseKeys(id, toRelease);
  await reserveKeysOrThrow(id, newKeys);

  const now = FieldValue.serverTimestamp();
  await ref.set(
    {
      ...data,
      phones: Array.from(new Set(allPhonesRaw)),
      updatedAt: now,
      createdAt: prevSnap.exists ? prev.createdAt || now : now,
    },
    { merge: true }
  );

  return { ok: true, id };
}

// ------------------------------------------------------------
// 9) Lead core
// ------------------------------------------------------------
type LeadStage =
  | "primeiro_contato"
  | "proposta_enviada"
  | "negociacao"
  | "fechado_ganho"
  | "fechado_perdido";

const VALID_STAGES: LeadStage[] = [
  "primeiro_contato",
  "proposta_enviada",
  "negociacao",
  "fechado_ganho",
  "fechado_perdido",
];

function normalizeStage(v?: string): LeadStage {
  const s = String(v || "")
    .toLowerCase()
    .trim();
  if (VALID_STAGES.includes(s as LeadStage)) return s as LeadStage;
  if (["orcamento", "orçamento", "proposta", "proposta_enviada"].includes(s))
    return "proposta_enviada";
  if (["negociando", "negociação", "negociacao"].includes(s))
    return "negociacao";
  if (
    [
      "fechado",
      "ganho",
      "fechado_ganho",
      "negocio_ganho",
      "negócio fechado!",
      "negócio fechado",
    ].includes(s)
  )
    return "fechado_ganho";
  if (
    [
      "perdido",
      "fechado_perdido",
      "negocio_perdido",
      "negócio perdido",
    ].includes(s)
  )
    return "fechado_perdido";
  return "primeiro_contato";
}

type LeadInput = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  indication?: string;
  stage?: string;
  quoteId?: string;
  ownerId?: string | null;
  ownerName?: string | null;
  ownerEmail?: string | null;
};

async function upsertLeadCore(data: LeadInput, uid: string) {
  if (!uid) throw new HttpsError("unauthenticated", "UNAUTHENTICATED");

  const id = data.id || db.collection("leads").doc().id;
  const ref = db.collection("leads").doc(id);

  const nEmail = normEmail(data.email);
  const nPhone = normPhoneBR(data.phone);
  const stage: LeadStage = normalizeStage(data.stage);

  let ownerId = data.ownerId ?? uid;
  let ownerName = data.ownerName ?? null;
  let ownerEmail = data.ownerEmail ?? null;
  if (!ownerName || !ownerEmail) {
    try {
      const userRec = await getAdminAuth().getUser(uid);
      ownerName = ownerName || userRec.displayName || null;
      ownerEmail = ownerEmail || userRec.email || null;
    } catch {}
  }

  const prevSnap = await ref.get();
  const prev = prevSnap.exists ? (prevSnap.data() as any) : {};

  const prevKeys: UniqueKey[] = [
    prev.email
      ? { coll: "leads", field: "email", value: normEmail(prev.email) }
      : null,
    prev.phone
      ? { coll: "leads", field: "phone", value: normPhoneBR(prev.phone) }
      : null,
  ].filter(Boolean) as UniqueKey[];

  const newKeys: UniqueKey[] = [
    nEmail ? { coll: "leads", field: "email", value: nEmail } : null,
    nPhone ? { coll: "leads", field: "phone", value: nPhone } : null,
  ].filter(Boolean) as UniqueKey[];

  const toRelease = prevKeys.filter(
    (pk) =>
      !newKeys.find((nk) => nk.field === pk.field && nk.value === pk.value)
  );
  if (toRelease.length) await releaseKeys(id, toRelease);
  await reserveKeysOrThrow(id, newKeys);

  const now = FieldValue.serverTimestamp();
  await ref.set(
    {
      name: (data.name || "").trim(),
      email: data.email || null,
      phone: data.phone || null,
      indication: data.indication || null,
      stage,
      quoteId: data.quoteId || null,
      ownerId,
      ownerName,
      ownerEmail,
      updatedAt: now,
      createdAt: prevSnap.exists ? prev.createdAt || now : now,
    },
    { merge: true }
  );

  return { ok: true, id };
}

// ------------------------------------------------------------
// 10) Helpers de PDF
// ------------------------------------------------------------
const moneyBR = (v: any) => `R$ ${Number(v || 0).toFixed(2)}`;
const safeStr = (v: any) =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "")
    ? "—"
    : String(v);

function lineTotal(it: any): number {
  if (it?.kind === "impressao") {
    const q = Number(it?.qty || 0);
    const u = Number(it?.unitPrice || 0);
    return q * u;
  }
  if (typeof it?.value === "number") return Number(it.value);
  const q = Number(it?.qty || 0);
  const u = Number(it?.unitPrice || 0);
  return q * u;
}

function computeTotals(quote: any) {
  if (quote?.totals && typeof quote.totals?.grandTotal === "number")
    return quote.totals;
  const items = Array.isArray(quote?.items) ? quote.items : [];
  const subtotal = items.reduce(
    (acc: number, it: any) => acc + lineTotal(it),
    0
  );
  const discountTotal = Number(quote?.totals?.discountTotal || 0);
  const freight = Number(quote?.totals?.freight || 0);
  const surcharge = Number(quote?.totals?.surcharge || 0);
  const grandTotal = subtotal - discountTotal + freight + surcharge;
  return { subtotal, discountTotal, freight, surcharge, grandTotal };
}

async function savePdfAndGetSignedUrl(
  storagePath: string,
  buffer: Buffer,
  hours = 48
): Promise<string> {
  const file = bucket.file(storagePath);
  await file.save(buffer, {
    contentType: "application/pdf",
    resumable: false,
    public: false,
  });
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + hours * 3600 * 1000,
  });
  return url;
}

async function generateQuotePdf(quoteId: string): Promise<string> {
  console.log("[PDF] start", { quoteId, bucket: bucket.name });

  const snap = await withTimeout(
    db.collection("quotes").doc(quoteId).get(),
    6000,
    "firestore:quote"
  );
  if (!snap.exists) throw new Error("Quote not found");
  const quote = snap.data() as any;

  const doc = new PDFDocument({
    size: "A4",
    margin: 24,
    layout: "portrait",
    autoFirstPage: false,
  });
  registerFontsOrFallback(doc);

  const chunks: Buffer[] = [];
  doc.on("data", (d: Buffer) => chunks.push(d));
  const done = new Promise<Buffer>((resolve) =>
    doc.on("end", () => resolve(Buffer.concat(chunks)))
  );

  await renderQuotePdf(doc as any, {
    quote: { ...quote },
    client: {
      name: quote.clientName,
      number: quote.clientNumber,
      email: quote.clientEmail,
    },
  });
  doc.end();

  const pdfBuffer = await withTimeout(done, 10000, "pdf:render");
  const url = await savePdfAndGetSignedUrl(
    `quotes/${quoteId}.pdf`,
    pdfBuffer,
    48
  );

  await withTimeout(
    db.collection("quotes").doc(quoteId).update({
      pdfUrl: url,
      updatedAt: FieldValue.serverTimestamp(),
    }),
    6000,
    "firestore:update"
  );

  console.log("[PDF] done", { quoteId });
  return url;
}

async function generateInvoicePdf(invoiceId: string): Promise<string> {
  console.log("[PDF][INV] start", { invoiceId, bucket: bucket.name });
  const pdfBuffer = await renderInvoicePdfBuffer(invoiceId);
  const url = await savePdfAndGetSignedUrl(
    `invoices/${invoiceId}.pdf`,
    pdfBuffer,
    48
  );
  await db.collection("invoices").doc(invoiceId).update({
    pdfUrl: url,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log("[PDF][INV] done", { invoiceId });
  return url;
}

// ------------------------------------------------------------
// 11) HTTP/Callable Endpoints
// ------------------------------------------------------------
export const deleteClient = onCall({ region }, async (req) => {
  const uid = req.auth?.uid || "";
  const id = String((req.data || {}).id || "");
  return deleteClientCore(id, uid);
});

export const deleteClientHttp = onRequest(
  { region, cors: true },
  async (req: any, res: any) => {
    try {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }
      const authH = String(req.headers.authorization || "");
      const token = authH.startsWith("Bearer ") ? authH.slice(7) : "";
      if (!token) {
        res.status(401).json({ ok: false, error: "UNAUTHENTICATED" });
        return;
      }
      const decoded = await getAdminAuth().verifyIdToken(token);
      const id = String(
        req.method === "DELETE" ? req.query.id || "" : req.body?.id || ""
      );
      const result = await deleteClientCore(id, decoded.uid);
      res.status(200).json(result);
    } catch (e: any) {
      const msg = String(e?.message || "error");
      const code = String(e?.code || "");
      if (code === "failed-precondition") {
        res.status(412).json({ ok: false, error: msg });
        return;
      }
      if (code === "unauthenticated") {
        res.status(401).json({ ok: false, error: "UNAUTHENTICATED" });
        return;
      }
      res.status(500).json({ ok: false, error: msg });
    }
  }
);

export const deleteProject = onCall({ region }, async (req) => {
  const uid = req.auth?.uid || "";
  const data = (req.data || {}) as { id?: string; force?: boolean };
  return deleteProjectCore(
    { id: String(data.id || ""), force: !!data.force },
    uid
  );
});

export const deleteProjectHttp = onRequest(
  { region, cors: true },
  async (req: any, res: any) => {
    try {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }
      const authH = String(req.headers.authorization || "");
      const token = authH.startsWith("Bearer ") ? authH.slice(7) : "";
      if (!token) {
        res.status(401).json({ ok: false, error: "UNAUTHENTICATED" });
        return;
      }
      const decoded = await getAdminAuth().verifyIdToken(token);
      const id = String(
        req.method === "DELETE" ? req.query.id || "" : req.body?.id || ""
      );
      const force =
        req.method === "DELETE"
          ? String(req.query.force || "") === "true"
          : !!req.body?.force;
      const result = await deleteProjectCore({ id, force }, decoded.uid);
      res.status(200).json(result);
    } catch (e: any) {
      const msg = String(e?.message || "error");
      const code = String(e?.code || "");
      if (code === "failed-precondition") {
        res.status(412).json({ ok: false, error: msg });
        return;
      }
      if (code === "unauthenticated") {
        res.status(401).json({ ok: false, error: "UNAUTHENTICATED" });
        return;
      }
      res.status(500).json({ ok: false, error: msg });
    }
  }
);

export const createOrUpdateClient = onCall({ region }, async (req) => {
  const uid = req.auth?.uid;
  return upsertClientCore((req.data || {}) as ClientInput, String(uid || ""));
});
export const createOrUpdateClientHttp = onRequest(
  { region, cors: true },
  async (req: any, res: any) => {
    try {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }
      const authH = String(req.headers.authorization || "");
      const token = authH.startsWith("Bearer ") ? authH.slice(7) : "";
      if (!token) {
        res.status(401).json({ ok: false, error: "UNAUTHENTICATED" });
        return;
      }
      const decoded = await getAdminAuth().verifyIdToken(token);
      const result = await upsertClientCore(
        (req.body || {}) as ClientInput,
        decoded.uid
      );
      res.status(200).json(result);
    } catch (e: any) {
      const msg = String(e?.message || "error");
      if (msg.startsWith("DUPLICATE:")) {
        res.status(409).json({ ok: false, error: msg });
        return;
      }
      if (e?.code === "unauthenticated") {
        res.status(401).json({ ok: false, error: "UNAUTHENTICATED" });
        return;
      }
      res.status(500).json({ ok: false, error: msg });
    }
  }
);

export const createOrUpdateLead = onCall({ region }, async (req) => {
  const uid = req.auth?.uid;
  return upsertLeadCore((req.data || {}) as LeadInput, String(uid || ""));
});
export const createOrUpdateLeadHttp = onRequest(
  { region, cors: true },
  async (req: any, res: any) => {
    try {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }
      const authH = String(req.headers.authorization || "");
      const token = authH.startsWith("Bearer ") ? authH.slice(7) : "";
      if (!token) {
        res.status(401).json({ ok: false, error: "UNAUTHENTICATED" });
        return;
      }
      const decoded = await getAdminAuth().verifyIdToken(token);
      const result = await upsertLeadCore(
        (req.body || {}) as LeadInput,
        decoded.uid
      );
      res.status(200).json(result);
    } catch (e: any) {
      const msg = String(e?.message || "error");
      if (msg.startsWith("DUPLICATE:")) {
        res.status(409).json({ ok: false, error: msg });
        return;
      }
      if (e?.code === "unauthenticated") {
        res.status(401).json({ ok: false, error: "UNAUTHENTICATED" });
        return;
      }
      res.status(500).json({ ok: false, error: msg });
    }
  }
);

// PDFs
export const createQuotePdf = onRequest(
  { region, cors: true },
  async (req: any, res: any) => {
    try {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }
      const quoteId = String(req.query.quoteId || "").trim();
      if (!quoteId) {
        res
          .status(400)
          .json({ ok: false, error: "Missing quoteId (?quoteId=)" });
        return;
      }
      const url = await generateQuotePdf(quoteId);
      res.status(200).json({ ok: true, url });
    } catch (e: any) {
      console.error("[PDF][QUOTE][ERROR]", e?.stack || e);
      res.status(400).json({ ok: false, error: e?.message || "error" });
    }
  }
);

export const createInvoicePdf = onRequest(
  { region, cors: true },
  async (req: any, res: any) => {
    try {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }
      const invoiceId = String(req.query.invoiceId || "").trim();
      if (!invoiceId) {
        res
          .status(400)
          .json({ ok: false, error: "Missing invoiceId (?invoiceId=)" });
        return;
      }
      const url = await generateInvoicePdf(invoiceId);
      res.status(200).json({ ok: true, url });
    } catch (e: any) {
      console.error("[PDF][INVOICE][ERROR]", e?.stack || e);
      res.status(400).json({ ok: false, error: e?.message || "error" });
    }
  }
);

// ------------------------------------------------------------
// 12) Triggers
// ------------------------------------------------------------
export const onQuoteSigned = onDocumentUpdated(
  { region, document: "quotes/{quoteId}" },
  async (event: any) => {
    const before = event.data?.before?.data?.();
    const after = event.data?.after?.data?.();
    if (!before || !after) return;
    if (before.status === "signed" || after.status !== "signed") return;

    const quoteId = event.params?.quoteId;
    const quote = after;

    let clientId = quote.clientId as string | undefined;
    if (!clientId) {
      let snap: FirebaseFirestore.QuerySnapshot | null = null;
      if (quote?.sign?.signerEmail) {
        snap = await db
          .collection("clients")
          .where("email", "==", quote.sign.signerEmail)
          .limit(1)
          .get();
      }
      if (snap && !snap.empty) clientId = snap.docs[0].id;
      else {
        const ref = await db.collection("clients").add({
          name: quote?.sign?.signerName || "Cliente",
          email: quote?.sign?.signerEmail || null,
          phone: null,
          createdAt: FieldValue.serverTimestamp(),
        });
        clientId = ref.id;
      }
    }

    const projectRef = await db.collection("projects").add({
      clientId,
      title: quote.projectTitle,
      catalogCode: null,
      status: "aberto",
      productionStatus: "backlog",
      createdAt: FieldValue.serverTimestamp(),
    });
    const projectId = projectRef.id;

    const tasks = [
      { title: "Briefing editorial", status: "aberta" },
      { title: "Revisão de original", status: "aberta" },
      { title: "Diagramação", status: "aberta" },
    ];
    for (const t of tasks) {
      await db
        .collection("projects")
        .doc(projectId)
        .collection("tasks")
        .add({
          ...t,
          createdAt: FieldValue.serverTimestamp(),
        });
    }

    const tot = computeTotals(quote);
    const installments = (
      total: number,
      plan: any
    ): { amount: number; dueDate: Timestamp }[] => {
      const out: { amount: number; dueDate: Timestamp }[] = [];
      const base = dayjs().startOf("day");
      if (plan?.type === "avista") {
        out.push({ amount: total, dueDate: Timestamp.fromDate(base.toDate()) });
        return out;
      }
      const n = Math.max(1, Number(plan?.installments || 1));
      let remaining = total;
      for (let i = 0; i < n; i++) {
        const due = base
          .add(i + 1, "month")
          .date(plan?.dueDay || 5)
          .toDate();
        let part = Number((total / n).toFixed(2));
        if (i === n - 1) part = Number(remaining.toFixed(2));
        remaining -= part;
        out.push({ amount: part, dueDate: Timestamp.fromDate(due) });
      }
      return out;
    };

    const paymentSchedule = installments(
      Number(tot.grandTotal || quote.total || 0),
      quote.paymentPlan || {}
    ).map((it) => ({
      amount: it.amount,
      dueDate: it.dueDate,
      status: "aberta",
      invoiceId: null,
    }));

    const orderRef = await db.collection("orders").add({
      quoteId,
      clientId,
      projectId,
      total: Number(tot.grandTotal || quote.total || 0),
      status: "aberto",
      paymentSchedule,
      createdAt: FieldValue.serverTimestamp(),
    });

    await db.collection("quotes").doc(quoteId).update({
      clientId,
      projectId,
      orderId: orderRef.id,
    });
  }
);

export const onProjectReadyForPrint = onDocumentUpdated(
  { region, document: "projects/{projectId}" },
  async (event: any) => {
    const before = event.data?.before?.data?.();
    const after = event.data?.after?.data?.();
    if (!before || !after) return;

    const was = before.productionStatus;
    const now = after.productionStatus;
    if (was === "pronto_para_grafica" || now !== "pronto_para_grafica") return;

    const projectId = event.params?.projectId;

    const orders = await db
      .collection("orders")
      .where("projectId", "==", projectId)
      .limit(1)
      .get();
    if (orders.empty) return;
    const orderId = orders.docs[0].id;

    const itemsSnap = await db
      .collection("projects")
      .doc(projectId)
      .collection("productionItems")
      .get();
    const items = itemsSnap.docs.map((d) => d.data() as any);
    if (items.length === 0) {
      items.push({ name: "Impressão do miolo", qty: 1 });
    }

    await db.collection("purchases").add({
      orderId,
      projectId,
      items,
      status: "pendente",
      createdAt: FieldValue.serverTimestamp(),
    });
  }
);

export const assignClientNumber = onDocumentCreated(
  { region, document: "clients/{clientId}" },
  async (event: any) => {
    const snap = event.data;
    if (!snap) return;
    const clientRef = db.doc(snap.ref.path);
    const data = snap.data() as any;
    if (
      data?.clientNumber !== undefined &&
      data?.clientNumber !== null &&
      data?.clientNumber !== ""
    )
      return;

    const countersRef = db.doc("counters/clients");
    await db.runTransaction(async (trx) => {
      const countersSnap = (await trx.get(countersRef as any)) as any;
      const c = countersSnap?.exists ? countersSnap.data() || {} : {};
      const next = Number(c.next || 1);
      trx.update(clientRef as any, {
        clientNumber: next,
        updatedAt: FieldValue.serverTimestamp(),
      });
      trx.set(
        countersRef as any,
        { next: next + 1, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    });
  }
);

export const assignProjectCatalogCode = onDocumentCreated(
  { region, document: "projects/{projectId}" },
  async (event: any) => {
    const snap = event.data;
    if (!snap) return;
    const projRef = db.doc(snap.ref.path);
    const proj = snap.data() as any;
    if (proj?.catalogCode) return;

    const clientId: string | undefined = proj?.clientId;
    const productType: string | undefined = proj?.productType;
    if (!clientId) return;

    const clientDoc = await db.doc(`clients/${clientId}`).get();
    if (!clientDoc.exists) return;
    const clientData = clientDoc.data() as any;
    const rawClientNumber = clientData?.clientNumber as unknown;
    const clientNumber =
      typeof rawClientNumber === "number"
        ? rawClientNumber
        : Number(rawClientNumber);
    if (!Number.isFinite(clientNumber)) return;

    const prefix = (t?: string) => {
      const v = String(t || "").toLowerCase();
      if (v === "l" || v.includes("livro")) return "L";
      if (v === "c" || v.includes("cd")) return "C";
      if (v === "d" || v.includes("dvd")) return "D";
      if (v === "x" || v.includes("outros")) return "X";
      return "X";
    };
    const base = `DDM${prefix(productType)}${String(clientNumber).padStart(
      4,
      "0"
    )}`;
    const counterRef = db.doc(`client_project_counters/${clientId}`);

    await db.runTransaction(async (trx) => {
      const freshProj = (await trx.get(projRef as any)) as any;
      if (freshProj?.exists && (freshProj.data() as any)?.catalogCode) return;

      const counterSnap = (await trx.get(counterRef as any)) as any;
      const next = Number(
        counterSnap?.exists ? (counterSnap.data() as any)?.next ?? 0 : 0
      );
      const code = next === 0 ? base : `${base}.${next}`;

      trx.set(
        projRef as any,
        { catalogCode: code, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
      trx.set(
        counterRef as any,
        { next: next + 1, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    });
  }
);

export const onClientDeletedReleaseUnique = onDocumentDeleted(
  { region, document: "clients/{clientId}" },
  async (event: any) => {
    const clientId = event.params?.clientId;
    if (!clientId) return;
    await releaseAllKeysForOwner("clients", clientId);
  }
);

export const onLeadDeletedReleaseUnique = onDocumentDeleted(
  { region, document: "leads/{leadId}" },
  async (event: any) => {
    const leadId = event.params?.leadId;
    if (!leadId) return;
    await releaseAllKeysForOwner("leads", leadId);
  }
);

// FIM DO ARQUIVO
