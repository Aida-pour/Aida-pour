import admin from 'firebase-admin';
if (!admin.apps.length) {
  const sa = process.env.FIREBASE_ADMIN_SDK_JSON ? JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON) : undefined;
  admin.initializeApp({ credential: sa ? admin.credential.cert(sa) : admin.credential.applicationDefault() });
}
export async function verifyFirebaseToken(token: string) { return admin.auth().verifyIdToken(token); }
export const firebaseAuth = admin.auth();
