// Routes.js - Módulo de rutas
var express = require('express');
var router = express.Router();



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




module.exports = router;