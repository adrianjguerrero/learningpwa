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




module.exports = router;