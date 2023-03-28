var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var promocionesModel = require('../models/promocionesModel');
var cloudinary = require('cloudinary').v2;

/* GET home page. */
router.get('/', async function (req, res, next) {

  var promociones = await promocionesModel.getpromociones();

  promociones = promociones.splice(0, 5);
  promociones = promociones.map(promocion =>{
    if (promocion.img_id) {
      const imagen = cloudinary.url(promocion.img_id, {
        width: 460,
        crop: 'fill'
      });
      return {
        ...promocion,
        imagen
      }
    } else {
      return {
        ...promocion,
        imagen: '/images/nodisponible.png'
      }
    }
    
  });


  res.render('index', {
    promociones
  });
});

router.post('/', async (req, res, next) => {

  console.log(req.body)

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var experiencia = req.body.experiencia;

  var obj = {

    to: 'alebena87@gmail.com',
    subject: 'contacto desde la web pizzeria',
    html: nombre + " " + apellido + " se contacto desde el correo " + email + " y mando su experiencia: " + experiencia
  }

  var tranporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
  var info = await tranporter.sendMail(obj);
  res.render('index', {messaje: 'Mensaje enviado correctamente',
  });
})



module.exports = router;
