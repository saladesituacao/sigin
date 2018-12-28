// Modulo de seguranca
const jwt = require('jsonwebtoken');
const config_param = require('./config')();
const fs = require('fs');
const cert = fs.readFileSync('public.pem');

module.exports = {
  // swagger-tools style handler
  Bearer: function failure(req, authOrSecDef, authorization, cb) {
    var token='';

    if(authorization) {
        var parts = authorization.split(' ');
        if(parts.length === 2) {
            var scheme = parts[0];
            var credentials = parts[1];
            if(/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
            else {
                cb(new Error('Format is Authorization: Bearer [token]'));
                return;
            }
        }
    }

    if(token) {
      try{
        jwt.verify(token, cert, {}, function(err, decoded) {
            console.log('Err', err);
            if(err) {
                return cb(new Error('Invalid token'));
            }
            //console.log("Token decodificado:", decoded);
            cb();
        });
      } catch (e) {
        console.log(e);
        cb(e);
      }
    }
    else {
        cb(new Error('No authorization token was found'));
    }

  },
  getPerfil(req){
      try{
        if(req.headers.authorization){
            return jwt.verify(req.headers.authorization.split(' ')[1], config_param.secret);
        }else{
            return null;
        }
      }catch(e){
          // Para assinatura invalida o perfil escolhido e o publico
          return null;
      }
  }
};
