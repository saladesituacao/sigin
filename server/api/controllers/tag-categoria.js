var models  = require('../models');

module.exports = {
  getTagCategoria: (req, res)=>{
    models.TagCategoria.findAll({
      include: [ { model: models.Tag, as: 'Tags' } ]
    }).then(function(lista) {
      res.json({tag_categorias: lista});
    });
  },
  getTagCategoriaItem: (req,res)=>{
    models.TagCategoria.findAll(
      { include: [ { model: models.Tag, as: 'Tags' }],
        where: {codigo: req.swagger.params.codigo.value}
      }
    ).then((categoria)=> {
      if(categoria && categoria.length>0)
          res.json(categoria[0]);
    });
  },
  createTagCategoria: (req,res)=>{
      console.log('Recebido', req.body);
      models.TagCategoria.create(req.body).then((tagcategoria)=> {
      var promises = [];
      req.body.Tags.forEach((item)=>{
        //console.log('Item', item, tagcategoria);
        item['CategoriaCodigo'] = tagcategoria.codigo;
        promises.push(models.Tag.create(item));
      });
      Promise.all(promises).then(result=>{
          res.json({codret: 0, mensagem: "Grupo de marcadores cadastrado com sucesso"});
      }).catch(err=>{
        console.log('Erro', err);
        res.status(503).json(err);
      });
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  },
  editaTagCategoria: (req,res)=>{
    console.log('editaTagCategoria', req.body);
    models.TagCategoria.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      if(req.body.Tags){
          var promises = [];
          req.body.Tags.forEach((item)=>{
            item['CategoriaCodigo'] = req.swagger.params.codigo.value;
            if(item.codigo!=0){
              if(item.deleted){
                promises.push(models.Tag.destroy({ where: { codigo: item.codigo }}));
              }else{
                promises.push(models.Tag.update(item, { where: { codigo: item.codigo }}));
              }
            }else{
              promises.push(models.Tag.create(item));
            }
          });
          Promise.all(promises).then(result=>{
              res.json({codret: 0, mensagem: "Grupo de marcadores e suas tags atualizadas com sucesso"});
          }).catch(err=>{
            console.log('Erro', err);
            res.status(503).json(err);
          })
      }else{
        res.json({codret: 0, mensagem: "Grupo de marcadores atualizado com sucesso"});
      }
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  },
  apagaTagCategoria: (req,res)=>{
    models.TagCategoria.destroy({where: {codigo: req.swagger.params.codigo.value}}).then((resp)=>{
      res.json({codret: 0, mensagem: "Grupo de marcadores apagado com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(503).json(err);
    });
  }
}
