var models  = require('../models');

module.exports = {
  getClassificacoes6s: (req, res)=>{
    models.Classificacao6sIndicador.findAll({
      order: [ [ 'codigo', 'ASC' ]]
    }).then(function(lista) {
      res.json({classificacoes: lista});
    });
  }
}
