const fs = require('fs')

const urlbase64 = require('urlsafe-base64')
const vapid = require('./vapid.json')

const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:adrianjguerrero87@gmail.com',
    vapid.publicKey,
    vapid.privateKey
  );


// simulacion de db lol
const suscripciones = require('./subs-db.json')

// es mejor encodear las vainas, asi van mas seguro
module.exports.getKey = () => urlbase64.decode( vapid.publicKey)

module.exports.addSubscription = (subscription) =>{
    
    suscripciones.push(subscription)
    
    // guardaremos en un archivo pos puro por simular
    fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones))

    console.log(suscripciones);

}

module.exports.sendPush = (post) => {
    // mandando notificaciones

    suscripciones.forEach( (sub,i)=> {

        webpush.sendNotification(sub, post.titulo)
    })
}