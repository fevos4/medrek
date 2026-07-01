const { initializeApp, getApps, cert } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const path = require('path')

if (!getApps().length) {
  initializeApp({
    credential: cert(
      path.join(__dirname, '../../firebase-service-account.json')
    )
  })
}

module.exports = { admin: { auth: getAuth } }
