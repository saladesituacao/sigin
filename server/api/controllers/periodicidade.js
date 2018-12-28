var models  = require('../models');

module.exports = {
  getPeriodicidades: (req, res)=>{
    models.Periodicidade.findAll({
    }).then(function(lista_periodicidades) {
      res.json({periodicidades: lista_periodicidades});
    });
  }
}
