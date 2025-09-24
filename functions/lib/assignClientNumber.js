"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignClientNumber = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
(0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
exports.assignClientNumber = (0, firestore_1.onDocumentCreated)("clients/{id}", async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const ref = snap.ref;
    const counterRef = db.collection("_counters").doc("clients");
    await db.runTransaction(async (tx) => {
        const counter = await tx.get(counterRef);
        const current = counter.exists ? counter.data().value : 0;
        const next = current + 1;
        tx.set(counterRef, { value: next, updatedAt: firestore_2.FieldValue.serverTimestamp() }, { merge: true });
        tx.update(ref, { clientNumber: next });
    });
});
