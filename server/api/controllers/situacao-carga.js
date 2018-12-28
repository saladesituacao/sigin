var models  = require('../models');

module.exports = {
  getSituacaoCarga: (req, res)=>{
    models.SituacaoCarga.findAll({
    }).then(function(lista) {
      res.json({situacao_carga: lista});
    });
  }
}
