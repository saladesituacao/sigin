const async = require('async');
const pg = require('pg');
const util = require('util');
const indicador = require('./indicador');
const NodeCache = require( "node-cache" );
const cache = new NodeCache();
const config_param = require('../helpers/config')();

const config = {
  user: process.env.USER_DB || config_param.user, //env var: PGUSER
  database: process.env.DATABASE || config_param.database, //env var: PGDATABASE
  password: process.env.PASSWORD_DB || config_param.password,
  host: process.env.HOSTDB || config_param.hostdb, // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const schema = process.env.SCHEMA || config_param.schema;
const pool = new pg.Pool(config);
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

module.exports = {
  getResultado: (req, res)=>{
    var config = montaParametros(req.swagger.params);
    module.exports.consultaResultado(config).then( (resultado) =>{
        // req.headers.accept === 'application/json'
        switch (config.formato) {
          case 'LIN':
            res.json(resultado[0].rows);
            break;
          case 'CDA':
              res.json(module.exports.formataCDAResult(resultado[0].rows, resultado[0].fields, config, resultado[1]));
              break;
          case 'TAB':
              res.json(module.exports.formataJSONResult(resultado[0].rows, config, Object.keys(resultado[1])));
              break;
          default:
              res.status(500).send({mensagem: "Formato inválido"});
        }
      }, err =>{
        console.log('Erro no resultset', err);
        res.status(500).send(err);
      }
    );
  },
  consultaResultado: (config)=>{
    return new Promise((resolve, reject)=>{
      // Filtro por ano, uf, ibge, regiao,
      convertCodigoIndicador(config).then(indicadores=>{
        if(Object.keys(indicadores).length==0){
          console.log('Sem dados');
          reject({codret: -1, mensagem: "Indicador não encontrado"});
          return;
        }

        var sql = montaQuery(indicadores, config);
        console.log('SQL+=>', sql);
        pool.query(sql,null, (err, result)=>{
          //console.log(result);
          if(err) {
            console.error('error running query', err);
            reject({mensagem:err});
            return;
          }
          resolve([result, indicadores]);
        });

      }, err=>{
        reject(err);
      });
    });
  },
  /*
    Formatador de saída para consultas CDA.
  */
   formataCDAResult: (result, fields, config, indicadores)=>{
    var metadata=[];
    var filtro={};
    var tipoRegiao='';

    indicadores['REGIAO']={titulo:'Região', descricao:'Região agregada', tipo:'geo'};
    indicadores['LOCAL']={titulo:'Cidade', descricao:'Região desagregada', tipo:'geo'};
    indicadores['UF']={titulo:'Estado', descricao:'Unidade Federativa', tipo:'geo'};
    indicadores['CODIGOGEO']={titulo:'Município', descricao:'Código da unidade', tipo:'id'};
    indicadores['ANO']={titulo:'Ano', descricao:'Ano da ocorrência', tipo:'id'};


    // Acrescenta os dados da consulta
    var referencia = indicadores[Object.keys(indicadores)[0]];
    switch (config.tipo) {
      case 'BR':
        tipoRegiao='br';
        break;
      case 'RG':
        tipoRegiao='regiao';
        break;
      case 'UF':
        tipoRegiao='uf';
        break;
      case 'MN':
        tipoRegiao='municipio';
        break;
      case 'CN':
        tipoRegiao='cnes';
        break;
    }

    var numIndex = 0;

    fields.forEach(item=>{
      var key = item.name.toUpperCase();
      var meta = {
          colType: item.dataTypeID == 23? "Numeric": "String",
          colName: item.name,
          colIndex: numIndex++,
          titulo: indicadores[key].titulo,
          resumo: indicadores[key].descricao,
          tipo: indicadores[key].tipo
      };
      metadata.push(meta);
    });

    return {
      resultset: result,
      info: {tipoFiltro: config.filtro, tipoRegiao: config.tipo, codigoRegiao: config.valores_filtro},
      metadata: metadata
    };
  },

  /*
    Formatador de saída para consultas TABulares.
  */
  formataJSONResult: (result, config, indicadores)=>{
    var resultado = tabulaResultado(result, indicadores, config);
    return {
      rows: resultado.length,
      resultset: resultado,
      titulos: result.titulos,
      info: { tipoFiltro: config.filtro, tipoRegiao: config.tipo, codigoRegiao: config.valores_filtro}
    };
  }
}

/*
  Monta os uma saida de configuracao com o que e necessario
  para a consulta dinamica
*/
function montaParametros(paramEntrada){
  var ans = {};
  Object.keys(paramEntrada).forEach(key=>{
    ans[key] = paramEntrada[key].value;
  });
  return ans;
}

/*
  Converte o codigo alfanumerico do indicador em metadados
  necessarios para montagem dinamica da query de consulta.
*/
async function  convertCodigoIndicador(config){

  var arr={};
  var granularidade = 0;
  var periodicidade = 0;
  var arrBusca = await indicador.getIndicadorPesquisaPorCodigo(config.codigos);
  var tipoGranularidade = 0;

  switch (config.tipo){
    case 'BR':
      tipoGranularidade = 1;
      break;
    case 'RG':
      tipoGranularidade = 2;
      break;
    case 'UF':
      tipoGranularidade = 3;
      break;
    case 'MN':
      tipoGranularidade = 4;
      break;
    case 'CN':
      tipoGranularidade = 5;
      break;
  }

  return new Promise(async (resolve, reject) => {

      if(!arrBusca){
        reject('Parametro de consulta vazio');
      }
      try{
        for (var i=0; i < arrBusca.length; i++){
          var item = arrBusca[i];
          arr[item.codigo]=getInfo(item, config, granularidade, periodicidade, tipoGranularidade);
          granularidade = arr[item.codigo].granularidade;
          periodicidade = arr[item.codigo].periodicidade;
          if('indicadores_formula' in arr[item.codigo]){
            var arritemFormula = await indicador.getIndicadorPesquisaPorCodigo(arr[item.codigo]['indicadores_formula']);
            arr[item.codigo]['indicadores'] = {};
            arritemFormula.forEach(itemFormula=>{
              arr[item.codigo]['indicadores'][itemFormula.codigo] = getInfo(itemFormula, config, granularidade, periodicidade, tipoGranularidade);
            });
          } 
        }
      }catch(err){
        try{
          reject(JSON.parse(err.message));
        }catch(err2){
          console.log('Erro', err);
          reject({codret: 1001, message: "Erro na pesquisa dos resultados do indicador"});
        }
      }
    resolve(arr);
  });
}

/**
 * Valida e recupera informações de metadados necessárias para criar dinamicamente
 * a query para consulta do indicador
 * 
 * @param {item de indicador a ser pesquisado} item
 * @param {configuracao} configuracao (parametros de entrada)
 * @param {granularidade da consulta geral} granularidade
 * @param {peridicidade da consulta geral} periodicidade
 * @param {tipoGranularidade qual o tipo de agregacao selecionada na consulta} tipoGranularidade
 */
function getInfo(item, config, granularidade, periodicidade, tipoGranularidade){
    var ans=null;
    var categoria = null;

    ans = {
      id: item.id,
      codigo: item.codigo,
      titulo: item.titulo,
      descricao: item.descricao,
      granularidade: item.Granularidade.codigo,
      banco: item.BancoDados,
      tipoConsulta: item.TipoConsulta.codigo,
      sql: item.referencia_consulta,
      criterioAgregacao: item.CriterioAgregacao.codigo,
      periodicidade: item.PeriodicidadeAtualizacao.codigo,
      ultima_atualizacao: item.ultima_atualizacao,
      tipo: 'valor'
    };

    // Testa categoria de CategoriaAnalise
    if('porcategoria' in config && config.porcategoria){
      var categoriaSelecionada = item.CategoriasAnalise.find(item=> item.codigo==config.porcategoria);
      if(categoriaSelecionada){
        //console.log('Consulta por categoria', categoriaSelecionada.Itens);
        ans['categoriaSelecionada']= categoriaSelecionada;
        ans['categoria'] = getSubCategorias(categoriaSelecionada.Itens);
        if(!categoria)
          categoria = ans['categoria'];
      }else{
        throw new Error(JSON.stringify({codret: 1016, message: 'Categoria de análise não associada ao indicador ou a um dos indicadores'}));
      }
      if(categoria && categoria!=ans[item.codigo]['categoria'])
        throw new Error(JSON.stringify({codret: 1015, message: 'Conjunto de indicadores com categorias de analise não homogeneas ou diferentes'}));
    }
    if(ans.tipoConsulta==1){  // Formula
      //TODO: Essa linha so funciona no node 8.11 em diante:
      //ans['indicadores_formula'] =  ans.sql.match(/(?<=\[).+?(?=\])/g);
      // Trocando temporariamente pelo codigo
      var reg=/\[(.*?)\]/g;
      var match;
      ans['indicadores_formula'] =  [];
      while(match = reg.exec(ans.sql)) {
        ans['indicadores_formula'].push(match[1]);
      }
    }
    // Testa tipos de consulta
    if(ans.tipoConsulta!=1 && ans.tipoConsulta!=2 && ans.tipoConsulta!=3){ // Tratar depois a formula
      throw new Error(JSON.stringify({codret: 1010, message: `Tipo de consulta (${ans.tipoConsulta}) incompatível ou indicador sem informação`}));
    }
    // Testa tipos de periodicidade
    if(ans.periodicidade!=30 && ans.periodicidade!=360){ // Tratar depois a periodicidade
      throw new Error(JSON.stringify({codret: 1011, message: "Consulta o tipo de periodicidade do indicador ainda não foi desenvolvida"}));
    }
    // Testa granularidade.  Se difere deve dar um erro
    if(granularidade==0){
      granularidade = ans.granularidade;
    }
    if(ans.granularidade!=granularidade){
      throw new Error(JSON.stringify({codret: 1012, message: "Conjunto de indicadores com granularidade diferentes"}));
    }
    if(ans.granularidade<tipoGranularidade){
      throw new Error(JSON.stringify({codret: 1013, message: `Indicador ${item.codigo} com granularidade menor que o tipo de consulta requerida`}));
    }
    if(ans.granularidade>tipoGranularidade && item.criterio_agregacao==0){
      throw new Error(JSON.stringify({codret: 1014, message: `Indicador ${item.codigo} com granularidade diferente do tipo de consulta e sem critério de agregação definido`}));
    }
    // Testa periodicidade.  Se difere deve dar um erro
    if(periodicidade==0){
      periodicidade = ans.periodicidade;
    }
    if(ans.periodicidade!=periodicidade){
      throw new Error(JSON.stringify({codret: 1015, message: 'Conjunto de indicadores com periodicidades diferentes'}));
    }
    return ans;
}

/**
 * Recupera as subcategorias e um conjunto de itens de categorias.
 * 
 * No final devemos ter uma lista dos últimos itens na categoria de
 * itens (folhas da árvore).
 * 
 * @param {itens de categorias} itens 
 */
function getSubCategorias(itens){
  let ans=[];
  
  itens.forEach(subcat=>{
    if('descendents' in subcat && subcat.descendents.length>0){
      let temp = getSubCategorias(subcat['descendents']);
      if(temp.length>0){
        ans = ans.concat(temp);
      }
    }else{
      ans.push(subcat.codigo);
    }
  });
  return ans;
}

function montaResult(indicadores, config){
  var referencia = indicadores[Object.keys(indicadores)[0]];
  var varPeriodicidade = getPeriodicidade(referencia.periodicidade);
  var varGranularidade = getGranularidade(referencia.granularidade);
  var arrControle = [];
  var operation = '';
  var per = '';
  var gran = '';


  Object.keys(indicadores).forEach(key => {
      switch(indicadores[key].tipoConsulta){
        case 1: // Formulas
          var ans = ' ' + indicadores[key].sql;
          if(arrControle.indexOf(indicadores[key].codigo)==-1){
              for(key2 in indicadores[key].indicadores){
                ans = ans.replace(new RegExp(`[${key2}]`.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), `(${key2})`);
                per += key2 + '.' + varPeriodicidade + ',';
                gran += key2 + '.' + varGranularidade + ',';
                arrControle.push(key2);
              }
              ans += ` ${indicadores[key].codigo},`;
              operation += ans;
          }
          break;
        case 3: // Tb Resultado
          operation +=` (${indicadores[key].codigo}) ${indicadores[key].codigo},`;
          if(arrControle.indexOf(indicadores[key].codigo)==-1){
            per += indicadores[key].codigo + '.' + varPeriodicidade + ',';
            gran += indicadores[key].codigo + '.' + varGranularidade + ',';
            arrControle.push(indicadores[key].codigo);
          }   
          break;
      }
  });

  per = per.substr(0, per.length-1);
  gran = gran.substr(0, gran.length-1);

  return `RESULT as (select ${operation} 
      coalesce(${per}) as ${varPeriodicidade},
      coalesce(${gran}) as ${varGranularidade}     
      from ${associaCampos2(arrControle, varPeriodicidade, varGranularidade)})`;
}


/*
  Montador de query de consulta genérica.
*/
function montaQuery(indicadores, config){
  var arr_control=[];
  var sql_with='WITH ';

  (Object.keys(indicadores)).forEach(key=>{
      // monta query conforme o tipo de consulta
      switch (indicadores[key].tipoConsulta) {
        case 1: // Formula
          for(item in indicadores[key].indicadores){
            if(arr_control.indexOf(item)==-1){
              sql_with += `${item} AS ( ${ montaQueryValorIndicador(item, indicadores[key].indicadores[item], config)} ),`;  
              arr_control.push(item);
            }
          };    
          break;
        case 2: // Query
          if(arr_control.indexOf(key)==-1){
            sql_with += `${key} AS ( ${indicadores[key].sql} ),`;
            arr_control.push(key);
          }
          break;
        case 3: // Importação
          if(arr_control.indexOf(key)==-1){
            sql_with += `${key} AS ( ${ montaQueryValorIndicador(key, indicadores[key], config)} ),`;
            arr_control.push(key);
          }
          break;
      }
  });
  sql_with = sql_with.substr(0,sql_with.length - 1);
  var sql = montaQueryComplemento(indicadores, config);
  return `${sql_with} ${sql}`

}

/**
 *  Monta complemento da query para o construtor
 */
function montaQueryComplemento(indicadores, config){
    var select = '';
    var from = 'from ';
    //var where = 'where '; //Essa vai ficar para os filtros
    var groupby = '';
    var orderby = '';

    var varPeriodicidade = '';
    var nomeCampo = '';
    var indicadorAnterior = '';
    var referencia = indicadores[Object.keys(indicadores)[0]];
    var alias = referencia.tipoConsulta==1?Object.keys(referencia.indicadores)[0]:Object.keys(indicadores)[0];

    //console.log('REFERENCIA==>',referencia,'ALIAS==>>',alias)
    switch (referencia.periodicidade) {
      case 360:
        varPeriodicidade = 'ano';
        nomeCampo='co_ano';
        break;
      case 30:
        varPeriodicidade = 'anomes';
        nomeCampo='co_anomes';
        break;
      case 1:
        varPeriodicidade = 'anomesdia';
        nomeCampo='co_anomesdia';
        break;
      default:
    }

    select += `${alias}.${varPeriodicidade},`;
    groupby += `${alias}.${varPeriodicidade},`;

    switch (config.tipo) {
      case 'RG':
        // Testar o parametro
        select += `reg.ds_regiao as regiao, reg.co_regiao as codigogeo,`;
        from += `${schema}.tb_municipio mun
                      inner join ${schema}.tb_uf uf on uf.co_uf=mun.co_uf
                      inner join ${schema}.tb_regiao reg on reg.co_regiao=uf.co_regiao `;
        groupby += `reg.ds_regiao, reg.co_regiao,`;
        orderby += `reg.ds_regiao,`;
        break;
      case 'UF':
        // Testar o parametro
        select += `uf.no_uf as uf,reg.ds_regiao as regiao, uf.co_uf as codigogeo,`;
        from += `${schema}.tb_municipio mun
                      inner join ${schema}.tb_uf uf on uf.co_uf=mun.co_uf
                      inner join ${schema}.tb_regiao reg on reg.co_regiao=uf.co_regiao `;
        groupby += `uf.no_uf,reg.ds_regiao, uf.co_uf,`;
        orderby += `uf.no_uf, reg.ds_regiao,`;
        break;
      case 'MN':
        // Testar o parametro
        select += `uf.no_uf as uf,reg.ds_regiao as regiao, mun.no_municipio as local, mun.co_ibge as codigogeo,`;
        from += `${schema}.tb_municipio mun
                      inner join ${schema}.tb_uf uf on uf.co_uf=mun.co_uf
                      inner join ${schema}.tb_regiao reg on reg.co_regiao=uf.co_regiao `;
        groupby += `uf.no_uf,reg.ds_regiao, mun.no_municipio, mun.co_ibge,`;
        orderby += `uf.no_uf, reg.ds_regiao, mun.no_municipio,`;
        break;
    }

    orderby += `${alias}.${varPeriodicidade},`;
    var arr_control=[];
    (Object.keys(indicadores)).forEach(key=>{
        select += associaAgregacao(indicadores[key]);
        if(!(referencia.granularidade==0 || config.tipo=='BR')){
          //from += ` FULL OUTER JOIN ${key} `;
          //from += ` INNER JOIN ${key} `;
          // granularidade
          switch (referencia.granularidade) {
            case 3: //UF
              //from += `ON ${key}.uf = uf.co_uf `;
              from += associaCampos(indicadores[key], 'uf', 'uf.co_uf', varPeriodicidade, arr_control);
              break;
            case 4: //Municipio
              //from += `ON ${key}.ibge = mun.co_ibge `;
              from += associaCampos(indicadores[key], 'ibge', 'mun.co_ibge', varPeriodicidade, arr_control);
              break;
          }
        }else if(indicadores[key].tipoConsulta!=1){
          //from += associaCampos(indicadores[key], null, null, varPeriodicidade, arr_control);
          if(indicadorAnterior){
            from += `INNER JOIN ${associaCampos(indicadores[key], null, null, varPeriodicidade, arr_control)} `;
            from += `ON ${indicadorAnterior}.${varPeriodicidade}=${key}.${varPeriodicidade} `;
          }else{
            from += associaCampos(indicadores[key], null, null, varPeriodicidade, arr_control);
          }  
        }else{
          from += associaCampos(indicadores[key], null, null, varPeriodicidade, arr_control);
        }
   
        // periodicidade
        if(indicadorAnterior && indicadores[key].tipoConsulta!=1){
          from += `AND ${key}.${varPeriodicidade} = ${indicadorAnterior}.${varPeriodicidade} `
        }

        indicadorAnterior=key;

    });

    // Categoria de CategoriaAnalise
    if('categoria' in referencia && referencia.categoria){
      select += `itemcat.co_seq_categoria_analise_item as itemcategoria, itemcat.ds_titulo as descricaocategoria,`;
      from += ` inner join ${schema}.tb_categoria_analise_item itemcat on ${indicadorAnterior}.codigo_itemcategoria=co_seq_categoria_analise_item `;
      groupby += `itemcat.ds_titulo, itemcat.co_seq_categoria_analise_item,`;
      orderby += `itemcat.co_seq_categoria_analise_item,`;
    }

    // Filtro por uf, ibge, regiao,
    var where = 'where 1=1';
    switch (config.filtro) {
      case 'UF':
        if(config.valores_filtro){
          where = where + ' AND uf.co_uf IN ('+ config.valores_filtro+')';
        }
        break;
      case 'REG':
        if(config.valores_filtro){
          where = where + ' AND mun.co_regiao IN (' + config.valores_filtro+')';
        }
        break;
      case 'MUN':
        if(config.valores_filtro){
          where = where + ' AND mun.co_ibge IN (' + config.valores_filtro+')';
          codigoRegiao = config.valores_filtro;
        }
        break;
      case 'MET':
      case 'CID':
      case 'CCL':
      case 'FRT':
      case 'QUA':
      case 'SA':
      case 'AL':
      case 'RIB':
      case 'QSU':
        if(config.valores_filtro){
          filtro = ' AND agr.co_agrupamento IN (' + config.valores_filtro+')';
        }else{
          filtro = '';
        }
        where = where +  ` AND mun.co_ibge IN ( select co_ibge from ${schema}.tb_municipio_agrupamento mua
          inner join ${schema}.tb_agrupamento agr on mua.co_agrupamento = agr.co_agrupamento
          inner join ${schema}.tb_categoria cat on cat.co_categoria = agr.co_categoria
          where cat.ds_sigla = '${config.filtro}' ${filtro})`
        break;

    }

    if(referencia.criterioAgregacao==0){
      groupby='';
    }

    if(select){
      select = 'select ' + select.substr(0,select.length - 1); // Retira a ultima virgula
    }

    if(orderby){
      orderby = 'order by ' + orderby.substr(0,orderby.length - 1); // Retira a ultima virgula
    }

    if(groupby){
      groupby = 'group by ' + groupby.substr(0,groupby.length - 1); // Retira a ultima virgula
    }

    //console.log(`${select} ${from} ${where} ${groupby} order by ${orderby};`);

    var query = `${select} ${from} ${where} ${groupby} ${orderby}`;

    return query;
}

/**
 * Monta a parte associativa das querys
 */
function associaCampos(indicador, campo, campo_associacao, varPeriodicidade, control){
    var ans = '';
    //let connector = 'INNER JOIN';
    let connector = 'FULL OUTER JOIN';
    if(indicador.tipoConsulta==1){ // Formula
      var key_ant = '';
      for(key in indicador.indicadores){  
        if(control.indexOf(key)==-1){    
            if(campo && campo_associacao){
              ans += `${connector} ${key} `
              ans += `ON ${key}.${campo}=${campo_associacao} `;
              if(key_ant){
                ans += `and ${key_ant}.${varPeriodicidade}=${key}.${varPeriodicidade} `;
              }
            }else{
              if(key_ant){
                ans += `${connector} ${key} `;
                ans += `ON ${key_ant}.${varPeriodicidade}=${key}.${varPeriodicidade} `;
              }else{
                ans += `${key} `
              }       
            }
            control.push(key);
        }
        key_ant=key;

      }
    }else{
      if(control.indexOf(indicador.codigo)>-1) return '';
      if(campo && campo_associacao){
        ans += `${connector} ${indicador.codigo} `
        ans += `ON ${indicador.codigo}.${campo} = ${campo_associacao} `;
      }else{
        ans += `${indicador.codigo} `
      }
      control.push(indicador.codigo);
    }
    return ans;
}

function montaQueryValorIndicador(codigo, indicador, config){
  var sql_select = 'select ';
  var sql_where = `co_seq_indicador=${indicador.id}`;
  var sql_group = 'group by ';
  var nome_campo_periodo = '';

  //console.log('montaQueryValorIndicador', indicador);

  switch (indicador.criterioAgregacao) {
    case 0: // Sem agregacao
      sql_select += ` nu_valor::float  as ${codigo}`;
      break;
    case 1: // Maior valor
      sql_select += ` MAX(nu_valor)::float  as${codigo}`;
      break;
    case 2: // Menor valor
      sql_select += ` MIN(nu_valor)::float  ${codigo}`;
      break;
    case 3: // Media
      sql_select += ` AVG(nu_valor)::float  ${codigo}`;
      break;
    case 4: // Soma
      sql_select += ` SUM(nu_valor)::float  ${codigo}`;
      break;
  }

  if(!(indicador.granularidade==0 || config.tipo=='BR')){
    switch (indicador.granularidade) {
      case 3:  // UF
        sql_select += ', co_uf::int  as uf';
        sql_group += (indicador.criterioAgregacao!=0 ? 'co_uf,':'');
        break;
      case 4:  // Municipio
        sql_select += ', co_ibge::int  as ibge';
        sql_group += (indicador.criterioAgregacao!=0 ? 'co_ibge,':'');
        break;
      case 5:  // CNES
        sql_select += ', co_cnes';
        sql_group += (indicador.criterioAgregacao!=0? 'co_cnes,':'');
        break;
    }
  }

  switch (indicador.periodicidade) {
    case 360:
      sql_select += ', co_ano  as ano';
      nome_campo_periodo='co_ano';
      sql_group += (indicador.criterioAgregacao!=0? 'co_ano,':'');
      break;
    case 30:
      sql_select += ', co_anomes  as anomes';
      nome_campo_periodo='co_anomes';
      sql_group += (indicador.criterioAgregacao!=0? 'co_anomes,':'');
      break;
    case 1:
      sql_select += ', co_anomesdia  as anomesdia';
      nome_campo_periodo='co_anomesdia';
      sql_group += (indicador.criterioAgregacao!=0? 'co_anomesdia,':'');
      break;
    default:
  }

  if(indicador.categoria){
    sql_select += ', co_seq_categoria_analise_item as codigo_itemcategoria';
    sql_where+=` AND co_seq_categoria_analise_item in (${indicador.categoria})`;
    sql_group+='co_seq_categoria_analise_item,';
  }else{
    sql_where+=' AND co_seq_categoria_analise_item is null ';
  }
 
  // Filtro de ano, anomes ou anomesdia
  if(config.data){
    var filtroData = '';
    if(config.data<0)
      filtroData= `select distinct ${nome_campo_periodo} from ${schema}.${config_param.tabela_indicadores} 
        where co_seq_indicador in (${indicador.id}) 
        order by 1 desc limit ${(-1)*config.data}`
        //${Object.keys(indicadores).map(a=>indicadores[a].id).toString()}
    else
      filtroData=`${config.data}`;
    sql_where += `AND ${nome_campo_periodo} in (${filtroData})`;
  }
  
  if(indicador.criterioAgregacao==0){
    sql_group='';
  }else{
    sql_group = sql_group.substr(0,sql_group.length - 1);
  }

  return `${sql_select} from ${schema}.${config_param.tabela_indicadores}
  where ${sql_where} ${sql_group}`;

}


/*
  Funcao para tabular resulado

  Objetivo: Tratar a saída do JSON onde o objeto está com o item detalhado
            em linhas e alinhar a temporalidade como um conjunto interno

  Premissa: Dados organizados em Ano e por municipio
*/
function tabulaResultado(result, indicadores, config){
  //TODO: Tornar dinamica a temporalidade
  var retorno=[];
  var itemTratado = {};
  var field = '';

  console.log('Formatando tabular');
  //TODO: Obedecer o tipo de consulta
  switch (config.tipo) {
    case 'BR':
      field = 'ano';
      break;
    case 'RG':
      field = 'regiao';
      break;
    case 'UF':
      field = 'uf';
      break;
    case 'MN':
      field = 'codigogeo';
      break;
  }
  itemTratado[field] = null;
  result.forEach(item =>{
    if(itemTratado[field]!=item[field]){
      //console.log('Trocando ident', item[field]);
      itemTratado = {};
      retorno.push(itemTratado);
      itemTratado[field] = item[field];
      // Complementa cos campos que não sejam nem ano nem um valor de indicador
      Object.keys(item).forEach(key=>{
        if(key!='ano' && indicadores.indexOf(key.toUpperCase())==-1){
          itemTratado[key] = item[key];
        }
      });
    }
    var obj = {};
    itemTratado['periodo']={};
    indicadores.forEach((key)=>{
      obj[key.toLowerCase()] = +item[key.toLowerCase()];
    });

    itemTratado.periodo[item.ano] = obj;
  });

  return retorno;
}
