var models  = require('../models');

module.exports = {
  getCriterioAgregacao: (req, res)=>{
    models.Criterio_Agregacao.findAll({
    }).then(function(lista) {
      res.json({criterio_agregacao: lista});
    });
  }
}
