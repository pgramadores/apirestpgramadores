var mongoose = require('mongoose');
var User = mongoose.model('usuarios');
var satelize = require('satelize');
var moment = require('moment');
var requestIp = require('request-ip');
var config = require('./config');
var suscrip = require('./suscripciones');
var xss = require('xss');

exports.registro = function(req, res) {

    try {

        var clientIp = config.dev ? '190.47.115.14': requestIp.getClientIp(req);

        var ubicacion = satelize.satelize({ip:clientIp}, function(err, payload) { return payload.continent.es+','+payload.country.es+','+payload.country_code; });

        var user = new User({
            nombres:    xss(req.body.nombres),
            correo:     xss(req.body.correo),
            fecha:      moment().format(),
            ip:         clientIp,
            ubicacion:  ubicacion,
            suscripcion:true
        });

        user.save(function(err){
            suscrip.InvitacionSlack(xss(req.body.correo));
            return res.status(200).jsonp(user);
        });
    } catch (e) {
        console.log(e);
        return res.status(500).jsonp({ok:false});
    }


};