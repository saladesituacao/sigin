'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var BancoDados = sequelize.define('Aplicacao', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'co_aplicacao'
    },
    descricao: {
        type: DataTypes.STRING(255),
        field: 'ds_aplicacao',
        allowNull: false
    }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_aplicacao'
  });

  return BancoDados;
};
