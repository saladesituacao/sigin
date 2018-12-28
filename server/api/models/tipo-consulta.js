'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var TipoConsulta = sequelize.define('TipoConsulta', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_tipo_consulta'
    },
    descricao: {
        type: DataTypes.STRING(255),
        field: 'ds_tipo_consulta',
        allowNull: false
    }
  },{
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_tipo_consulta'
  });

  return TipoConsulta;
};
