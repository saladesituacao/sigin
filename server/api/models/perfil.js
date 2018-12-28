'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var Perfil = sequelize.define('Perfil', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'co_perfil'
    },
    sigla: {
        type: DataTypes.CHAR(3),
        field: 'ds_sigla',
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(50),
        field: 'ds_titulo',
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING(255),
        field: 'ds_perfil',
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        field: 'st_perfil',
        allowNull: false
    },
    exige_unidade: {
        type: DataTypes.BOOLEAN,
        field: 'st_exige_unidade',
        allowNull: false
    }
  },{
    classMethods:{
        associate:function(models){
          Perfil.belongsTo(models.Aplicacao,
            {
              as: 'Aplicacao',
              foreignKey: { field: 'co_aplicacao', allowNull:false}
            });
    }},
    schema: schema,
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_perfil'
  });

  return Perfil;
};
