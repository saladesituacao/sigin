var models  = require('../models');

module.exports = {
  getAll: (req, res)=>{
    models.StatusAprovacao.findAll({
    }).then(function(lista) {
      res.json({status_aprovacao: lista});
    });
  },
  getPorCodigo:async (codigo)=>{
    models.Perfil.findAll({
      where:{
        codigo:codigo
      }
    }).then( st =>{ return st; })
  }
}
