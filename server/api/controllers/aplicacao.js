var models  = require('../models');

module.exports = {
  getAplicacoes: (req, res)=>{
    models.Aplicacao.findAll({
    }).then(function(lista) {
      res.json({aplicacoes: lista});
    });
  }
}
