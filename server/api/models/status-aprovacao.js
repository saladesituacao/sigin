'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var StatusAprovacao = sequelize.define('StatusAprovacao', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_status'
    },
    descricao: {
        type: DataTypes.STRING(255),
        field: 'ds_status',
        allowNull: false
    }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_status_aprovacao'
  });

  return StatusAprovacao;
};
