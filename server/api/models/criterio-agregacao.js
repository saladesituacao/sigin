'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var Criterio_Agregacao = sequelize.define('Criterio_Agregacao', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_criterio_agregacao'
    },
    descricao: {
        type: DataTypes.STRING,
        field: 'ds_criterio_agregacao',
        allowNull: false
    }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_criterio_agregacao'
  });

  return Criterio_Agregacao;
};
