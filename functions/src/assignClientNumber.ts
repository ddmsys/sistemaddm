import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp();

const db = getFirestore();

export const assignClientNumber = onDocumentCreated(
  "clients/{id}",
  async (event: any) => {
    const snap = event.data;
    if (!snap) return;
    const ref = snap.ref;

    const counterRef = db.collection("_counters").doc("clients");

    await db.runTransaction(async (tx) => {
      const counter = await tx.get(counterRef);
      const current = counter.exists ? (counter.data()!.value as number) : 0;
      const next = current + 1;
      tx.set(
        counterRef,
        { value: next, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
      tx.update(ref, { clientNumber: next });
    });
  }
);
