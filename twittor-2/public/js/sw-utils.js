

// Guardar  en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ) {


    if ( res.ok ) {

        return caches.open( dynamicCache ).then( cache => {

            cache.put( req, res.clone() );
            
            return res.clone();

        });

    } else {
        return res;
    }

}

// Cache with network update
function actualizaCacheStatico( staticCache, req, APP_SHELL_INMUTABLE ) {


    if ( APP_SHELL_INMUTABLE.includes(req.url) ) {
        // No hace falta actualizar el inmutable
        // console.log('existe en inmutable', req.url );

    } else {
        // console.log('actualizando', req.url );
        return fetch( req )
                .then( res => {
                    return actualizaCacheDinamico( staticCache, req, res );
                });
    }



}


// network with cache fallback
function manejoApiMensajes(cacheName, request) {

    if(request.url.indexOf('api/key') >= 0 || request.url.indexOf('api/subscribe') >= 0) {
        // para q no almacene las peticiones a llave
        return fetch(request)
    }

    
    else if (request.clone().method === 'POST') {

        if(self.registration.sync){
            // si el navegador soporta sync, guardare
            
            console.log(request.clone().method)
    
            // obtenemos lo q se esta haciendo post
    
                return request.clone().json()
                .then( body => {
                    console.log(body)
                    return guardarMensaje(body)
                })
        } else {
            return fetch(request)
        }


    }else{

        return fetch (request)
        .then(res => {
            if (res.ok) {
                actualizaCacheDinamico(cacheName,request,res.clone())
                return res
            } else {
                return caches.match(request)
            }
        })
        .catch(caches.match(request))
    }

}