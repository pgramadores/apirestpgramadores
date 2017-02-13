// Importamos nuestros modelos,
require('./models/usuarios');

// server.js
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var ctrl = require('./controller');

// Configuramos Express
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.set('port', 3000);

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
mongoose.connect('mongodb://localhost/pgramadores', function(err) {
    // Comprobar errores siempre
    app.listen(app.get('port'), function(){
        console.log('Express corriendo en http://localhost:3000');
    });
});
