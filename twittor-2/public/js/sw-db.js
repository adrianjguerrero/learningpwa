// utilidaes para grabar puchdb

const db = new PouchDB('mensajes')

function guardarMensaje(mensaje){
    // guardar mensajes en pouchdb

    mensaje._id = new Date().toISOString()

    return db.put(mensaje).then((result) => {

        self.registration.sync.register('nuevo-post')

        const respuesta = {ok: true, offline: true}

        return new Response(JSON.stringify( respuesta ))
        console.log('mensaje guardado')
    }).catch((err) => {

        console.log('mensaje no guardado',err)
    });
}

function postearMensaje() {

    // nos traeremos todos los docs guardados mientras se usaba la app
    // y cada uno lo lanzaremos al sv cuando haya internet
    // recordar q esta funcion solo se usa cuando hay internet, o cuando se recupera el internet

    return db.allDocs( {include_docs:true})
    .then(docs => {


        // so, ya que necesitamos awaitear, y el awaiteo es con promesas, entonces...
        // usemos map para retornar un arreglo de promesas
        // y usemos promose all para q respere tooodas esas promesas
        return Promise.all(docs.rows.map(row => {
            
            const doc = row.doc

            fetch('/api',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(doc)
            }).then( res => res.json())
            .then(res => {

                console.log('sw-db ok:',res)
                return db.remove(doc)
            })
            .catch(err => console.log('sw-db fail:', err))
        }))
    })
    
}