
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
        service: config.correo.servicio,
        auth: {
            user: config.correo.usuario,
            pass: config.correo.pass
        }
    }));

    //Generador de link de confirmación
    const crypto = require('crypto');
    const cipher = crypto.createCipher(config.cipher.metodo, config.cipher.pass);

    let encrypted = cipher.update(correo, config.cipher.input, config.cipher.output);
    encrypted += cipher.final(config.cipher.output);

    //Template de correo
    let CorreoHTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta name="viewport" content="width=device-width" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>confirmación suscripción</title><style>*,.collapse{padding:0}.btn,.social .soc-btn{text-align:center;font-weight:700}.btn,ul.sidebar li a{text-decoration:none;cursor:pointer}.container,table.footer-wrap{clear:both!important}*{margin:0;font-family:"Helvetica Neue",Helvetica,Helvetica,Arial,sans-serif}img{max-width:100%}body{-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none;width:100%!important;height:100%}.content table,table.body-wrap,table.footer-wrap,table.head-wrap{width:100%}a{color:#2ba6cb}.btn{color:#FFF;background-color:#666;padding:10px 16px;margin-right:10px;display:inline-block}p.callout{padding:15px;background-color:#ecf8ff;margin-bottom:15px}.callout a{font-weight:700;color:#2ba6cb}table.social{background-color:#ebebeb}.social .soc-btn{padding:3px 7px;font-size:12px;margin-bottom:10px;text-decoration:none;color:#FFF;display:block}a.fb{background-color:#3B5998!important}a.tw{background-color:#1daced!important}a.gp{background-color:#DB4A39!important}a.ms{background-color:#000!important}.sidebar .soc-btn{display:block;width:100%}.header.container table td.logo{padding:15px}.header.container table td.label{padding:15px 15px 15px 0}.footer-wrap .container td.content p{border-top:1px solid #d7d7d7;padding-top:15px;font-size:10px;font-weight:700}h1,h2{font-weight:200}h1,h2,h3,h4,h5,h6{font-family:HelveticaNeue-Light,"Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;line-height:1.1;margin-bottom:15px;color:#000}h1 small,h2 small,h3 small,h4 small,h5 small,h6 small{font-size:60%;color:#6f6f6f;line-height:0;text-transform:none}h1{font-size:44px}h2{font-size:37px}h3,h4{font-weight:500}h3{font-size:27px}h4{font-size:23px}h5,h6{font-weight:900}h5{font-size:17px}h6,p,ul{font-size:14px}h6{text-transform:uppercase;color:#444}.collapse{margin:0!important}p,ul{margin-bottom:10px;font-weight:400;line-height:1.6}p.lead{font-size:17px}p.last{margin-bottom:0}ul li{margin-left:5px;list-style-position:inside}ul.sidebar li,ul.sidebar li a{display:block;margin:0}ul.sidebar{background:#ebebeb;display:block;list-style-type:none}ul.sidebar li a{color:#666;padding:10px 16px;border-bottom:1px solid #777;border-top:1px solid #FFF}.column tr td,.content{padding:15px}ul.sidebar li a.last{border-bottom-width:0}ul.sidebar li a h1,ul.sidebar li a h2,ul.sidebar li a h3,ul.sidebar li a h4,ul.sidebar li a h5,ul.sidebar li a h6,ul.sidebar li a p{margin-bottom:0!important}.container{display:block!important;max-width:600px!important;margin:0 auto!important}.content{max-width:600px;margin:0 auto;display:block}.column{width:300px;float:left}.column-wrap{padding:0!important;margin:0 auto;max-width:600px!important}.column table{width:100%}.social .column{width:280px;min-width:279px;float:left}.clear{display:block;clear:both}@media only screen and (max-width:600px){a[class=btn]{display:block!important;margin-bottom:10px!important;background-image:none!important;margin-right:0!important}div[class=column]{width:auto!important;float:none!important}table.social div[class=column]{width:auto!important}}table.detalle td{padding:5px}</style><script type="application/ld+json">{"@context": "http://schema.org","@type": "EmailMessage","potentialAction": {"@type": "ConfirmAction","name": "Confirmar suscripción","handler": {"@type": "HttpActionHandler","url": "${config.domain}/#!?AceptaSuscripcion=${encrypted}"}},"description": "Confirmación de suscripción a la comunidad de Pro-Gramadores"}</script></head><body bgcolor="#FFFFFF"><table class="head-wrap" bgcolor="#fff"><tr><td></td><td class="header container"><div class="content"><table bgcolor="#fff"><tr><td><img src="${config.domain}/images/LogoCorreo.png" /></td><td align="right"><h6 class="collapse">confirmación suscripción</h6></td></tr></table></div></td><td></td></tr></table><table class="body-wrap"><tr><td></td><td class="container" bgcolor="#FFFFFF"><div class="content"><table><tr><td><h3>Hola Pro-Gramador/a</h3><p>Hemos recibido una solicitud de suscripción desde este mail y queriamos confirmar que efectivamente eres tu quien se esta suscribiendo.</p><p>Para completar la suscripción te solicitamos hacer clic en el link que adjuntamos o copiar y pegar en tu navegador la url que esta mas abajo.</p><p>Apenas confirmes tu suscripción comenzaras a recibir nuestras novedades, articulos de interes del mundo de la informatica y las fechas de nuestros eventos gratuitos, asi que esta atento a tu correo.</p><p><a href="${config.domain}/#!?AceptaSuscripcion=${encrypted}">haz clic aca para confirmar tu suscripción</a><br><br>ó copia y pega en tu navegador este link<br><br>${config.domain}/#!?AceptaSuscripcion=${encrypted}</p><br><br><table class="social" width="100%"><tr><td><table align="left" class="column"><tr><td><h5 class="">No te olvides seguirnos en:</h5><p class=""><a href="https://github.com/pgramadores" class="soc-btn ms">Github</a><a href="https://facebook.com/pgramadores" class="soc-btn fb">Facebook</a><a href="https://twitter.com/pgramadores" class="soc-btn tw">Twitter</a><a href="https://youtube.com/pgramadores" class="soc-btn gp">Youtube</a></p></td></tr></table><table align="left" class="column"><tr><td><h5 class="">Contactanos:</h5><p>Correo:<strong style="font-size:13px"><a href="mailto:contacto@pro-gramadores.org">contacto@pro-gramadores.org</a></strong></p></td></tr></table><span class="clear"></span></td></tr></table></td></tr></table></div></td><td></td></tr></table><br><table class="footer-wrap"><tr><td></td><td class="container"><div class="content"><table><tr><td align="center"><p><a href="https://github.com/pgramadores/PoliticasSitioPGramadores">Terminos y condiciones</a> | <a href="${config.domain}/#!?AnulaSuscripcion=${encrypted}"><unsubscribe>Cancelar suscripción</unsubscribe></a></p></td></tr></table></div></td><td></td></tr></table></body></html>`;

    //Configuración de correo
    let mailOptions = {
        from: '"Pro-Gramadores" <no-reply@pro-gramadores.org>',
        to: correo,
        subject: 'Confirmación de suscrpción a la comunidad de Pro-Gramadores',
        html: CorreoHTML
    };

    //Envio de correo
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

    //Si el texto es seguro retorna true, sino false
    return xss(sanitizeHtml(texto)) === texto ? true : false;
}

exports.UbicacionPorIp = function(clientIp){

    var geoip = require('geoip-lite');

    return geoip.lookup(clientIp);

}

exports.IP = function(req){

    var requestIp = require('request-ip');

    return requestIp.getClientIp(req);
}

exports.Ahora = function(){

    var moment = require('moment');

    return moment().format();
}
