'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var Polaridade = sequelize.define('Polaridade', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_polaridade'
    },
    descricao: {
        type: DataTypes.STRING(50),
        field: 'ds_polaridade',
        allowNull: false
    }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_polaridade'
  });

  return Polaridade;
};
