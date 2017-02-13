var mongoose = require('mongoose');
var User = mongoose.model('usuarios');
var satelize = require('satelize');

exports.registro = function(req, res) {

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var user = new usuarios({
        nombres:    req.body.nombres,
        correo:     req.body.correo,
        fecha:      moment().format(),
        ip:         ip,
        ubicacion:  satelize.satelize({ip:ip}, function(err, payload) { return payload.country.en; }),
        suscripcion:req.body.suscripcion
    });

    user.save(function(err){
        return res.status(200).jsonp(user);
    });
};
