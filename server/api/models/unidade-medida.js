'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var UnidadeMedida = sequelize.define('UnidadeMedida', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'co_unidade_medida'
    },
    descricao: {
        type: DataTypes.STRING,
        field: 'ds_unidade_medida',
        notEmpty: true,
        allowNull: false
      }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_unidade_medida'
  });
  return UnidadeMedida;
};
