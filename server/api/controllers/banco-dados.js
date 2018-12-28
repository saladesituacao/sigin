var models  = require('../models');

module.exports = {
  getBancoDados: (req, res)=>{
    models.BancoDados.findAll({ 
      attributes: { 
        exclude: ['senha']
      },
      include: [ { model: models.TipoBancoDados, as: 'TipoBanco' } ]
    }).then(function(lista) {
      res.json({banco_dados: lista});
    });
  },
  getBancoDadosItem: (req,res)=>{
    models.BancoDados.findAll(
      {where: {codigo: req.swagger.params.codigo.value}}
    ).then((unidade)=> {
      if(unidade && unidade.length>0)
          res.json(unidade[0]);
    });
  },
  createBancoDados: (req,res)=>{
    models.BancoDados.create(req.body).then((resp)=> {
      res.json({codret: 0, mensagem: "Informação de banco de dados cadastrada com sucesso", codigo: resp.codigo});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  },
  editaBancoDados: (req,res)=>{
    models.BancoDados.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: "Informação de banco de dados atualizada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  },
  apagaBancoDados: (req,res)=>{
    models.BancoDados.destroy({where: {codigo: req.swagger.params.codigo.value}}).then((resp)=>{
      res.json({codret: 0, mensagem: "Informação de banco de dados apagada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  }
}
