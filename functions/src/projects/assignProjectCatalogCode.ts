import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v2';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const assignProjectCatalogCode = functions.firestore.onDocumentCreated(
  {
    region: 'southamerica-east1',
    document: 'projects/{projectId}',
  },
  async (event) => {
    const projectDoc = event.data;
    if (!projectDoc) return;

    const data = projectDoc.data() as {
      catalogCode?: string;
      category?: string;
      clientId?: string;
    };

    if (!data || (typeof data.catalogCode === 'string' && data.catalogCode.length > 0)) {
      return;
    }

    try {
      await admin.firestore().runTransaction(async (transaction) => {
        const clientRef = admin.firestore().collection('clients').doc(data.clientId!);
        const clientDoc = await transaction.get(clientRef);

        if (!clientDoc.exists) {
          throw new Error('Cliente não encontrado para gerar catalogCode');
        }

        const clientData = clientDoc.data() as { clientNumber: string };
        const clientNumber = clientData.clientNumber.padStart(4, '0');

        const baseCodePrefix = `DDM${data.category || 'X'}${clientNumber}`;

        // Buscar projetos existentes para este cliente do mesmo tipo para contar trabalhos
        const projectsQuery = admin
          .firestore()
          .collection('projects')
          .where('clientId', '==', data.clientId)
          .where('category', '==', data.category);

        const projectsSnapshot = await projectsQuery.get();

        const workCount = projectsSnapshot.size;

        const finalCatalogCode =
          workCount === 0 ? baseCodePrefix : `${baseCodePrefix}.${workCount}`;

        transaction.update(projectDoc.ref, {
          catalogCode: finalCatalogCode,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
    } catch (error) {
      console.error('Erro ao atribuir código de catálogo:', error);
      throw new functions.https.HttpsError('internal', 'Erro processando código do projeto');
    }
  },
);
