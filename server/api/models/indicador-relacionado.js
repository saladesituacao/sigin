'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var IndicadorRelacionado = sequelize.define('IndicadorRelacionado', {
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_indicador_relacionado'
  });

  return IndicadorRelacionado;
};
