'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var TipoArquivo = sequelize.define('TipoArquivo', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_tipo_arquivo'
    },
    descricao: {
        type: DataTypes.STRING(255),
        field: 'ds_tipo_arquivo',
        allowNull: false
    },
    mime: {
        type: DataTypes.STRING(255),
        field: 'ds_mime_type',
        allowNull: false
    }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_tipo_arquivo'
  });

  return TipoArquivo;
};
