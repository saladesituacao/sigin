var models  = require('../models');

module.exports = {
  getFontesParametro: (req, res)=>{
    models.ParametroFonte.findAll({
      order: [ [ 'sigla', 'ASC' ]]
    }).then(function(lista) {
      res.json({fontes: lista});
    });
  },
  getFontesParametroItem: (req,res)=>{
    models.ParametroFonte.findAll(
      {where: {codigo: req.swagger.params.codigo.value}}
    ).then((unidade)=> {
      if(unidade && unidade.length>0)
          res.json(unidade[0]);
    });
  },
  createFonteParametro: (req,res)=>{
    models.ParametroFonte.create(req.body).then((fonte)=> {
      res.json({codret: 0, mensagem: "Fonte cadastrada com sucesso", codigo: fonte.codigo});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  },
  editaFonteParametro: (req,res)=>{
    //console.log('edita fonte parametro', req.body, req.swagger.params.codigo.value);
    models.ParametroFonte.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: "Fonte atualizada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  },
  apagaFonteParametro: (req,res)=>{
    models.ParametroFonte.destroy({where: {codigo: req.swagger.params.codigo.value}}).then((resp)=>{
      res.json({codret: 0, mensagem: "Fonte apagada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  }
}
