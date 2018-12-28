'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var IndicadorCategoriaAnalise = sequelize.define('IndicadorCategoriaAnalise', {
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_indicador_categoria_analise'
  });

  return IndicadorCategoriaAnalise;
};
