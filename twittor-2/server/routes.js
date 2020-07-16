// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();
const push = require('./push')


const mensajes = [
  {
    id:'.i.',
    personaje:'spiderman',
    mensaje: 'hoal'
  },
  {
    id:'.i.',
    personaje:'hulk',
    mensaje: 'xD'
  }
]


// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json(mensajes);
});


router.post('/', function (req, res) {

  const mensaje = {
    mensaje: req.body.mensaje,
    personaje: req.body.personaje
  }

  mensajes.push(mensaje)

  console.log(mensajes);
  res.json({ok:true,mensaje:mensaje});
});

router.post('/subscribe', function (req, res) {


  const subscripcion = req.body

  console.log(subscripcion)

  push.addSubscription(subscripcion)
  res.json('subscribe');
});

router.get('/key', function (req, res) {

  // las vapidkeys son un juego de llaves q nos permiten enviar notificaciones

  // hay q tener cuidado, cada q generamos vapidkeys las suscripciones anteriores quedan nulas
  // en este proyecto las generamos con un comando de npm

  const key = push.getKey()

  // asi se manda como una wea rara
  res.send(key);
});


// para enviar notificaciones, lo normal no es un rest, suele q ser algo q corre en el back
router.post('/push', function (req, res) {

  res.json('subscribe');
});




module.exports = router;