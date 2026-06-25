const admin = require('firebase-admin');
let serviceAccount;

try {
    serviceAccount = require('./firebaseServiceAccount.json');
} catch (error) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        throw new Error("Firebase Service Account not found. Add it to .env or create firebaseServiceAccount.json");
    }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
