var models  = require('../models');
var sequelize = require('sequelize');


module.exports = {
  getProgramas: (req, res)=>{
    models.Programa.findAll({}).then(function(lista) {
      res.json({programas: lista});
    });
  },
  createPrograma: (req,res)=>{
    delete req.body['codigo'];
    models.Programa.create(req.body).then((indicador)=> {
      res.json({codret: 0, mensagem: "Item cadastrado com sucesso"});
    }).catch(err=>{
      console.log(err);
      res.status(500).json({message: err.message});
    });
  },
  editaPrograma: (req,res)=>{
    models.Programa.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
        res.json({codret: 0, mensagem: "Item atualizado com sucesso"});
    });
  },
  getProgramasHierarchical: (req, res)=>{
    models.Programa.findAll({
      hierarchy: true    }).then(function(lista) {
      res.json({programas: lista});
    });
  },
  getPrograma: (req,res)=>{
    models.Programa.findById(req.swagger.params.codigo.value,{
      include: [ { model: models.Programa, as: 'ancestors' } ],
    	order: [ [ { model: models.Programa, as: 'ancestors' }, 'nu_nivel', 'DESC' ] ]}
    ).then(function(lista) {
      res.json({programa: lista});
    });
  },
  getCodigoProgramaPai(codigo){
    return models.Programa.findById(codigo,{
      include: [ { model: models.Programa, as: 'ancestors' } ],
      order: [ [ { model: models.Programa, as: 'ancestors' }, 'nu_nivel', 'DESC' ] ]}
    );
  }
}
