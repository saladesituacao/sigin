'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var Programa = sequelize.define('Programa', {
    codigo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'co_programa'
    },
    sigla: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'ds_sigla',
        unique: true
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'ds_programa'
    },
    detalhamento: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'ds_detalhamento'
    },
    programa_pai:{
      type: DataTypes.INTEGER,
      field: 'co_programa_pai',
    }
  },{
    hierarchy: {
      foreignKey: 'co_programa_pai',
      levelFieldName: 'nu_nivel',
      throughSchema: schema,
      throughTable: 'tb_programa_meta_hierarquia',
      throughForeignKey:'co_programa_superior',
      throughKey: 'co_programa'
    },
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_programa_meta'
  });
  return Programa;
};
