// Importamos nuestros modelos,
require('./models/usuarios');

// server.js
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var helmet = require('helmet');
var moment = require('moment');
var session = require('cookie-session');
var ctrl = require('./controller');
var config = require('./config');

var app = express();

// Configuramos Express
app.use(helmet());
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
    next();
});

// Iniciamos las rutas de nuestro servidor/API
var router = express.Router();

router.get('/', function(req, res) {
   res.send("Bienvenido a la API REST Pro-Gramadores");
});

// Rutas de autenticación y login
router.post('/usuarios/registro', ctrl.registro);

app.use(router);

// Iniciamos el servidor y la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://'+config.domain+'/pgramadores', function(err) {
    // Comprobar errores siempre
    app.listen(app.get('port'), function(){
        console.log('Express corriendo en http://'+config.domain+':'+config.puerto);
    });
});
