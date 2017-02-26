var mongoose = require('mongoose');
var User = mongoose.model('usuarios');
var config = require('./config');
var serv = require('./servicios');

exports.registro = function(req, res) {

    try {
        //prevencion de ataques
        if(serv.Sanar(req.body.correo) && serv.Sanar(req.body.nombres)){

            let clientIp = config.dev ? '190.47.115.14': serv.IP(req);

            let user = new User({
                nombres:    req.body.nombres,
                correo:     req.body.correo,
                fecha:      serv.Ahora(),
                ip:         clientIp,
                ubicacion:  serv.UbicacionPorIp(clientIp),
                suscripcion:false
            });

            //ingreso de usuario
            var promise = user.save();

            promise.then(function (doc) {
                serv.InvitacionSlack(req.body.correo);
                serv.CorreoVerificacion(req.body.correo);
                return res.status(200).jsonp({ok:true});
            })
            .catch(function(err){
                if(err.code == 11000){
                    return res.status(400).jsonp({ok:false});
                }else {
                    return res.status(500).jsonp({ok:false});
                }
            });
        }else{
            //intento de ataque
            return res.status(403).jsonp({ok:false});
        }

    }catch (e) {
        console.log(e);
        return res.status(500).jsonp({ok:false});
    }

};

exports.AceptarSuscripcion = function(req, res) {

    try {

        let correo = serv.DesencriptadorCorreo(req.body.codigo);

        let promise = User.findOne({'correo': correo }).exec();

        promise.then(function(usuario) {
            usuario.suscripcion = true;
            usuario.save();
        })
        .then(function() {
            return res.status(200).jsonp({ok:true,mensaje:'Tú suscripción ha sido confirmada con exito, a partir de hoy comenzaras a recibir todas las novedades de Pro-Gramadores'});
        })
        .catch(function(err){
            console.log('error:', err);
            return res.status(500).jsonp({ok:false, mensaje: 'A ocurrido un error en el sistema'});
        });
    } catch (e) {
        return res.status(500).jsonp({ok:false, mensaje: 'A ocurrido un error en el sistema'});
    }

};
