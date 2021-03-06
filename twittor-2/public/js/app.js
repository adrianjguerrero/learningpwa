
var url = window.location.href;
var swLocation = '/twittor/sw.js';

var serviceWorkerRec;

if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }

    window.addEventListener('load', function() {

        navigator.serviceWorker.register( swLocation )
        .then(function(reg) {

            serviceWorkerRec = reg

            // para ver si estamos subscrito a las notificaciones
            serviceWorkerRec.pushManager.getSubscription()
            .then(verificaSub)


        });
    })

}





// Referencias de jQuery

var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

var btnActivada = $('.btn-noti-activadas')
var btnDesactivada = $('.btn-noti-desactivadas')
// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;




// ===== Codigo de la aplicaciÃ³n

function crearMensajeHTML(mensaje, personaje) {

    var content =`
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();

}



// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


// Seleccion de personaje
avatarBtns.on('click', function() {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});

// Boton de cancelar mensaje
cancelarBtn.on('click', function() {
    if ( !modal.hasClass('oculto') ) {
        modal.animate({ 
            marginTop: '+=1000px',
            opacity: 0
         }, 200, function() {
             modal.addClass('oculto');
             txtMensaje.val('');
         });
    }
});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    data = {
        mensaje: mensaje,
        personaje: usuario
    }

    fetch('/api',{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    }).then( res => res.json())
    .then(res => console.log('app ok:',res))
    .catch(err => console.log('app fail:', err))

    crearMensajeHTML( mensaje, usuario );

});

// opbtener mensajes del servidor

function obtenerMensajes() {
    
    fetch('/api')
    .then(res => res.json())
    .then( data => {
        console.log(data)
        data.forEach(mensaje => {
            crearMensajeHTML(mensaje.mensaje,mensaje.personaje)
        });
    })
    .catch(console.log)
}

obtenerMensajes()


// detectar cambios de internet

function isOnline() {

    if (navigator.onLine) {

        // hay conexion 
        // console.log('hay internet')

        mdtoast('Online',{
            interation: true,
            interationTimeOut: 1000,
            actionText: 'Ok',
            type: 'success',
            action: function(){
                this.hide(); // this is the toast instance
            }
        })

    } else {

        // console.log('no hay internet')

        mdtoast('Offline',{
            interation: true,
            actionText: 'fuck',
            type: 'danger',
            action: function(){
                this.hide(); // this is the toast instance
            }
        })
    }
}

window.addEventListener('online', isOnline)
window.addEventListener('offline', isOnline)

isOnline()

function enviarNotificacion() {

    const notificacionOptions = {
        body: 'hola',
        icon: 'img/icons/icon-72x72.png'
    }
    const notification = new Notification('Titulito',notificacionOptions)

    notification.onclick = () => console.log('cleck');
}

function notificarme() {

    if (window.Notification) {

        if (Notification.permission === 'granted') {

            // new Notification('HOLAAAAAAAAAA')
            enviarNotificacion()
        } else if (Notification.permission !== 'denied' || Notification.permission === 'default' ) {

            Notification.requestPermission( function(permission){
                enviarNotificacion()
                // new Notification('VAMOS CARAJOOOOOOOOOOO')
            }) 
        }

    }
    else {
        console.log('este navegador no soporta notificaciones');
        return 
    }
}

// notificarme()


function verificaSub(activada) {

    console.log(activada);

    if (activada) {

        btnActivada.removeClass('oculto')
        btnDesactivada.addClass('oculto')

    } else {

        btnDesactivada.removeClass('oculto')
        btnActivada.addClass('oculto')

    }
}

// obtenterkey para las notificaciones
function getPublicKey() {

    // fetch('api/key').then(res => res.json()).then(res => console.log(res))

    return fetch('api/key')
    .then(res => res.arrayBuffer())
    // luego de arraybuffer, retornar como uint8array
    .then(key => new Uint8Array(key))

}

// getPublicKey().then(console.log)

btnDesactivada.on('click', function () {

    if (!serviceWorkerRec) {
        console.log('no hay registro de sw')
    } else {

        // toda esta wea genera una wea en el servidor dependiendo del navegador
        // q luego como q se matchea con el privatekey del server o.o wea medio completa
        getPublicKey().then(function (key) {
            
            serviceWorkerRec.pushManager.subscribe({
                userVisibleOnly:true,
                applicationServerKey: key
            }).then( res => res.toJSON())
            .then(function (suscripcion) {
                
              fetch('api/subscribe',{
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(suscripcion)
              }).then(verificaSub)
              .catch(cancelarSub)

              
            })
        })
    }

})

function cancelarSub() {

    // para quitar las notificaciones
    serviceWorkerRec.pushManager.getSubscription()
    .then(sub => {
        sub.unsubscribe()
        .then( () => verificaSub(false))
    })
}

btnActivada.on('click',function() {
    cancelarSub()
})