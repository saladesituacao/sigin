var models  = require('../models');

module.exports = {
  getTiposConsulta: (req, res)=>{
    models.TipoConsulta.findAll({
    }).then(function(lista) {
      res.json({tipos_consulta: lista});
    });
  }
}
