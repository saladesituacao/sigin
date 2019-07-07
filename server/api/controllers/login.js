'use strict';

const jwt    = require('jsonwebtoken');
const util = require('util');
const log4js = require('log4js');
const config_param = require('../helpers/config')();
const swagger = require('../helpers/swagger')();
const user = require('./user');
const passport = require("passport");
require('../helpers/passport.js')(passport, process.env.SCHEMA_LOGIN || config_param.schema_login); // pass passport for configuration

module.exports = {
  authenticate: (req, res)=>{
    var log = log4js.getLogger();
    try {
      if(!config_param.bypass
        || (process.env.SCHEMA_LOGIN || config_param.schema_login)!= 'external'){
        console.log('Fazendo autenticacao ', req.body.username);
        passport.authenticate(process.env.SCHEMA_LOGIN || config_param.schema_login, async (err, userlogin,info)=>{
            console.log('retornos', process.env.SCHEMA_LOGIN || config_param.schema_login, info, userlogin, err);
            if(err){
              return res.status(403).send({message: err});
            }
            if(info){
              return res.status(500).send(info);
            }
            userlogin['login'] = req.body.username;
            console.log('Login de usuario==>', req.body.username);
            // Checa se o usuário logado possui cadastro do SIGIN
            var userPerfil =  await user.getPorLogin(req.body.username, process.env.APP_SIGLA || config_param.aplicacao_sigla || 'SIGIN');
            console.log('userPerfil==>', userPerfil);
            if(!userPerfil || userPerfil.length==0){
              var token = jwt.sign(userlogin, config_param.secret, { expiresIn: '7d' });
              return res.status(406).json({token: util.format('Bearer %s', token), user: userlogin});
            } else if (userPerfil[0].dataValues.SituacaoCodigo==0){
              var token = jwt.sign(userPerfil[0].dataValues, config_param.secret, { expiresIn: '7d' });
              return res.status(406).json({token: util.format('Bearer %s', token), user: userPerfil[0].dataValues});
            } else if (userPerfil[0].dataValues.SituacaoCodigo==2){
              return res.status(403).send({message: 'Usuário rejeitado pelo ADMINISTRADOR'});
            }

            // Loga o Usuario
            var token = jwt.sign(userPerfil[0].dataValues, config_param.secret, { expiresIn: '7d' });
            res.json({token: util.format('Bearer %s', token), user: userPerfil[0].dataValues});
        })(req,res);
      }else{
        var temp = {
            cpf: '11111111',
            nome: 'Usuário Fake',
            email: 'teste@teste.com',
            perfil: ''
        };
        console.log('Usuario fake:', temp); //TODO: Retirar isso
        var token = jwt.sign(temp, config_param.secret, { expiresIn: '7d' });
        res.json({token: util.format('Bearer %s', token), user: temp});
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  },
  version: (req,res)=>{
    try {
      var env = '';
      if(process.env && process.env.NODE_ENV){
        env = process.env.NODE_ENV;
      }else{
        env = 'development';
      }
      swagger.info['enviroment']=env;
      swagger.info['company']=process.env.COMPANY || config_param.company;
      swagger.info['login']=process.env.SCHEMA_LOGIN || config_param.schema_login;
      swagger.info['title']=process.env.TITLE || config_param.title;
      swagger.info['description']=process.env.DESCRIPTION || config_param.description;
      swagger.info['date'] = new Date();
      res.json(swagger.info);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
};
