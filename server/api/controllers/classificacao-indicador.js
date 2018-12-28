var models  = require('../models');

module.exports = {
  getClassificacoes: (req, res)=>{
    models.ClassificacaoIndicador.findAll({
      order: [ [ 'codigo', 'ASC' ]]
    }).then(function(lista) {
      res.json({classificacoes: lista});
    });
  }
}
