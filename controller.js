var mongoose = require('mongoose');
var User = mongoose.model('usuarios');
var config = require('./config');
var serv = require('./servicios');

exports.registro = function(req, res) {

    try {

        //prevencion de ataques
        if(serv.Sanar(req.body.correo) && serv.Sanar(req.body.nombres)){

            var clientIp = config.dev ? '190.47.115.14': serv.IP(req);

                var user = new User({
                    nombres:    req.body.nombres,
                    correo:     req.body.correo,
                    fecha:      serv.Ahora(),
                    ip:         clientIp,
                    ubicacion:  serv.UbicacionPorIp(clientIp),
                    suscripcion:false
                });
                    //ingreso de usuario
                    user.save(function(err){
                        if(err){
                            //email repetido
                            if(err.code == 11000){
                                return res.status(400).jsonp({ok:false});
                            }
                            return res.status(500).jsonp({ok:false});
                        }
                        serv.InvitacionSlack(req.body.correo);
                        serv.InvitacionMeetup(req.body.correo);
                        serv.CorreoVerificacion(req.body.correo);
                        return res.status(200).jsonp({ok:true});
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

exports.registro = function(req, res) {

    correo = serv.DesencriptadorCorreo(req.params.codigo);
    User.find({'correo': correo}, function(err, usuario){
        if(err){
            return res.status(500).jsonp({ok:false});
        }

        usuario.suscripcion = true;
        usuario.save(function(err){
            if(err){
                return res.status(500).jsonp({ok:false});
            }

            return res.status(200).jsonp({ok:true});
        })
    });
};