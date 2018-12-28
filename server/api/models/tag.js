'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define('Tag', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'co_tag'
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'ds_tag'
    }
  },{
    classMethods:{
        associate:function(models){
          Tag.belongsTo(models.TagCategoria,
            {
              as: 'Categoria',
              foreignKey: { field: 'co_tag_categoria', allowNull:false}
            });
          Tag.belongsToMany(models.Indicador, {
            as: 'Indicadores',
            through: 'tb_indicador_tag',
            foreignKey: 'co_tag',
            otherKey: 'co_seq_indicador' });
        }
    },
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_tag'
  });
  return Tag;
};
