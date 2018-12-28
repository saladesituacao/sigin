'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var TipoBancoDados = sequelize.define('TipoBancoDados', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_tipo_banco_dados'
    },
    descricao: {
        type: DataTypes.STRING(255),
        field: 'ds_tipo_banco_dados',
        allowNull: false
    }
  },{
    classMethods:{
        associate:function(models){
            TipoBancoDados.hasMany(models.BancoDados,
              {
                as: 'Bancos',
                foreignKey: 'co_tipo_banco_dados'
              }
            );
        }
    },
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_tipo_banco_dados'
  });

  return TipoBancoDados;
};
