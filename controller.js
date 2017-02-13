var mongoose = require('mongoose');
var User = mongoose.model('usuarios');
var satelize = require('satelize');
var moment = require('moment');

exports.registro = function(req, res) {

    console.log(req.headers['x-forwarded-for']);
    console.log(req.connection.remoteAddress);
    console.log(req.socket.remoteAddress);
    //190.47.115.14

    var ip = '190.47.115.14';
    var ubicacion = satelize.satelize({ip:ip}, function(err, payload) { return payload.continent.es+','+payload.country.es+','+payload.country_code; });
    console.log(ubicacion);

    var user = new User({
        nombres:    req.body.nombres,
        correo:     req.body.correo,
        fecha:      moment().format(),
        ip:         ip,
        ubicacion:  ubicacion,
        suscripcion:true
    });

    user.save(function(err){
        return res.status(200).jsonp(user);
    });
};
