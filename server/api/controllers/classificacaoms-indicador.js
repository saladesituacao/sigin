var models  = require('../models');

module.exports = {
  getClassificacoesMS: (req, res)=>{
    models.ClassificacaoMSIndicador.findAll({
      order: [ [ 'codigo', 'ASC' ]]
    }).then(function(lista) {
      res.json({classificacoes: lista});
    });
  }
}
