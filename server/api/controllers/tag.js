var models  = require('../models');
var sequelize = require('sequelize');

module.exports = {
  getTags: (req, res)=>{
    models.Tag.findAll({
      include: [ { model: models.TagCategoria, as: 'Categoria' } ]
    }).then(function(lista) {
      res.json({tags: lista});
    });
  },
  countIndicadorPorTag: (req,res)=>{
    var attr = {
      attributes: ['codigo', 'descricao', [sequelize.fn('count', sequelize.col('Indicadores.tb_indicador_tag.co_seq_indicador')),'numero_indicadores']],
      includeIgnoreAttributes:false,
      include: [{ model: models.Indicador, as: 'Indicadores',  attributes:[], where:{'ativo': true}, through:{attributes:[]} }],
      group:['Tag.co_tag', 'Tag.ds_tag'],
      order:[[sequelize.fn('count', sequelize.col('Indicadores.tb_indicador_tag.co_seq_indicador')),'DESC']]
    };
    // Testa autorizacao para forcar filtro
    //if (!req.headers.authorization){
    //    attr.include[0].where['privado'] = false;
    //}
    models.Tag.findAll(attr).then(function(lista) {
      //console.log(lista);
      res.json({tags: lista});
    });
  }
}
