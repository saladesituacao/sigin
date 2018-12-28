'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var BancoDados = sequelize.define('BancoDados', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_banco_dados'
    },
    descricao: {
        type: DataTypes.STRING(255),
        field: 'ds_banco_dados',
        allowNull: false
    },
    host:{
        type: DataTypes.STRING(50),
        field: 'ds_host',
        allowNull: true
    },
    usuario:{
        type: DataTypes.STRING(50),
        field: 'ds_usuario',
        allowNull: true
    },
    senha:{
        type: DataTypes.STRING(50),
        field: 'ds_senha',
        allowNull: true
    },
    schema:{
        type: DataTypes.STRING(50),
        field: 'ds_schema',
        allowNull: true
    }
  },{
  classMethods:{
      associate:function(models){
        BancoDados.belongsTo(models.TipoBancoDados,
          {
            as: 'TipoBanco',
            foreignKey: { field: 'co_tipo_banco_dados', allowNull:false}
          });
      }
  },
  schema: schema,
  timestamps: false,
  freezeTableName: true,
  tableName: 'tb_banco_dados'
});

  return BancoDados;
};
