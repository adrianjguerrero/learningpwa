// estategias de cache offline 1

self.addEventListener('fetch',event => {


    // devolviendo un string normal
    // const offlineResponse = new Response('NECESITAS INTERNET PARA USAR ESTA WEB')


    // devolviendo un html, este necesita headers
    // const offlineResponse = new Response(`
    
    //     <h1>NECESITAS INTERNET PARA USAR ESTA WEB</h1>


    // `,{
    //     headers: {
    //         'Content-Type' : 'text/html'
    //     }
    // })


    // const offlineResponse = fetch('./offline.html')

    const resp = fetch(event.request ).catch( () => offlineResponse)

    event.respondWith ( resp )
})