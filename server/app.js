'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = express();
var morgan = require('morgan');
var log4js = require("log4js");
var config_param = require('./api/helpers/config')();
var swagger_config = require('./api/helpers/swagger-yaml')();
var job = require('./api/helpers/job');
var passport = require("passport");
var bodyParser = require('body-parser');


module.exports = app; // for testing

var theAppLog = log4js.getLogger();

// Programa os jobs de execucao
//job.cron();  //TODO: Checar a necessidade de programar jobs no servico web

app.use(morgan("combined",{
  "stream": {
    write: function(str) { theAppLog.debug(str); }
  }
}));

/*app.use((req, response, next) =>{
    console.log('Content-Type',req.get('Content-Type'));
    if(req.method==='POST'){
      console.log('Log de desenv-->', req.headers, req.body);
    }
  next();
});*/

var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: require('./api/helpers/security')
};

process.on('SIGINT', function() {
     process.exit(0);
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.get('/swagger.yaml', (req,res,next)=>{
    console.log('Pedido do yaml', );
    res.setHeader('content-type', 'application/json');

    swagger_config.host = process.env.HOST || config_param.host;
    swagger_config.info.title = process.env.TITLE || config_param.title;
    swagger_config.info.description = process.env.DESCRIPTION || config_param.description;

    res.send(swagger_config);
});

/*app.post('/login2', (req, res, next) =>{
  console.log('dentro do login2');
  passport.authenticate('local-login', passport.authenticate('local', { failureRedirect: '/login' }), (req,res)=>{
    console.log('dentro', req, res);
    //res.send(JSON.stringify(info)).status(200);
    //next();
  });
});*/


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  swaggerExpress.runner.swagger.host = process.env.HOST || config_param.host;
  swaggerExpress.runner.swagger.info.title = process.env.TITLE || config_param.title;
  swaggerExpress.runner.swagger.info.description = process.env.DESCRIPTION || config_param.description;

  let isExtern = (process.env.SCHEMA_LOGIN || config_param.schema_login) == 'external';
  if(isExtern){
    delete swaggerExpress.runner.swagger.paths['/login'];
    delete swaggerExpress.runner.swagger.paths['/api/aplicacao'];
    delete swaggerExpress.runner.swagger.paths['/api/status-aprovacao'];
    delete swaggerExpress.runner.swagger.paths['/api/cargo'];
    delete swaggerExpress.runner.swagger.paths['/api/orgao'];
    delete swaggerExpress.runner.swagger.paths['/api/unidade'];
    delete swaggerExpress.runner.swagger.paths['/api/perfil'];
  }


  app.use(swaggerExpress.runner.swaggerTools.swaggerUi());


  var port = process.env.PORT || config_param.port || 8000;
  var options = {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['htm', 'html'],
  index: 'index.html',
  lastModified: true,
  maxAge: '1d',
  setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now());
      res.header('Cache-Control', 'public, max-age=1d');
    }
  };
  theAppLog.info('Servidor REST %s', config_param.host);
  theAppLog.info('Porta %s', port);
  theAppLog.info('Ambiente %s', process.env.NODE_ENV );

  app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        response.header('Access-Control-Allow-Headers', 'Accept, Origin, Content-Type');
        response.header('Access-Control-Allow-Credentials', 'true');
        next();
    });
  app.use(express.static('public'));
  app.use(express.static('node_modules/redoc/dist'));
  //app.use(express.static('api/swagger'));

  //app.use('/', express.static(__dirname + '/doc', options));

  swaggerExpress.register(app);
  app.listen(port);

});
