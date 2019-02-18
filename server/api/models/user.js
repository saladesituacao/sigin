'use strict';
const config_param = require('../helpers/config')();
const schema = process.env.SCHEMA || config_param.schema;

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    codigo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey: true,
        field: 'co_user'
    },
    login: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'ds_login'
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        field: 'ds_cpf'
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'ds_nome'
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'ds_email'
    },
    ramal: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'ds_ramal'
    },
    celular: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'ds_celular'
    },
    cargo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'ds_cargo'
    },
    data_aprovacao:{
        type: DataTypes.DATE,
        field: 'dt_aprovacao_perfil'
    },
    usuario_aprovacao:{
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'co_user_aprovacao'
    },
    sexo:{
      type: DataTypes.CHAR(1),
      allowNull: false,
      field: 'co_sexo'
    }
  },{
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Perfil,{
            as: 'Perfil',
            foreignKey: {
              field: 'co_perfil',
              allowNull: false,
            }
        });
        User.belongsTo(models.Unidade,{
            as: 'Unidade',
            foreignKey: {
              field: 'co_unidade',
              allowNull: true,
            }
        });
        User.belongsTo(models.StatusAprovacao,{
            as: 'Situacao',
            foreignKey: {
              field: 'co_situacao_perfil',
              allowNull: false,
            }
        });
      }
    },
    schema: schema,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'dt_inclusao',
    updatedAt: 'dt_atualizacao',
    tableName: 'tb_user_mgi'
  });
  return User;
};
