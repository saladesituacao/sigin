var models  = require('../models');
var sequelize = require('sequelize');
//const csv_converter = require('csvtojson').Converter,
const csv = require('csvtojson'),
        fs = require('fs');

const security = require('../helpers/security');

module.exports = {
  getUnidades: (req, res)=>{
    models.Unidade.findAll({}).then(function(lista) {
      res.json({unidades: lista});
    });
  },
  createUnidade: (req,res)=>{
    //console.log('createUnidade', req.body);
    delete req.body['codigo'];
    models.Unidade.create(req.body).then((indicador)=> {
      res.json({codret: 0, mensagem: "Unidade cadastrada com sucesso"});
    }).catch(err=>{
      console.log(err);
      res.status(500).json({message: err.message});
    });
  },
  editaUnidade: (req,res)=>{
    console.log('editaUnidade',req.body);
    models.Unidade.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
        res.json({codret: 0, mensagem: "Unidade atualizada com sucesso"});
    });
  },
  getUnidadesHierarchical: (req, res)=>{
    models.Unidade.findAll({
      hierarchy: true,
      include: [{ model: models.Indicador, as: 'IndicadoresRelacionados', where:{ 'ativo':true }, attributes:['codigo', 'titulo', 'descricao'], required: false }]
    }).then(function(lista) {
      res.json({unidades: lista});
    });
  },
  getUnidade: (req,res)=>{
    models.Unidade.findById(req.swagger.params.codigo.value,{
      include: [ { model: models.Unidade, as: 'ancestors' } ],
    	order: [ [ { model: models.Unidade, as: 'ancestors' }, 'nu_nivel', 'DESC' ] ]}
    ).then(function(lista) {
      res.json({unidade: lista});
    });
  },
  countIndicadorPorUnidade: (req,res)=>{
    var perfil = security.getPerfil(req);
    var attr = {
      attributes: ['codigo','sigla', 'nome', [sequelize.fn('count', sequelize.col('*')),'numero_indicadores']],
      include: [{ model: models.Indicador, as: 'IndicadoresRelacionados', where:{'ativo': true}, attributes:[] }],
      group:['Unidade.co_unidade', 'Unidade.ds_sigla', 'Unidade.ds_nome']
    };
    // Testa autorizacao para forcar filtro
    if (!req.headers.authorization){
        attr.include[0].where['privado'] = false;
    }else if(perfil && perfil.Perfil.sigla!='ADM'){
      console.log('Unidade restritiva', perfil.UnidadeCodigo);
      attr.include[0].include = [];
      //attr.include[0].include.push({ model: models.Unidade , as: 'ResponsavelGerencial', attributes:[], where:{codigo: perfil.UnidadeCodigo}});
    }
    models.Unidade.findAll(attr).then(function(lista) {
      res.json({unidades: lista});
    });
  },
  deleteUnidade: (req,res)=>{
    models.Unidade.findById(req.swagger.params.codigo.value).then((unidade)=>{
      unidade.destroy();
      res.json({codret: 0, mensagem: "Unidade apagada com sucesso"});
    });
  },
  import_arquivo: (req,res)=>{
      var arquivo = req.swagger.params.arquivo.value;
      // Le arquivo
      if(arquivo.mimetype=='text/csv'){
        csv({noheader:false, delimiter:';', trim:true, headers:['codigo','sigla','nome','informal', 'competencia', 'atividade', 'unidade_pai']})
        .fromString(arquivo.buffer.toString())
        .on('json', (json)=>{
            //console.log('original',json);
            if('sigla' in json){
              var uni = Object.assign(json, {isInformal: (json['informal']=='S')})
              if(json['unidade_pai']){
                uni = Object.assign(uni,{unidadepai:json['unidade_pai'] });
              }
              //console.log(uni);
              models.Unidade.findOrCreate({where:{
                  codigo: json['codigo']
                },
                defaults: uni}).then((u, created)=>{
                  //console.log(u, created);
                });
              }
        })
        .on('error', (err)=>{
          console.log(err);
          res.status(500).send(err);
        })
        .on('done', ()=>{
            res.json({codret: 0, mensagem: "Arquivo rescebido com sucesso."});
        });
      }
  },
  getCodigoUnidadePai(codigo){
    return models.Unidade.findById(codigo,{
      include: [ { model: models.Unidade, as: 'ancestors' } ],
      order: [ [ { model: models.Unidade, as: 'ancestors' }, 'nu_nivel', 'DESC' ] ]}
    );
  }
}
