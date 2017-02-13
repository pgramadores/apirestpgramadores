var mongoose = require('mongoose');
var User = mongoose.model('usuarios');
var satelize = require('satelize');
var moment = require('moment');
var requestIp = require('request-ip');

exports.registro = function(req, res) {

    try {
        var clientIp = requestIp.getClientIp(req);
        var ubicacion = satelize.satelize({ip:clientIp}, function(err, payload) { return payload.continent.es+','+payload.country.es+','+payload.country_code; });

        var user = new User({
            nombres:    req.body.nombres,
            correo:     req.body.correo,
            fecha:      moment().format(),
            ip:         clientIp,
            ubicacion:  ubicacion,
            suscripcion:true
        });

        user.save(function(err){
            return res.status(200).jsonp(user);
        });
    } catch (e) {
        console.log(e);
        return res.status(500).jsonp({ok:false});
    }


};
