'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var Granularidade = sequelize.define('Granularidade', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_granularidade'
    },
    sigla: {
        type: DataTypes.STRING,
        field: 'ds_sigla',
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        field: 'ds_granularidade',
        allowNull: false
    }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_granularidade'
  });

  return Granularidade;
};
