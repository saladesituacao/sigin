'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var CategoriaAnalise = sequelize.define('CategoriaAnalise', {
    codigo: {
        type: DataTypes.STRING(8),
        allowNull: false,
        notEmpty: true,
        primaryKey: true,
        field: 'co_categoria_analise'
    },
    titulo: {
        type: DataTypes.STRING(255),
        field: 'ds_titulo',
        allowNull: false,
        notEmpty: true
    },
    referencia: {
        type: DataTypes.TEXT,
        field: 'ds_referencia',
        allowNull: false
    }
  },{
    classMethods:{
        associate:function(models){
            CategoriaAnalise.hasMany(models.CategoriaAnaliseItem,
              {
                onDelete: 'cascade',
                as: 'Itens',
                foreignKey: 'co_categoria_analise'
              }
            );
        }
    },
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_categoria_analise'
  });

  return CategoriaAnalise;
};
