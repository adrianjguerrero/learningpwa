// ciclo de vida de los service worker

self.addEventListener('install',event => {
  
    console.log('sw instalandose, solo se dispar 1 vez si ya hay otro, si no hay nada tambien se dispara, se dispara con cada cambio');  

    // podemos evitar la espera con esto:

    // self.skipWaiting()

    // pero no es recomendable porq nuestros usuarios pueden estar usando con cosas del sw anterior, notificaciones o algo





    // los eventos de los sw tienen algo llamado waitUntil, que literal es para esperar, se usan con promesas

    const instalacion = new Promise( ( resolve, reject ) => {
        setTimeout(() => {
            console.log('sw instalado, se procede a cachear o yoqse');
            resolve()
        },3000);
    })

    event.waitUntil( instalacion )
})

self.addEventListener('activate', event => {

    console.log('activacion, el anterior sw muere, y el sw toma control de la aplicacion, va despeus de la activacion');
})

self.addEventListener('fetch', event => {

    // aqui se suele aplicar estrategias de cache

})



// sync: cuando perdemos conexion a internet y la recuperamos, el sync siempre esta como comprobando que exista internet

self.addEventListener('sync', event => {

    console.log('volvio el internet');
    console.log(event.tag);
})


// push: maneja las notificaciones push

self.addEventListener('push', event => {

    console.log('notificacion recibida');
})