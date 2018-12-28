'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var TagCategoria = sequelize.define('TagCategoria', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'co_tag_categoria'
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'ds_tag_categoria',
    }
  },{
    classMethods:{
        associate:function(models){
            TagCategoria.hasMany(models.Tag,
              {
                as: 'Tags',
                foreignKey: 'co_tag_categoria'
              }
            );
        }
    },
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_tag_categoria'
  });
  return TagCategoria;
};
