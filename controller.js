var mongoose = require('mongoose');
var User = mongoose.model('usuarios');
var config = require('./config');
var serv = require('./servicios');

exports.registro = function(req, res) {

    try {

        var clientIp = config.dev ? '190.47.115.14': serv.IP(req);

        var user = new User({
            nombres:    serv.Sanar(req.body.nombres),
            correo:     serv.Sanar(req.body.correo),
            fecha:      serv.Ahora(),
            ip:         clientIp,
            ubicacion:  serv.UbicacionPorIp(clientIp),
            suscripcion:true
        });

        user.save(function(err){
            serv.InvitacionSlack(serv.Sanar(req.body.correo));
            return res.status(200).jsonp(user);
        });

    }catch (e) {
        console.log(e);
        return res.status(500).jsonp({ok:false});
    }


};