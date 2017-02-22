
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
        url: 'https://secure.meetup.com/es/pgramadores/invite/' ,
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'CF-RAY' : config.cfrayMeetup,
            'Location' : config.LocationMeetup,
            'Cookie' : config.CookieMeetup
        },
        form: {
            'emails' : correo,
            'did_submit' : true,
            'csrf_token' : config.csrftokenMeetup
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
