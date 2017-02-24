
var config = require('./config');

exports.InvitacionSlack = function(correo){

    var request = require('request');

    var options = {
        method: 'get',
        url: 'https://pgramadores.slack.com/api/users.admin.invite?token='+config.tokenSlack+'&email='+correo+'&resend=true',
        headers: {
            'Content-Type' : 'application/json'
        }
    }

    request(options, function (err, res, body) {
        if (err) {
            console.log('Error :', err);
        }else{
            console.log({okSlack:true});
        }
    });
}

exports.CorreoVerificacion = function(correo){

    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
            user: config.correo.usuario,
            pass: config.correo.pass
        }
    }));

    //generador de link de confirmacion
    const crypto = require('crypto');
    const cipher = crypto.createCipher(config.cipher.metodo, config.cipher.pass);

    let encrypted = cipher.update(correo, config.cipher.input, config.cipher.output);
    encrypted += cipher.final(config.cipher.output);

    //falta enchular el mail
    let mailOptions = {
        from: '"Pro-Gramadores 👥" <no-reply@pro-gramadores.org>',
        to: correo,
        subject: 'Bienvenido a la comunidad de Pro-Gramadores',
        text: 'http://'+config.domain+'/suscripcion/'+encrypted,   //link erroneo hay que arreglar
        html: 'http://'+config.domain+'/suscripcion/'+encrypted
    };


    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }else {
            return console.log({okMail:true});
        }
    });
}

exports.DesencriptadorCorreo = function(codigo){

    const crypto = require('crypto');
    const decipher = crypto.createDecipher(config.cipher.metodo, config.cipher.pass);

    let correo = decipher.update(codigo, config.cipher.output, config.cipher.input);
    correo += decipher.final(config.cipher.input);
    return correo;
}

exports.Sanar = function(texto){

    var sanitizeHtml = require('sanitize-html');
    var xss = require('xss');

    //si el texto es seguro retorna true, sino false
    return xss(sanitizeHtml(texto)) === texto ? true : false;
}

exports.UbicacionPorIp = function(clientIp){

    var satelize = require('satelize');

    return satelize.satelize({ip:clientIp}, function(err, payload) { return payload.continent.es+','+payload.country.es+','+payload.country_code; });
}

exports.IP = function(req){

    var requestIp = require('request-ip');

    return requestIp.getClientIp(req);
}

exports.Ahora = function(){

    var moment = require('moment');

    return moment().format();
}

exports.InvitacionMeetup = function(correo){
    
    var request = require('request');

    var options = {
        method: 'POST',
        url: config.meetup.LocationM ,
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'CF-RAY' : config.meetup.cfrayM,
            'Location' : config.meetup.LocationM,
            'Cookie' : config.meetup.CookieM
        },
        form: {
            'emails' : correo,
            'did_submit' : true,
            'csrf_token' : config.meetup.csrftoken
        }
    }

    request(options, function (err, res, body) {
        if (err) {
            console.log('Error :', err);
        }else{
            console.log({okMeetup:true});
        }
    });
}
