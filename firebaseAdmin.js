const admin = require('firebase-admin');
require('dotenv').config();   // loads .env*.local for local dev

// Helper: safely parse JSON from env (returns null if missing/invalid)
function getServiceAccount() {
  const raw = process.env.FIREBASE_ADMIN_SDK;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Invalid FIREBASE_ADMIN_SDK JSON');
    return null;
  }
}

// Initialize only once
if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();

  if (!serviceAccount) {
    throw new Error(
      'FIREBASE_ADMIN_SDK env var is missing or invalid. ' +
      'Add it in Vercel Dashboard or .env.local.'
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Optional: if you use Realtime DB
    // databaseURL: 'https://devcratexadmin.firebaseio.com',
  });
}

const db = admin.firestore();
module.exports = { admin, db };