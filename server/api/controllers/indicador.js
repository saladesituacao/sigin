require('../extensions/array');
var models  = require('../models');
var sequelize = require('sequelize');
var unidade = require('./unidade');
var security = require('../helpers/security');

module.exports = {
  getIndicadores: (req, res)=>{
    var perfil = security.getPerfil(req);
    var attr = {
      attributes: [ 'id', 'codigo', 'titulo', 'descricao', 'ativo',  'acumulativo', 'privado', 'conceituacao',
      'fonte_dados', 'dt_inclusao', 'ultima_atualizacao' ],
      include: [ { model: models.Periodicidade, as: 'PeriodicidadeAtualizacao' },
        { model: models.Periodicidade, as: 'PeriodicidadeAvaliacao' },
        { model: models.Periodicidade, as: 'PeriodicidadeMonitoramento' },
        { model: models.Unidade, as: 'Unidade' },
        { model: models.UnidadeMedida, as: 'UnidadeMedida' },
        { model: models.Granularidade, as: 'Granularidade' }
      ],
      where: {},
      order: ['titulo']
    };
    //console.log("Usuario autenticado:",req.headers.authorization);
    // Testa autorizacao para forcar filtro
    //console.log("PERFIL++>", perfil);
    if (!req.headers.authorization){
        attr.where['privado'] = false;
    }else if(perfil && perfil.Perfil.sigla!='ADM'){
      console.log('Unidade restritiva', perfil.UnidadeCodigo);
      attr.include.push({ model: models.Unidade , as: 'ResponsavelGerencial', where:{codigo: perfil.UnidadeCodigo}});
    }

    //if(req.swagger.params.limit.value){
    //    attr['limit'] = req.swagger.params.limit.value;
    //} else {
        //BUG: Há um erro no sequelize para consultas com limit e mapeamentos n:n como o caso da Tags
        if(req.swagger.params.tag.value){
            attr.include.push({ model: models.Tag, as: 'Tags', where:{ codigo: req.swagger.params.tag.value}});
        }else{
            attr.include.push({ model: models.Tag, as: 'Tags'});
        }
    //}

    if(req.swagger.params.query.value){
        attr.where['$or'] = [{'titulo':{ '$like': `%${req.swagger.params.query.value}%`}},
                             {'descricao':{ '$like': `%${req.swagger.params.query.value}%`}}];
    }

    if(req.swagger.params.offset.value){
        attr['offset'] = req.swagger.params.offset.value;
    }

    if(req.swagger.params.codigos.value){
        attr.where['codigo']={};
        attr.where['codigo']['$in'] = req.swagger.params.codigos.value;
    }

    if(req.swagger.params.secretaria.value){
        //console.log('Secretaria: ', req.swagger.params.secretaria.value);
        attr.where['UnidadeCodigo'] = req.swagger.params.secretaria.value;
    }
    //console.log('attr', attr, 'codigos====>', req.swagger.params.codigos.value);
    models.Indicador.findAndCountAll(attr).then(function(resp) {
      //TODO: Provisoriamente enquanto o problema do limit na query não é resolvido
      if(req.swagger.params.limit.value){
        resp.rows = resp.rows.slice(0, req.swagger.params.limit.value);
      }
      res.json(resp);
    });
  },
  getIndicadoresImportacao: (req, res)=>{
    var attr = {
      attributes: [ 'id', 'codigo', 'titulo', 'descricao',
      'fonte_dados', 'ultima_atualizacao', 'granularidade', 'tipo_consulta' ],
      include: [ { model: models.Periodicidade, as: 'PeriodicidadeAtualizacao' },
        { model: models.Unidade, as: 'Unidade' },
        { model: models.UnidadeMedida, as: 'UnidadeMedida' },
        { model: models.CategoriaAnalise , as: 'CategoriasAnalise' },
        { model: models.Granularidade, as: 'Granularidade' }
      ],
      where: { 'ativo': true },
      order: ['titulo']
    };
    if(req.swagger.params.tipo.value){
        attr.where['tipo_consulta'] = req.swagger.params.tipo.value;
    }
    models.Indicador.findAndCountAll(attr).then(function(resp) {
      res.json(resp);
    });
  },
  createIndicador: (req,res)=>{
    var entidade = req.body;
    console.log('create', entidade);
    models.Indicador.create(entidade).then((indicador)=> {
      if(req.body.tags)
        indicador.setTags(req.body.tags);
      res.json({codret: 0, mensagem: "Indicador cadastrado com sucesso"});
    }).catch(err=>{
      if('errors' in err){
        if(err.errors.length>0){
          console.log('Erro na inclusao do indicador ==>', {codret: 1001, message: `Erro na inclusão do indicador ${err.errors[0].value}: ${err.errors[0].message}`});
          res.status(500).json({codret: 1001, message: `Erro na inclusão do indicador ${err.errors[0].value}: ${err.errors[0].message}`});
        }
      }else{
        res.status(500).json({codret: 1001, message: "Erro no cadastramento do indicador"});
      }

    });
  },
  getIndicador: (req,res)=>{
    models.Indicador.findAll(
      { include: [ { model: models.Tag, as: 'Tags' },
                   { model: models.Indicador, as: 'IndicadoresRelacionados' },
                   { model: models.CategoriaAnalise , as: 'CategoriasAnalise' },
                   { model: models.ClassificacaoIndicador, as: 'ClassificacaoIndicador' },
                   { model: models.Classificacao6sIndicador, as: 'Classificacao6sIndicador' },
                   { model: models.ClassificacaoMSIndicador, as: 'ClassificacaoMSIndicador' },
                   { model: models.Periodicidade, as: 'PeriodicidadeAtualizacao' },
                   { model: models.Periodicidade, as: 'PeriodicidadeAvaliacao' },
                   { model: models.Periodicidade, as: 'PeriodicidadeMonitoramento' },
                   { model: models.Unidade , as: 'ResponsavelGerencial',
                       include: [ { model: models.Unidade, as: 'ancestors' } ],
                       order: [ [ { model: models.Unidade, as: 'ancestors' }, 'nu_nivel', 'DESC' ] ]
                    },
                   { model: models.Unidade , as: 'ResponsavelTecnico',
                       include: [ { model: models.Unidade, as: 'ancestors' } ],
                       order: [ [ { model: models.Unidade, as: 'ancestors' }, 'nu_nivel', 'DESC' ] ] },
                   { model: models.Unidade , as: 'Unidade',
                       include: [ { model: models.Unidade, as: 'ancestors' } ],
                       order: [ [ { model: models.Unidade, as: 'ancestors' }, 'nu_nivel', 'DESC' ] ] },
                   { model: models.Granularidade , as: 'Granularidade' },
                   { model: models.Criterio_Agregacao , as: 'CriterioAgregacao' },
                   { model: models.UnidadeMedida, as: 'UnidadeMedida' },
                   { model: models.Polaridade, as: 'Polaridade' },
                   { model: models.ParametroFonte, as: 'ParametroFonte' }],
        where: {codigo: req.swagger.params.codigo.value}
      }
    ).then((indicador)=> {
      if(indicador && indicador.length>0)
          res.json(indicador[0]);
    });
  },
  getIndicadorPorId: (req,res)=>{
    models.Indicador.findById(req.swagger.params.id.value,
      { include: [ { model: models.Tag, as: 'Tags' },
                   { model: models.Indicador, as: 'IndicadoresRelacionados' },
                   { model: models.CategoriaAnalise , as: 'CategoriasAnalise' },
                   { model: models.Unidade , as: 'ResponsavelGerencial' },
                   { model: models.Unidade , as: 'ResponsavelTecnico' },
                   { model: models.ClassificacaoIndicador, as: 'ClassificacaoIndicador' },
                   { model: models.Periodicidade, as: 'PeriodicidadeAtualizacao' },
                   { model: models.Periodicidade, as: 'PeriodicidadeAvaliacao' },
                   { model: models.Periodicidade, as: 'PeriodicidadeMonitoramento' },
                    { model: models.Unidade , as: 'Unidade' }] }
    ).then((indicador)=> {
      res.json(indicador);
    });
  },
  deleteIndicador: (req,res)=>{
    models.Indicador.destroy({where: {codigo: req.swagger.params.codigo.value}}).then((resp)=>{
      res.json({codret: 0, mensagem: "Indicador apagado com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      if('original' in err){
        res.status(503).json({codret: err.original.code, message: err.original.detail});
      }else{

        res.status(503).json(err);
      }
    });
  },
  editaIndicador: (req,res)=>{
    console.log('Update indicador',req.body);
    models.Indicador.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      models.Indicador.findAll({where: {codigo: req.swagger.params.codigo.value}}).then( item=>{
        item[0].setTags(req.body.tags);
        res.json({codret: 0, mensagem: "Indicador atualizado com sucesso"});
      });
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na atualização do indicador"});
    });
  },
  updateConceituacao: (req,res)=>{
    models.Indicador.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: `Conceituação do indicador ${req.swagger.params.codigo.value} atualizada com sucesso`});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na gravação da conceituação do indicador"});
    });
  },
  updateInterpretacao: (req,res)=>{
    models.Indicador.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: `Interpretação do indicador ${req.swagger.params.codigo.value} atualizada com sucesso`});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na gravação da atualização da interpretação"});
    });
  },
  updateUso: (req,res)=>{
    //console.log(req.body);
    models.Indicador.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: `Usos do indicador ${req.swagger.params.codigo.value} atualizados com sucesso`});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na gravação do uso do indicador"});
    });
  },
  updateLimitacao: (req,res)=>{
    models.Indicador.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: `Limitações do indicador ${req.swagger.params.codigo.value} atualizadas com sucesso`});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na gravação da limitação do indicador"});
    });
  },
  updateObservacao: (req,res)=>{
    models.Indicador.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: `Observações do indicador ${req.swagger.params.codigo.value} atualizadas com sucesso`});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na gravação da observação"});
    });
  },
  updateNota: (req,res)=>{
    models.Indicador.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: `Notas do indicador ${req.swagger.params.codigo.value} atualizadas com sucesso`});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na gravação da nota técnica"});
    });
  },
  updateProcedimentoOperacional: (req,res)=>{
    models.Indicador.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: `Procedimento operacional para o indicador ${req.swagger.params.codigo.value} atualizadas com sucesso`});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na gravação do procedimento operacional"});
    });
  },
  updateFonteDados: (req,res)=>{
    models.Indicador.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: `Fonte de dados do indicador ${req.swagger.params.codigo.value} atualizado com sucesso`});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na gravação da fonte de dados"});
    });
  },

  updateMetodoCalculo: (req,res)=>{
    models.Indicador.update( req.body, { where: { codigo: req.swagger.params.codigo.value }}).then(() => {
      res.json({codret: 0, mensagem: `Método de Cálculo do indicador ${req.swagger.params.codigo.value} atualizado com sucesso`});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na gravação do método de cálculo"});
    });
  },

  addCategoriaAnalise: (req,res)=>{
    models.Indicador.findById(req.swagger.params.id.value).then( item=>{
      item.addCategoriasAnalise(req.swagger.params.categoria_analise.value);
      res.json({codret: 0, mensagem: "Categoria de análise adicionada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na adição da categoria de análise"});
    });
  },

  deleteCategoriaAnalise: (req,res)=>{
    models.IndicadorCategoriaAnalise.destroy({ where: {
      co_seq_indicador:req.swagger.params.id.value,
      co_categoria_analise:req.swagger.params.categoria_analise.value}}).then(()=>{
        res.json({codret: 0, mensagem: "Relação do indicador com a categoria de análise retirada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na desvinculação da categoria de análise do indicador"});
    });
  },
  addResponsavelGerencial: (req,res)=>{
    models.Indicador.findById(req.swagger.params.id.value).then( item=>{
      item.addResponsavelGerencial(req.swagger.params.responsavel_gerencial.value);
      res.json({codret: 0, mensagem: "Responsável Gerencial adicionado com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na adição do responsável gerencial"});
    });
  },
  deleteResponsavelGerencial: (req,res)=>{
    models.Indicador.findById(req.swagger.params.id.value).then( item=>{
      item.removeResponsavelGerencial(req.swagger.params.responsavel_gerencial.value);
      res.json({codret: 0, mensagem: "Relação do indicador com o Responsável Gerencial retirada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na desvinculação do responsável gerencial do indicador"});
    });
  },
  addResponsavelTecnico: (req,res)=>{
    models.Indicador.findById(req.swagger.params.id.value).then( item=>{
      item.addResponsavelTecnico(req.swagger.params.responsavel_tecnico.value);
      res.json({codret: 0, mensagem: "Responsável Técnico adicionado com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na adição do responsável técnico do indicador"});
    });
  },

  deleteResponsavelTecnico: (req,res)=>{
    models.Indicador.findById(req.swagger.params.id.value).then( item=>{
      item.removeResponsavelTecnico(req.swagger.params.responsavel_tecnico.value);
      res.json({codret: 0, mensagem: "Relação do indicador com o Responsável Técnico retirada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na desvinculação do responsável técnico do indicador"});
    });
  },
  addIndicadorRelacionado: (req,res)=>{
    Promise.all([
      models.Indicador.findById(req.swagger.params.id_pai.value),
      models.Indicador.findById(req.swagger.params.id.value)
    ]).then((item)=>{
      item[0].addIndicadoresRelacionados(req.swagger.params.id.value);
      item[1].addIndicadoresRelacionados(req.swagger.params.id_pai.value);
      res.json({codret: 0, mensagem: "Indicador relacionado adicionado com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro na adição do relacionamento entre indicadores"});
    });
    /*models.Indicador.findById(req.swagger.params.codigo_pai.value).then( item=>{
      item.addIndicadoresRelacionados(req.swagger.params.codigo.value);
      res.json({codret: 0, mensagem: "Indicador relacionado adicionado com sucesso"});
    });

    models.Indicador.findById(req.swagger.params.codigo.value).then( item=>{
      item.addIndicadoresRelacionados(req.swagger.params.codigo_pai.value);
      res.json({codret: 0, mensagem: "Indicador relacionado adicionado com sucesso"});
    });*/
  },

  deleteIndicadorRelacionado: (req,res)=>{
    models.IndicadorRelacionado.destroy(
      { where: {$or: [
        { co_seq_indicador:req.swagger.params.id.value,
        co_seq_indicador_pai:req.swagger.params.id_pai.value},
        { co_seq_indicador:req.swagger.params.id_pai.value,
          co_seq_indicador_pai:req.swagger.params.id.value}]}
        }).then(()=>{
        res.json({codret: 0, mensagem: "Relação apagada com sucesso"});
    }).catch(err=>{
      console.log('Erro', err);
      res.status(500).json({codret: 1001, message: "Erro apagando o relacionamento do indicador"});
    });
  },

  getIndicadorPesquisaPorCodigo: (codigos)=>
    models.Indicador.findAll(
      { attributes: [  'id', 'codigo', 'titulo', 'descricao',
          'referencia_consulta', 'ultima_atualizacao' ],
      include: [
        { model: models.Granularidade , as: 'Granularidade' },
        { model: models.BancoDados , as: 'BancoDados' },
        { model: models.TipoConsulta , as: 'TipoConsulta' },
        { model: models.Criterio_Agregacao , as: 'CriterioAgregacao' },
        { model: models.Periodicidade , as: 'PeriodicidadeAtualizacao' },
        { model: models.CategoriaAnalise , as: 'CategoriasAnalise',
            include: [ { model: models.CategoriaAnaliseItem, as: 'Itens',
            include: [ { model: models.CategoriaAnaliseItem, as: 'descendents' } ]  } ] }
      ],
      //  where: {codigo: req.swagger.params.codigo.value}
      where: {codigo: { $in: codigos}}
    }),

    import_arquivo: (req,res)=>{
        var arquivo = req.swagger.params.arquivo.value;


        // Le arquivo
        if(arquivo.mimetype=='text/csv'){
          csv({noheader:false, delimiter:';', trim:true, headers:['codigo','sigla','nome','informal', 'competencia', 'atividade', 'unidade_pai']})
          .fromString(arquivo.buffer.toString())
          .on('json', (json)=>{
              //console.log('original',json);
              if('sigla' in json){

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
    }


}
