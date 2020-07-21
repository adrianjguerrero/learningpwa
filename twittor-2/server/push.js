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
let suscripciones = require('./subs-db.json')

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

    const notificacionesEnviadas = []
    suscripciones.forEach( (sub,i)=> {


        const pushProm = webpush.sendNotification(sub, JSON.stringify(post))
        .then( console.log('notificacion enviada'))
        .catch( err => {
            console.log('notificacion fallo')

            if ( err.statusCode == 410 ) { /* gone, ya no existe */

                suscripciones[i].borrar = true
            }
        })

        notificacionesEnviadas.push(pushProm)
    })

    Promise.all(notificacionesEnviadas).then( () => {

        suscripciones = suscripciones.filter(sub => !sub.borrar)

        fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones))
    })
}