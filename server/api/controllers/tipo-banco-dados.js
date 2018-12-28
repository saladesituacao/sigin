var models  = require('../models');

module.exports = {
  getTipoBancoDados: (req, res)=>{
    models.TipoBancoDados.findAll({
    }).then(function(lista) {
      res.json({tipo_banco_dados: lista});
    });
  }
}
