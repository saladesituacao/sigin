const soap = require('soap'),
      LocalStrategy   = require('passport-local').Strategy,
      LdapStrategy    = require('passport-ldapauth').Strategy;
      JsonStrategy    = require('passport-json').Strategy;
      WindowsStrategy = require('passport-windowsauth');
const config_param = require('./config')();
const crypto = require('crypto');
//var parseString = require('xml2js').parseString;


module.exports = function(passport, login_schema) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    /*passport.serializeUser(function(user, done) {
        done(null, user);
    });*/

    // used to deserialize the user
    /*passport.deserializeUser(function(id, done) {
        //User.findById(id, function(err, user) {
            done(err, user);
        //});
    });*/


    if (login_schema == 'local'){
      // =========================================================================
      // LOCAL LOGIN =============================================================
      // =========================================================================
      // Valida o usuario na base local (username/password)
      passport.use('local', new LocalStrategy((username, password, done) =>{
          console.log('local', username, password);

          return done(null, false, null);

      }));
    } else if (login_schema == 'scpa'){
      // =========================================================================
      // SCPA Login ==============================================================
      // =========================================================================
      passport.use('scpa', new JsonStrategy((login, password, done) =>{
          console.log('Acessando scpa:', process.env.WSDL || config_param.wsdl);
          soap.createClient(process.env.WSDL || config_param.wsdl, function(err, client) {
            if(err){
              console.log('Erro==>',err);
              return done('Erro no acesso ao SCPA.');
            }

            var password_hash = crypto.createHash('sha256').update(password, 'utf8').digest().toString('hex');
            // Busca informacoes adicionais no SCPA
            client.buscaPerfilUsuario(
                {autenticacao: {email: login, senha: password_hash, siglaSistema: process.env.SISTEMA || config_param.system}},
                (err, result)=>{
                  if(err){
                    var erroSCPA = err.body.substring(err.body.indexOf('<detalhamento>')+14,err.body.indexOf('</detalhamento>'));
                    done(erroSCPA);
                    return;
                  }

                  done(null, {
                                login: login,
                                cpf: result.respostaBuscaPerfilUsuario.usuario.cpf,
                                nome: result.respostaBuscaPerfilUsuario.usuario.nome,
                                email: result.respostaBuscaPerfilUsuario.usuario.email
                            });
                });
          });
      }));
    } else if (login_schema == 'ldap'){
      // =========================================================================
      // LDAP Login ==============================================================
      // =========================================================================
      var opts = {
          server: {
                  url:  process.env.URL || config_param.url,
                  bindDn: process.env.BIND_DN || config_param.bindDn,
                  bindCredentials: process.env.BIND_CREDENTIALS || config_param.bindCredentials,
                  searchBase: process.env.SEARCH_BASE || config_param.searchBase,
                  searchFilter: process.env.SEARCH_FILTER || config_param.searchFilter
                }
      }
      passport.use('ldap', new LdapStrategy(opts,(user,done)=>{
        console.log('Autenticacao LDAP', user);
        done(null,{
            nome: user[process.env.NAMEFIELD || config_param.namefield],
            email: user[process.env.MAILFIELD || config_param.mailfield]
        });
      }));
    } else if (login_schema == 'scpa'){
      // =========================================================================
      // Windows Login ==============================================================
      // =========================================================================
      var opts_win = {
          ldap: {
                  url:  process.env.URL || config_param.url || 'ldap://localhost',
                  bindDN: process.env.BIND_DN || config_param.bindDn || '',
                  bindCredentials: process.env.BIND_CREDENTIALS || config_param.bindCredentials,
                  base: process.env.SEARCH_BASE || config_param.searchBase,
                  reconnect: true,
                  timeout: 30,
                  maxConnections: 50,
                  connectTimeout: 20,
                  idleTimeout: 30,
                }, integrated: false
      }
      passport.use('windows',new WindowsStrategy(opts_win, (profile, done)=>{
          let email = '';
          console.log('AD Windows==>', profile);
          if(!profile){
            done('Erro de autenticação', null);
          }else{
            if(profile.emails && profile.emails.length>0){
              email=profile.emails[0].value;
            }
            done(null, {
              login: profile.sAMAccountName,
              nome: profile.displayName,
              email: email
            });
          }

      }));
    }
};
