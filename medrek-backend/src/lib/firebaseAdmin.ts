const firebaseAdminModule = require('firebase-admin')

// firebase-admin v14 exports these at the top level
const { initializeApp, getApps, cert } = firebaseAdminModule

let adminAuth: any = null

function getAdmin() {
  if (adminAuth) return adminAuth

  try {
    // Already initialized — reuse the existing app
    if (getApps().length > 0) {
      const { getAuth } = require('firebase-admin/auth')
      adminAuth = { auth: () => getAuth() }
      return adminAuth
    }

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    if (!serviceAccountJson) {
      console.warn('FIREBASE_SERVICE_ACCOUNT_JSON not set — Google auth disabled')
      return null
    }

    const serviceAccount = JSON.parse(serviceAccountJson)
    initializeApp({ credential: cert(serviceAccount) })

    const { getAuth } = require('firebase-admin/auth')
    adminAuth = { auth: () => getAuth() }
    return adminAuth
  } catch (err) {
    console.error('Firebase Admin init error:', err)
    return null
  }
}

module.exports = { getAdmin }