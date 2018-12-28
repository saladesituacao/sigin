const yaml   = require('js-yaml');
const path = require("path");
const fs   = require('fs');

module.exports = ()=>{
  var filename  = (process.env.NODE_ENV == 'production')?
                    'config/default.production.yaml':'config/default.yaml';

  var doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../..',filename), 'utf8'));
  return doc.config;
}
