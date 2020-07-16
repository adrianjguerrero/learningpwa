const urlbase64 = require('urlsafe-base64')
const vapid = require('./vapid.json')

// es mejor encodear las vainas, asi van mas seguro
module.exports.getKey = () => urlbase64.decode( vapid.publicKey)