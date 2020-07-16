const urlbase64 = require('urlsafe-base64')
const vapid = require('./vapid.json')

const suscripciones = []

// es mejor encodear las vainas, asi van mas seguro
module.exports.getKey = () => urlbase64.decode( vapid.publicKey)

module.exports.addSubscription = (subscription) =>{
    
    suscripciones.push(subscription)

    console.log(suscripciones);

}