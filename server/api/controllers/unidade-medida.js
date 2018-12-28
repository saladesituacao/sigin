var models  = require('../models');

module.exports = {
  getUnidadesMedida: (req, res)=>{
    models.UnidadeMedida.findAll({
    }).then(function(lista) {
      res.json({unidades: lista});
    });
  },
  getUnidadesMedidaItem: (req,res)=>{
    models.UnidadeMedida.findAll(
      {where: {codigo: req.swagger.params.codigo.value}}
    ).then((unidade)=> {
      if(unidade && unidade.length>0)
          res.json(unidade[0]);
    });
  },
  createUnidadeMedida: (req,res)=>{
    models.UnidadeMedida.create(req.body).then((unidade_medida)=> {
      res.json({codret: 0, mensagem: "Unidade de Medida cadastrada com sucesso", codigo: unidade_medida.codigo});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  },
  editaUnidadeMedida: (req,res)=>{
    console.log('edita unidade medida', req.body, req.swagger.params.codigo.value);
    models.UnidadeMedida.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: "Unidade de Medida atualizada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  },
  apagaUnidadeMedida: (req,res)=>{
    models.UnidadeMedida.destroy({where: {codigo: req.swagger.params.codigo.value}}).then((resp)=>{
      res.json({codret: 0, mensagem: "Unidade de Medida apagada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  }
}
