const async = require('async');
const pg = require('pg');
const util = require('util');
const _ = require('underscore');

const indicador = {

  // Criterio de Analise
  'IBGEMUN': { desc: 'IBGE Municipio',
        metadata: [
          {colType: 'String', colName: 'regiao',titulo: 'Região', resumo: 'Região agregada', tipo: 'geo' },
          {colType: 'String', colName: 'Local',titulo: 'Cidade', resumo: 'Região desagregada', tipo: 'geo'},
          {colType: 'String', colName: 'codigogeo', titulo: 'Municipio', resumo: 'Código da unidade', tipo: 'id'},
          {colType: 'Numeric',colName: 'ano', titulo: 'Ano', resumo: 'Ano da ocorrência', tipo: 'ano', ref: 'ano'},
          {colType: 'Numeric', colName: 'pop_me_15', titulo:'População menor de 15 anos', descricao: 'População menor de 15 anos', tipo: 'valor'},
          {colType: 'Numeric', colName: 'pop', titulo:'População', descricao: 'População', tipo: 'valor'},
        ],
        sql:'SELECT tb_ibge.uf, tb_ibge.ibge as codigogeo, tb_ibge.cidade as local, tabpop.ano_pop as ano, sum(tabpop.pop_me_15)::int as pop_me_15, sum(tabpop.pop)::int as pop FROM dbgeral.tb_pop_faixas AS tabpop INNER JOIN dbgeral.tb_ibge AS tb_ibge ON tabpop.co_ibge = tb_ibge.ibge WHERE  tabpop.pop_me_15 > 0 AND tabpop.pop > 0 AND tabpop.ano_pop > 2000 TTT group by tabpop.ano_pop,tb_ibge.cidade,tb_ibge.ibge,tb_ibge.uf'},
  'IBGEEST': { desc: 'IBGE Estadual',
        metadata: [
          {colType: 'String', colName: 'regiao', titulo:'Região', descricao: 'Região agregada', tipo: 'geo'},
          {colType: 'String', colName: 'Local', titulo:'Localidade', descricao: 'Região desagregada', tipo: 'geo'},
          {colType: 'String', colName: 'codigogeo', titulo:'Nome UF', descricao: 'Código da unidade', tipo: 'id'},
          {colType: 'Numeric', colName: 'ano', titulo:'Ano', descricao: 'Ano da ocorrência', tipo: 'ano'},
          {colType: 'Numeric', colName: 'pop_me_15', titulo:'População menos de 15 anos', descricao: 'População menor de 15 anos', tipo: 'valor'},
          {colType: 'Numeric', colName: 'pop', titulo:'População', descricao: 'População', tipo: 'valor'},
        ],
        sql:'SELECT tb_ibge.regiao, tb_ibge.co_uf as codigogeo, tb_ibge.uf as local, tabpop.ano_pop as ano, sum(tabpop.pop_me_15)::int as pop_me_15, sum(tabpop.pop)::int as pop FROM dbgeral.tb_pop_faixas AS tabpop INNER JOIN dbgeral.tb_ibge AS tb_ibge ON tabpop.co_ibge = tb_ibge.ibge WHERE tabpop.pop_me_15 > 0 AND tabpop.pop > 0 AND tabpop.ano_pop > 2000 TTT group by tb_ibge.regiao, tb_ibge.co_uf, tb_ibge.uf, tabpop.ano_pop'},
  // TODO: Não tem por requigão?  E nacional?

  // Indicadores
  'DHM14A':{ desc: 'Detecção em menores de 15 anos',
        resumo: 'Casos novos em menores de 15 anos de idade residentes em determinado local e diagnosticados no ano da avaliação',
        sql: 'SELECT XXX nu_ano_ref AS ano, sum(qt_casos_agravo) AS DHM14A FROM morbi_mortalidade2.tb_casos_agravo_hanseniase WHERE co_agravo = 4 AND co_grupo_agravo = 10 GROUP BY XXX nu_ano_ref'},
  'DGIID':{ desc: 'Detecção de grau II de deformidade',
        resumo: 'Detecção de grau II de deformidade","resumo":"Casos novos com grau 2 de incapacidade física no diagnóstico, residentes em determinado local e detectados no ano da avaliação',
        sql: 'SELECT XXX nu_ano_ref AS ano, sum(qt_casos_agravo) AS DGIID FROM morbi_mortalidade2.tb_casos_agravo_hanseniase WHERE co_agravo = 4 AND co_grupo_agravo = 82 GROUP BY XXX nu_ano_ref'},
  'DPG': { desc:'Detecção na pop. geral',
        resumo: 'Número de casos novos residentes em determinado local e diagnosticados no ano da avaliação',
        sql: 'SELECT XXX nu_ano_ref AS ano, sum(qt_casos_agravo) AS DPG FROM morbi_mortalidade2.tb_casos_agravo_hanseniase WHERE co_agravo = 4 AND co_grupo_agravo = 16 GROUP BY XXX nu_ano_ref'},
  'CCAC': { desc:'Casos curados nos anos das coortes',
        resumo: 'População total residente no mesmo local e período',
        sql: 'SELECT XXX nu_ano_ref AS ano, sum(qt_casos_agravo) AS CCAC FROM morbi_mortalidade2.tb_casos_agravo_hanseniase WHERE co_agravo = 4 AND co_grupo_agravo = 310 GROUP BY XXX nu_ano_ref'},
  'CNDAC': { desc:'Casos novos diagnosticados nos anos das coortes',
        resumo: 'Total de casos novos de hanseníase residentes no mesmo local e diagnosticados nos anos das coortes',
        sql: 'SELECT XXX nu_ano_ref AS ano, sum(qt_casos_agravo) AS CNDAC FROM morbi_mortalidade2.tb_casos_agravo_hanseniase WHERE co_agravo = 4 AND co_grupo_agravo = 320 GROUP BY XXX nu_ano_ref'},
  'CIR': { desc:'Contatos intradomiciliares registrados',
        resumo: 'Total de contatos intradomiciliares registrados referentes aos casos novos de hanseníase residentes no mesmo local e diagnosticados no ano de avaliação',
        sql: 'SELECT XXX nu_ano_ref AS ano, sum(qt_casos_agravo) AS CIR FROM morbi_mortalidade2.tb_casos_agravo_hanseniase WHERE co_agravo = 4 AND co_grupo_agravo = 90 GROUP BY XXX nu_ano_ref'},
  'CIE': { desc:'Contatos intradomiciliares examinados',
        resumo: 'Número de contatos intradomiciliares examinados referente aos casos novos residentes em determinado local e diagnosticados no ano da avaliação',
        sql: 'SELECT XXX nu_ano_ref AS ano, sum(qt_casos_agravo) AS CIE FROM morbi_mortalidade2.tb_casos_agravo_hanseniase WHERE co_agravo = 4 AND co_grupo_agravo = 80 GROUP BY XXX nu_ano_ref'},

};

/*
const config = {
  user: 'vasconcelos', //env var: PGUSER
  database: 'dbspo', //env var: PGDATABASE
  password: 'serenaya',
  host: '10.1.2.25', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
*/
const config = {
  user: 'vasconcelos', //env var: PGUSER
  database: 'dbspo', //env var: PGDATABASE
  password: 'serenaya',
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

const pool = new pg.Pool(config);

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

module.exports = {
  getValores: (req, res)=>{
    // Tipo nacional -> BR, UF, MUN TODO: Depois colocar por regiao e BR, REG
    var tipo = '';
    var sql_from = ' SELECT * FROM IBGE ';
    var sql_with = '';
    var campo_agregacao = ''; // TODO: Colocar na configuracao do indicador
    var tipoFiltro = '', tipoRegiao = '', codigoRegiao = '';
    var meta = [];

    if(req.swagger.params.tipo && req.swagger.params.tipo.value){
      tipo = req.swagger.params.tipo.value;
    }

    switch(tipo){
      case 'UF':
        sql_with = 'WITH IBGE AS (' + indicador['IBGEEST'].sql + ')';
        campo_agregacao = 'co_uf';
        tipoFiltro = 'nacional';
        tipoRegiao = 'brasil';
        meta = meta.concat(indicador['IBGEEST'].metadata);
        break;
      case 'MUN':
        sql_with = 'WITH IBGE AS (' + indicador['IBGEMUN'].sql + ')';
        campo_agregacao = 'co_ibge';
        tipoFiltro = 'municipal';
        tipoRegiao = 'municipio';
        meta = meta.concat(indicador['IBGEMUN'].metadata);
        break;
      default:
        sql_with = 'WITH IBGE AS (' + indicador['IBGEEST'].sql + ')';
        campo_agregacao = 'co_uf';
        tipoFiltro = 'nacional';
        meta = meta.concat(indicador['IBGEEST'].metadata);
        break;
    }

    // Filtro por uf, ibge, regiao,
    var where = '';
    switch (req.swagger.params.filtro.value) {
      case 'UF':
        if(req.swagger.params.valores_filtro.value){
          where = where + ' AND tb_ibge.co_uf IN ('+ req.swagger.params.valores_filtro.value+')';
          tipoFiltro = 'regional';
          tipoRegiao = 'uf';
          codigoRegiao = req.swagger.params.valores_filtro.value;
        }
        break;
      case 'MUN':
        if(req.swagger.params.valores_filtro.value){
          where = where + ' AND tb_ibge.ibge IN (' + req.swagger.params.valores_filtro.value+')';
          codigoRegiao = req.swagger.params.valores_filtro.value;
        }
        break;
      case 'CID':
        if(req.swagger.params.valores_filtro.value){
          where = where + ' AND tb_ibge.co_tr_cidadania IN (' + req.swagger.params.valores_filtro.value + ')';
        }else{
          where = where + ' AND tb_ibge.co_tr_cidadania >0';
        }
        break;
      case 'CCL':
        if(req.swagger.params.valores_filtro.value){
          where = where + ' AND tb_ibge.co_colegiado in (' + req.swagger.params.valores_filtro.value + ')'
        }
        break;
      case 'REG':
          if(req.swagger.params.valores_filtro.value){
            where = where + ' AND floor(tb_ibge.co_uf/10)  IN (' + req.swagger.params.valores_filtro.value+')';
            codigoRegiao = req.swagger.params.valores_filtro.value;
          }
          break;
      case 'MET':
          if(req.swagger.params.valores_filtro.value){
            where = where + ' AND tb_ibge.codigo_id_metropolitana IN (' + req.swagger.params.valores_filtro.value + ')';
          }else{
            where = where + ' AND tb_ibge.codigo_id_metropolitana >0';
          }
          break;
      case 'FRT':
          where = where + 'tb_ibge.sis_fronteiras = 1';
          break;
      case 'QUA':
          where = where + 'tb_ibge.habilitados_qualifar = 1';
          break;
      case 'SA':
          where = where + 'tb_ibge.semi_arido = 1';
          break;
      case 'AL':
          where = where + 'tb_ibge.amazonia_legal = 1';
          break;
      case 'RIB':
          where = where + 'tb_ibge.co_ride = 1';
          break;
      case 'QSU':
          if(req.swagger.params.valores_filtro.value){
            where = where + ' AND tb_ibge.co_id_qualisus IN (' + req.swagger.params.valores_filtro.value + ')';
          }else{
            where = where + ' AND tb_ibge.co_id_qualisus >0';
          }
          break;
    }

    req.swagger.params.codigos.value.forEach((item)=>{
      if(indicador[item]){
        sql_with = sql_with + ',' + item + ' AS (' + indicador[item].sql + ')';
        sql_from = sql_from + ' left JOIN ' + item + ' ON IBGE.codigogeo=' + item + '.' + campo_agregacao + ' AND IBGE.ano=' + item + '.ano' ;
        meta.push({colType: 'Numeric', titulo: indicador[item].desc, descricao: indicador[item].resumo, tipo: 'valor', colName: item.toLowerCase()});
      }
    });

    // Trocas
    sql_with = sql_with.replace(new RegExp('XXX','g'), campo_agregacao+',');
    sql_with = sql_with.replace(new RegExp('TTT','g'), where);

    var sql = sql_with+sql_from + ' ORDER BY 1,2,3,4';

    console.log(sql);

    pool.query(sql,null, (err, result)=>{
      //console.log(result);
      if(err) {
        console.error('error running query', err);
        res.json({mensagem:err});
        return;
      }

      res.json({
        resultset: result.rows,
        info: { tipoFiltro: tipoFiltro, tipoRegiao: tipoRegiao, codigoRegiao: codigoRegiao},
        metadata:addColIndex(meta)
      });
    });
  },
  getResultado: (req, res)=>{
      var tipo = '';
      var sql_with = '';
      var campo_agregacao = '';
      var tipoFiltro = '', tipoRegiao = '', codigoRegiao = '';

      if(req.swagger.params.tipo && req.swagger.params.tipo.value){
        tipo = req.swagger.params.tipo.value;
      }
      // Filtro por uf, ibge, regiao,
      var where = '';
      //TODO: Trata o Filtro

      /*req.swagger.params.codigos.value.forEach((item)=>{
        if(indicador[item]){
          sql_with = sql_with + ',' + item + ' AS (' + indicador[item].sql + ')';
          sql_from = sql_from + ' left JOIN ' + item + ' ON IBGE.codigogeo=' + item + '.' + campo_agregacao + ' AND IBGE.ano=' + item + '.ano' ;
          meta.push({colType: 'Numeric', titulo: indicador[item].desc, descricao: indicador[item].resumo, tipo: 'valor', colName: item.toLowerCase()});
        }
      });*/

      // Trocas
      //sql_with = sql_with.replace(new RegExp('XXX','g'), campo_agregacao+',');
      //sql_with = sql_with.replace(new RegExp('TTT','g'), where);

      //var sql = sql_with+sql_from + ' ORDER BY 1,2,3,4';

      //console.log(sql);

      /*pool.query(sql,null, (err, result)=>{
        //console.log(result);
        if(err) {
          console.error('error running query', err);
          res.json({mensagem:err});
          return;
        }*/
      res.json({
        resultset: null,
        info: { tipoFiltro: tipoFiltro, tipoRegiao: tipoRegiao, codigoRegiao: codigoRegiao},
        metadata:addColIndex(meta)
      });
  }
}

function addColIndex(arr_metadata){
  i=0
  arr_metadata.forEach(item=>{
    item['colIndex'] = i;
    i++;
  });
  return arr_metadata;
}
