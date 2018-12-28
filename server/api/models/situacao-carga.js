'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var SituacaoCarga = sequelize.define('SituacaoCarga', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_situacao_carga'
    },
    descricao: {
        type: DataTypes.STRING(255),
        field: 'ds_situacao_carga',
        allowNull: false
    }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_situacao_carga'
  });

  return SituacaoCarga;
};
