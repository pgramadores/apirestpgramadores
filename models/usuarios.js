var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var usuarios = new Schema({
    nombres:    { type : String, required : true },
    correo:     { type : String, required : true, unique : true },
    fecha:      { type : Date,   required : true },
    ip:         { type : String, required : true },
    ubicacion:  { type : Array,  required : true },
    suscripcion:{ type : Boolean,required : true }
});

module.exports = mongoose.model('usuarios', usuarios);
