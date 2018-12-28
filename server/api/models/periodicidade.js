'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var Periodicidade = sequelize.define('Periodicidade', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_periodicidade'
    },
    descricao: {
        type: DataTypes.STRING,
        field: 'ds_periodicidade'
      }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_periodicidade',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Periodicidade;
};
