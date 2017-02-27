// Importación de nuestro modelos
require('./models/usuarios');

// Inyección de dependencias
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var helmet = require('helmet');
var moment = require('moment');
var session = require('cookie-session');
var frameguard = require('frameguard');
var hsts = require('hsts');
var fs = require('fs');
var https = require('https');
var ctrl = require('./controller');
var config = require('./config');

var app = express();

// Cargamos certificados de seguridad SSL/TSL
var options = {
   key  : fs.readFileSync(config.certificados.private),
   cert : fs.readFileSync(config.certificados.certificado)
};

// Configuramos Express
app.use(helmet());

// Seguridad para no permitir el uso del sitio con iframe
app.use(frameguard({ action: 'deny' }));

// Seguridad para el uso exclusivo de protocolo https para la llamada a la api
// Solicitar validación en sitio https://hstspreload.org
app.use(hsts({
    maxAge: 10886400,
    includeSubDomains: true,
    preload: true
}))

// Configuración de cookies seguras
app.use(session({
    name: config.nombresession,
    keys: [config.llaveseguridadcookie],
    cookie: {
            secure: true,
            httpOnly: true,
            domain: config.domain,
            expires: moment().hour(1).format()
        }
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.set('port', config.puerto);
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://'+config.domain);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Content-Type','application/json');
    next();
});

// Iniciamos las rutas de nuestro servidor/API
var router = express.Router();

// Ruta de bienvenida
router.get('/', function(req, res) {
   res.send({'Mensaje':'Bienvenido a la API REST Pro-Gramadores'});
});

// Rutas de registro
router.post('/usuarios/registro', ctrl.registro);

// Ruta de aceptación de suscripción
router.post('/usuarios/suscripcion/',ctrl.AceptarSuscripcion);

// Ruta de cancelación de suscripción
router.post('/usuarios/cancelasuscripcion/',ctrl.CancelaSuscripcion);

app.use(router);

// Iniciamos el servidor y la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/pgramadores', function(err) {
    if (!err) {
        https.createServer(options, app).listen(app.get('port'), function () {
           console.log('Express corriendo en https://'+config.domain+':'+config.puerto);
        });
    }else{
        console.log(err.message);
    }
});
