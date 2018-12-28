var models  = require('../models');

module.exports = {
  getCategoriasAnalises: (req, res)=>{
    models.CategoriaAnalise.findAll({
      include: [ 
        { model: models.CategoriaAnaliseItem, as: 'Itens',            
            include: [ { model: models.CategoriaAnaliseItem, as: 'descendents' } ] 
        }
      ]
    }).then(function(lista) {
      res.json({categorias_analise: lista});
    });
  },
  /*getCategoriasAnalises: (req, res)=>{
    models.CategoriaAnaliseItem.findAll({ hierarchy: true }).then(function(lista) {
      res.json({categorias_analise: lista});
    });
  },*/
  getCategoriaAnalise: (req,res)=>{
    models.CategoriaAnalise.findAll(
      { include: [ { model: models.CategoriaAnaliseItem, as: 'Itens' }],
        where: {codigo: req.swagger.params.codigo.value}
      }
    ).then((categoria)=> {
      if(categoria && categoria.length>0)
          res.json(categoria[0]);
    });
  },
  createCategoriaAnalise: (req,res)=>{
    models.CategoriaAnalise.create(req.body).then((categoria)=> {
      if(req.body.Itens){
        var promises = [];
        req.body.Itens.forEach((item)=>{
          item['CategoriaAnaliseCodigo'] = categoria.codigo;
          promises.push(models.CategoriaAnaliseItem.create(item));
        });
        var cod = categoria.codigo;
        Promise.all(promises).then(result=>{
            res.json({codret: 0, mensagem: "Categoria de Análise e itens cadastrados com sucesso", codigo: cod});
        }).catch(err=>{
          console.log('Erro', err);
          res.status(503).json(err);
        });
      }else{
        res.json({codret: 0, mensagem: "Categoria de Análise cadastrada com sucesso"});
      }
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  },
  editaCategoriaAnalise: (req,res)=>{
    console.log(req.body);
    models.CategoriaAnalise.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      if(req.body.Itens){
          var promises = [];
          req.body.Itens.forEach((item)=>{
            item['CategoriaAnaliseCodigo'] = req.swagger.params.codigo.value;
            if(item.codigo!=0){
              if(item.deleted){
                console.log('Apaga');
                promises.push(models.CategoriaAnaliseItem.destroy({ where: { codigo: item.codigo }}));
              }else{
                console.log('Atualiza');
                promises.push(models.CategoriaAnaliseItem.update(item, { where: { codigo: item.codigo }}));
              }
            }else{
              console.log('Inclui');
              promises.push(models.CategoriaAnaliseItem.create(item));
            }
          });
          Promise.all(promises).then(result=>{
              res.json({codret: 0, mensagem: "Categoria de Análise e itens atualizados com sucesso"});
          }).catch(err=>{
            console.log('Erro', err);
            res.status(503).json(err);
          }).catch(err=>{
            console.log('Erro', err);
            res.status(503).json(err);
          });
      }else{
        res.json({codret: 0, mensagem: "Categoria de Análise atualizada com sucesso"});
      }
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  },
  apagaCategoriaAnalise: (req,res)=>{
    models.CategoriaAnalise.destroy({where: {codigo: req.swagger.params.codigo.value}}).then((resp)=>{
      res.json({codret: 0, mensagem: "Categoria de Análise apagada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      if('original' in err){
        console.log('Tratado', {codret: err.original.code, mensagem: err.original.detail});
        res.status(503).json({codret: err.original.code, mensagem: err.original.detail});
      }else{
        res.status(503).json(err);
      }
    });
  }
}
