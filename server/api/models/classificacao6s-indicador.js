'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Classificacao6sIndicador', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_indicador_classificacao'
    },
    descricao: {
        type: DataTypes.STRING,
        field: 'ds_indicador_classificacao'
      }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_indicador_classificacao6s'
  });
};
