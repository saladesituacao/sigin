'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize-hierarchy')();

var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
const config_param = require('../helpers/config')();
//var config    = require(__dirname + '/../../config/config.json')[env];

var db        = {};

//if (config.use_env_variable) {
//  var sequelize = new Sequelize(process.env[config.use_env_variable]);
//} else {
  var sequelize = new Sequelize(process.env.DATABASE || config_param.database,
    process.env.USER_DB || config_param.user,
    process.env.PASSWORD_DB || config_param.password, {
    "host": process.env.HOSTDB || config_param.hostdb,
    "dialect": "postgres",
    "omitNull": true,
    "logging": (process.env.DEBUG || config_param.debug)? console.log:false
  });
//}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
