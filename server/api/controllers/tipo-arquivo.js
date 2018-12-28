var models  = require('../models');

module.exports = {
  getTipoArquivo: (req, res)=>{
    models.TipoArquivo.findAll({
    }).then(function(lista) {
      res.json({tipo_arquivo: lista});
    });
  }
}
