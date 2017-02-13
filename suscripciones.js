var request = require('request');
var config = require('./config');

exports.InvitacionSlack = function(correo){

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
            console.log(body);
        }
    });
}
