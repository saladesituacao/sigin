var models  = require('../models');

module.exports = {
  getPolaridades: (req, res)=>{
    models.Polaridade.findAll({
    }).then(function(lista) {
      res.json({polaridades: lista});
    });
  }
}
