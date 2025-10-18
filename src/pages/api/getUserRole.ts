import { doc, getDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.query;
  if (!uid || typeof uid !== 'string') {
    return res.status(400).json({ error: 'UID não informado' });
  }
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  const data = userDoc.data();
  res.status(200).json({ role: data.role || 'user' });
}
