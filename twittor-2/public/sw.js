// imports
// no nos sirve ponerlo en el index porq el sw corre en una instancia distinta
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js')
importScripts('js/sw-db.js')
importScripts('js/sw-utils.js')


const STATIC_CACHE    = 'static-v1';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js',
    'js/sw-db.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js',
    'js/libs/plugins/mdtoast.min.css',
    "js/libs/plugins/mdtoast.min.js"
];



self.addEventListener('install', e => {


    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));



    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});




self.addEventListener( 'fetch', e => {

    let respuesta
    // console.log(e.request.method)


    if (e.request.url.includes('/api')) {


        respuesta = manejoApiMensajes(DYNAMIC_CACHE,e.request)
    } else {

        respuesta = caches.match( e.request ).then( res => {
    
            if ( res ) {
                
                actualizaCacheStatico( STATIC_CACHE, e.request, APP_SHELL_INMUTABLE );
                return res;
            } else {
    
                return fetch( e.request ).then( newRes => {
    
                    return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
    
                });
    
            }
    
        });
    }





    e.respondWith( respuesta );

});


// tareas asincronas

self.addEventListener('sync', e => {

    // se dispara cuando haya internet

    console.log('SW: sync');

    if ( e.tag === 'nuevo-post') {

        // postear a db cuando hay conexion

        

        console.log('waiteando');
        // haremos que haga el posteo al "servidor"
        e.waitUntil( postearMensaje() )
    }
})

// escuchar push

self.addEventListener('push', e => {

    // console.log(e)
    
    const data = JSON.parse( e.data.text() )

    console.log(data)
    
    const title = data.titulo
    const options = {
        body: data.mensaje,
        icon: `img/avatars/${data.usuario}.jpg`,
        badge: 'img/favicon.ico',
        image: 'https://vignette.wikia.nocookie.net/memes-pedia/images/4/47/Download-0.jpg/revision/latest/top-crop/width/360/height/450?cb=20200528183809&path-prefix=es',
        vibrate: [150,150,150,150,75,75,150,150,150,150,450],
        openUrl: '/',
        data:{
            // url: 'https://google.com',
            url: '/',
            id:  data.usuario 
            // aqui puede ir lo q sea q queramos
        },
        actions:[
            {
                action: 'thor-action',
                title: 'Thor',
                icon: 'img/avatars/thor.jpg'
            },
            {
                action: 'ironman-action',
                title: 'Ironman',
                icon: 'img/avatars/ironman.jpg'
            }

        ]

    }

    // esperamos a la notificacion
    e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclose', e => {
    console.log('notificacion cerrada',e);
})

self.addEventListener('notificationclick', e => {

    const notificacion = e.notification

    const action = e.action

    console.log({notificacion,action});

    // agarrar todos los tabs abiertos del mismo sitio
    const resp = clients.matchAll()
    .then(clientes => {

        // vemos si hay alguno activo
        let client = clientes.find( c => c.visibilityState === 'visible')

        if (client !== undefined) {
            client.navigate(notificacion.data.url)
            client.focus()
        } else {
            clients.openWindow(notificacion.data.url)

        }
        return notificacion.close()
    })

    // hace referencia a todos los tabs

    e.waitUntil(resp)

})