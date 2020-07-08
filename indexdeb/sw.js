importScripts('js/sw-utils.js')
// esto es algo solo de los sw

const STATIC_CACHE = 'static-v1'
const DINAMYC_CACHE = 'dinamyc-v1'
const INMUTABLE_CACHE = 'inmutable-v1'

const APP_SHELL = [
    '/',
    'index.html',
    'style/base.css',
    'style/bg.png',
    'js/app.js',
    'js/base.js',
    'js/sw-utils.js'

]

const APP_SHELL_INMUTABLE = [
    'http://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js',
     
]

// cachear cosas
self.addEventListener('install', e => {
    

    e.waitUntil(

        caches.open(STATIC_CACHE).then((cache) => {
          
            cache.addAll(APP_SHELL)

        }).catch((err) => {
            console.log(err);
        }),

        caches.open(INMUTABLE_CACHE).then((cache) => {
          
            cache.addAll(APP_SHELL_INMUTABLE)
            
        }).catch((err) => {
            console.log(err);
        })
    )

})


// ver si hay caches viejos y borrar
self.addEventListener('activate', e => {

    e.waitUntil(
        
         caches.keys().then( keys => {

            keys.forEach( key => {

                if (  key !== STATIC_CACHE && key.includes('static') ) {
                    return caches.delete(key);
                }

                if (  key !== DINAMYC_CACHE && key.includes('dinamyc') ) {
                    return caches.delete(key);
                }

            });

        })
    )


})


// network fallback

self.addEventListener('fetch', e => {

    const res = caches.match( e.request ).then( res => {

        if (res) return res
        else return fetch( e.request ).then( res => {

            return actualizarCacheDinamico( DINAMYC_CACHE, e.request, res )
        })
    })
    e.respondWith( res )

})