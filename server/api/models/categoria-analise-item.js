'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var CategoriaAnaliseItem = sequelize.define('CategoriaAnaliseItem', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'co_seq_categoria_analise_item'
    },
    descricao: {
        type: DataTypes.STRING(255),
        field: 'ds_titulo',
        allowNull: false
    }
  },{
      classMethods:{
        associate:function(models){
            CategoriaAnaliseItem.belongsTo(models.CategoriaAnalise, {
              foreignKey: { field: 'co_categoria_analise', allowNull:false, as: 'CategoriaPai'}
            });
        }
    },
    hierarchy: {
      foreignKey: { field:'co_categoria_analise_item_pai', as: 'CategoriaPai'},
      levelFieldName: 'nu_nivel',
      throughSchema: schema,
      throughTable: 'tb_categoria_analise_item_hierarquia',
      throughForeignKey:'co_categoria_analise_item_pai',
      throughKey: 'co_categoria_analise_item'
    },
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_categoria_analise_item'
  });

  return CategoriaAnaliseItem;
};
