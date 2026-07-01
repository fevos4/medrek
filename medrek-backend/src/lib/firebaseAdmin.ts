let admin: any = null

function getAdmin() {
  if (admin) return admin
  
  try {
    const rawFirebaseAdmin = require('firebase-admin')
    const firebaseAdmin = rawFirebaseAdmin.default || rawFirebaseAdmin
    
    if (firebaseAdmin.apps && firebaseAdmin.apps.length > 0) {
      admin = firebaseAdmin
      return admin
    }

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    if (!serviceAccountJson) {
      console.warn('FIREBASE_SERVICE_ACCOUNT_JSON not set — Google auth disabled')
      return null
    }

    const serviceAccount = JSON.parse(serviceAccountJson)
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount)
    })
    admin = firebaseAdmin
    return admin
  } catch (err) {
    console.error('Firebase Admin init error:', err)
    return null
  }
}

module.exports = { getAdmin }