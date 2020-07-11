// utilidaes para grabar puchdb

const db = new PouchDB('mensajes')

function guardarMensaje(mensaje){

    mensaje._id = new Date().toISOString()

    db.put(mensaje).then((result) => {
        console.log('mensaje guardado')
    }).catch((err) => {
        console.log('mensaje no guardado',err)
    });
}

