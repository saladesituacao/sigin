'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var Indicador = sequelize.define('Indicador', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'co_seq_indicador'
    },
    codigo: {
        type: DataTypes.STRING(8),
        allowNull: false,
        notEmpty: true,
        field: 'co_indicador'
    },
    titulo: {
        type: DataTypes.STRING(200),
        field: 'ds_titulo',
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING(200),
        field: 'ds_descricao',
        allowNull: false
    },
    metodo_calculo:{
        type: DataTypes.TEXT,
        field: 'ds_metodo_calculo'
    },
    referencia_consulta:{
        type: DataTypes.TEXT,
        field: 'ds_referencia_consulta'
    },
    procedimento_operacional:{
        type: DataTypes.TEXT,
        field: 'ds_procedimento_operacional'
    },
    fonte_dados:{
        type: DataTypes.STRING(100),
        field: 'ds_fonte_dados'
    },
    conceituacao:{
        type: DataTypes.TEXT,
        field: 'ds_conceituacao'
    },
    interpretacao:{
        type: DataTypes.TEXT,
        field: 'ds_interpretacao'
    },
    usos:{
        type: DataTypes.TEXT,
        field: 'ds_uso'
    },
    limitacoes:{
        type: DataTypes.TEXT,
        field: 'ds_limitacao'
    },
    notas:{
        type: DataTypes.TEXT,
        field: 'ds_nota'
    },
    observacoes:{
        type: DataTypes.TEXT,
        field: 'ds_observacao'
    },
    ativo:{
        type: DataTypes.BOOLEAN,
        field: 'st_ativo',
        allowNull: false,
        defaultValue: 0
    },
    parametro:{
        type: DataTypes.FLOAT,
        field: 'nu_parametro_referencia',
        allowNull: true
    },
    acumulativo:{
        type: DataTypes.BOOLEAN,
        field: 'st_acumulativo',
        allowNull: false,
        defaultValue: 0
    },
    privado:{
        type: DataTypes.BOOLEAN,
        field: 'st_privado',
        allowNull: false,
        defaultValue: 0
    },
    ultima_atualizacao:{
        type: DataTypes.STRING(8),
        field: 'ds_ultima_atualizacao',
        allowNull: true
    }
  },{
    classMethods: {
      associate: function(models) {
         Indicador.belongsTo(models.Polaridade,{
          as: 'Polaridade',
          foreignKey: {field: 'co_polaridade',allowNull: false}});
          Indicador.belongsTo(models.Unidade,{
              as: 'Unidade',
              foreignKey: {field: 'co_unidade',allowNull: false}
          });
          Indicador.belongsTo(models.ParametroFonte,{
              as: 'ParametroFonte',
              foreignKey: {field: 'co_fonte',allowNull: true}
          });
          Indicador.belongsTo(models.TipoConsulta,{
              as: 'TipoConsulta',
              foreignKey: {field: 'co_tipo_consulta',allowNull: false}
          });
          Indicador.belongsTo(models.BancoDados,{
              as: 'BancoDados',
              foreignKey: {field: 'co_banco_dados',allowNull: true}
          });
         Indicador.belongsTo(models.Periodicidade,{
           as: 'PeriodicidadeAtualizacao',
           foreignKey: {field: 'co_periodicidade_atualizacao',allowNull: false}
           });
        Indicador.belongsTo(models.Periodicidade,{
             as: 'PeriodicidadeAvaliacao',
             foreignKey: {field: 'co_periodicidade_avaliacao',allowNull: false}
             });
        Indicador.belongsTo(models.Periodicidade,{
            as: 'PeriodicidadeMonitoramento',
            foreignKey: {field: 'co_periodicidade_monitoramento',allowNull: false}
            });
        Indicador.belongsTo(models.ClassificacaoIndicador,{
            as: 'ClassificacaoIndicador',
            foreignKey: {field: 'co_indicador_classificacao',allowNull: false}
            });
        Indicador.belongsTo(models.Classificacao6sIndicador,{
            as: 'Classificacao6sIndicador',
            foreignKey: {field: 'co_indicador_classificacao6s',allowNull: false}
            });
        Indicador.belongsTo(models.ClassificacaoMSIndicador,{
            as: 'ClassificacaoMSIndicador',
            foreignKey: {field: 'co_indicador_classificacao_ms',allowNull: false}
            });
        Indicador.belongsTo(models.UnidadeMedida,{
            as: 'UnidadeMedida',
            foreignKey: {field: 'co_unidade_medida',allowNull: false}
            });
       Indicador.belongsTo(models.Granularidade,{
          as: 'Granularidade',
          foreignKey: {field: 'co_granularidade',allowNull: false}
          });
       Indicador.belongsTo(models.Criterio_Agregacao,{
          as: 'CriterioAgregacao',
          foreignKey: {field: 'co_criterio_agregacao',allowNull: false}
          });
        Indicador.belongsToMany(models.Indicador, {
           as: 'IndicadoresRelacionados',
           through: models.IndicadorRelacionado,
           foreignKey: 'co_seq_indicador_pai',
           otherKey: 'co_seq_indicador' });
        Indicador.belongsToMany(models.CategoriaAnalise, {
           as: 'CategoriasAnalise',
           through: models.IndicadorCategoriaAnalise,
           foreignKey: 'co_seq_indicador',
           otherKey: 'co_categoria_analise' });
         Indicador.belongsToMany(models.Tag, {
            as: 'Tags',
            through: 'tb_indicador_tag',
            foreignKey: 'co_seq_indicador',
            onDelete: 'cascade' });
        Indicador.belongsToMany(models.Unidade, {
           as: 'ResponsavelTecnico',
           through: 'tb_indicador_responsavel_tecnico',
           foreignKey: {
              name: 'co_seq_indicador',
              allowNull: false
           },
           otherKey: {
              name: 'co_unidade',
              allowNull: false
           },
           onDelete: 'cascade' });
        Indicador.belongsToMany(models.Unidade, {
           as: 'ResponsavelGerencial',
           through: 'tb_indicador_responsavel_gerencial',
           otherKey: {
             name: 'co_unidade',
             allowNull: false
           },
           foreignKey: {
             name: 'co_seq_indicador',
             allowNull: false
           },
           onDelete: 'cascade' });
      }
    },
    schema: schema,
    timestamps: true,
    createdAt: 'dt_inclusao',
    updatedAt: 'dt_atualizacao',
    freezeTableName: true,
    tableName: 'tb_indicador'
  });

  return Indicador;
};
