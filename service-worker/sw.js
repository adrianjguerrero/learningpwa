// fetcheando con el ws, trayendo cosas cambiando cosas

self.addEventListener('fetch', event => {

    // cambiando peticiones
    // if ( event.request.url.includes('.jpg') ) {
    //     event.respondWith( fetch('img/main-patas-arriba.jpg'))
    // } else if ( event.request.url.includes('style.css') ){

    //     // response es una respuesta de fetch
    //     const resp =  new Response(`
    //         body {background:red;color:pink;}
    //     `,
    //     {
    //         headers: {
    //             'Content-Type' : 'text/css'
    //         }
    //     }) 
    //     // podemos alterar css! wtf

    //     event.respondWith( resp )
    // } else {
    //     event.respondWith( fetch(event.request) )

    // }


    // handleo de 404
    if ( event.request.url.includes('.jpg') ) {
        
        event.respondWith(

            fetch(event.request).then( resp => resp.ok ? resp : fetch('img/main-patas-arriba.jpg') )
        )
    }





})