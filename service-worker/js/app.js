if ( navigator.serviceWorker ) {

    // navigator.serviceWorker.register('/sw.js')
    navigator.serviceWorker.register('/sw5.js')
    // .then( reg => {
        // setTimeout(() => {
            
        //     reg.sync.register('posteo-fotos')
        //     // registramos en el sync una tarea pendiuente mientras no habia internet
        //     console.log('fotos han sido enviadas al server');

        //     // obviamente estamos aqui simulando, se tiene q instalar el sw y tiramos el cable para ver lol
        // }, 3000);

        // Notification.requestPermission().then( result => {
        //     console.log(result);
        //     reg.showNotification('baby, 1 2 3, lalala')
        // })
    // })

}


// probando caches   
// if ( window.caches ) {

    
//     // ver si existe
//     // caches.has( 'prueba-1' ).then( console.log )

//     // abrir cache
//     caches.open('prueba-1').then( cache => {
//         // agregando uno
//         // cache.add('./index.html')

//         // agregando varios
//         cache.addAll([
//             '/index.html',
//             '/css/style.css',
//             '/img/main.jpg'
//         ]).then( () => {

//             // borrar, si lo hacemos afuera falla porq la escritura en cache es mas lenta,
//             // entonces es mejor hacerlo en promesa
//             // cache.delete('/css/style.css')

//             // cambiando lo que ya esta cacheado por otra cosa
//             cache.put('index.html', new Response('I NEED LOVE'))
//         })

//         // leyendo de cache
//         cache.match('./index.html').then( res => res.text().then(console.log))

        
//     })

    
//     // leer caches
//     caches.keys().then( console.log)
// }


// if( window.SyncManager){}