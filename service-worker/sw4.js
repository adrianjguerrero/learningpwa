// estategias de cache offline 2

// const CACHE_NAME = 'prueba-1'
const CACHE_STATIC = 'static-v4'
// para nuestra app shell

const CACHE_INMUTABLE = 'inmutable-v1'
// cosas estaticas pero q no controlamos, como boostrap por cdn

const CACHE_DINAMIC = 'dinamic-v1'
// para cosas q vienen de internet q no tenemos en cache


function limpiarCache( cacheName, numeroItems) {

    caches.open( cacheName ).then( cache =>{

        return cache.keys()
        .then( keys => {
            if ( keys.length > numeroItems ) {
                cache.delete( keys[0] )
                .then( limpiarCache( cacheName,5 ))
                // hacemos que sea recursiva porque si no solo borra una vez
            }
        })
    })
}

self.addEventListener('install',event => {

    // le dicimos al evento que espere a que esto termine,
    // esto porq la instalacion es muy rapida y no espera a nada
    event.waitUntil(

        // y pues la escritura a cache es bastante lenta

        
        caches.open( CACHE_STATIC ).then( cache => {
            // todo esto que guardamos lo consideramos APP SHELL
            // los archivos base para que nuestra aplicacion funcione
            return cache.addAll([
                '/',
                // si no ponemos este slash da error de q no paccede
                // cacheamos "la raiz", el lugar al que accedemos
                '/index.html',
                '/css/style.css',
                '/js/app.js',
                '/img/main.jpg',
    
            ])
        }),

        // ESA COMO DE AHI ES PORQUE ESTE WAILT UNTIL RECIBE P R O M E S A S
        // ENTONCES AQUI VAN PURAS PROMESAS, VIEN SEA COMO PROMISE.ALL
        // O ASI PONEINDOLAS CON COMAS

        caches.open( CACHE_INMUTABLE ).then( cache => 
             cache.addAll([
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
    
            ])
        )

    )
})



self.addEventListener('fetch', e => {


// estrategia cache only
    // e.respondWith( caches.match( e.request ) )
    // respondemos con lo que este en cache


// estrategia cache with network fallback
    const source = caches.match( e.request ).then( res => { 
        
        // si esta en cache, dale de ahi
        if (res) return res
    
        console.log('no existe en cache',e.request.url);


        // si no, vete al internet
        return fetch( e.request).then(res => {
            
            // y ya q te fuiste a internet, guardalo en cache
            caches.open( CACHE_DINAMIC ).then( cache => {

                cache.put( e.request, res)
                // la peticion, y q queremos regresar

                limpiarCache(CACHE_DINAMIC,5)
                // por cada registro limpiaremos el cache
            })
            // devolvemos un clone, porq en put ya estamos devolviendo a res
            // entonces da un error
            return res.clone()
        })
    })


    e.respondWith( source )
        





})