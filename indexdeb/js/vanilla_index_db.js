
// indexedDB: Reforzamiento
if ( window.indexedDB ) {

    let request = window.indexedDB.open('mi-db',1)

    // este codigo se dispara cuando se crea o cambia de version la db

    request.onupgradeneeded = e => {

        console.log('Update de bd');

        let db = e.target.result

        db.createObjectStore('heroes',{
            keyPath: 'id'
        })
    }

    // manejor de errores

    request.onerror = e => {
        console.log('DB Error',e.target.error);
    }

    // inserccion de datos

    request.onsuccess = e => {

        let db = e.target.result

        let heroesData = [
            {
                id: 1,
                heroe: 'spiderman',
                msg:'telaraña telachupo'
            },
            {
                id: 2,
                heroe: 'ironman',
                msg:'iron nou'
            }
        ]

        // para guardar se tiene que crear una transaccion, esta sera de lectura y escritura
        let heroesTransaction = db.transaction('heroes', 'readwrite')


        // manejo de errores y fallos
        heroesTransaction.onerror = e => {

            console.log('error guardando', e.target.error);
        }

        heroesTransaction.oncomplete = e => {

            console.log('Transaaccion hecha');
        }

        // referencia a donde se va a guardar
        let heroeStore = heroesTransaction.objectStore('heroes')

        for (const heroe of heroesData) {
            
            heroeStore.add(heroe)
        }

        heroeStore.onsuccess = e => {

            console.log('nuevo item en la bd');
        }


    }
}


