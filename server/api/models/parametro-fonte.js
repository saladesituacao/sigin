'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ParametroFonte', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'co_fonte'
    },
    sigla: {
        type: DataTypes.STRING,
        field: 'ds_sigla_fonte'
    },
    descricao: {
        type: DataTypes.STRING,
        field: 'ds_fonte'
    }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_indicador_fonte'
  });
};
