'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var Unidade = sequelize.define('Unidade', {
    codigo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'co_unidade'
    },
    sigla: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'ds_sigla',
        unique: true
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'ds_nome'
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'ds_email'
    },
    telefone: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'ds_telefone'
    },
    competencia: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'ds_competencia'
    },
    atividade: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'ds_atividade'
    },
    isInformal:{
        type: DataTypes.BOOLEAN,
        field: 'st_informal'
    },
    unidade_pai:{
      type: DataTypes.INTEGER,
      field: 'co_unidade_pai',
    }
    //parentId:{
    //    type: DataTypes.INTEGER,
    //    field: 'co_unidade_pai',

    //},
  },{
    classMethods: {
      associate: function(models) {
        Unidade.hasMany(models.Indicador,{
          as: 'IndicadoresRelacionados',
          foreignKey: {field: 'co_unidade',allowNull: false}
        });
      }
    },
    hierarchy: {
      foreignKey: 'unidade_pai',
      levelFieldName: 'nu_nivel',
      throughSchema: schema,
      throughTable: 'tb_unidade_hierarquia',
      throughForeignKey:'co_unidade_superior',
      throughKey: 'co_unidade'
    },
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_unidade'
  });
  return Unidade;
};
