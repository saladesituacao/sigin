var models  = require('../models');

module.exports = {
  getPerfis: (req, res)=>{
    models.Perfil.findAll({
      include:[{ model: models.Aplicacao,
          as: 'Aplicacao', where:{ codigo: req.swagger.params.aplicacao.value }}],
      where:{
        ativo:true
      }
    }).then(function(lista) {
      res.json({perfis: lista});
    });
  },
  getPerfilPorSigla: async (sigla)=>{
    return models.Perfil.findAll({
      where:{
        ativo:true,
        sigla:sigla
      }
    });
  }
}
