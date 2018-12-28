const yaml   = require('js-yaml');
const fs   = require('fs');

module.exports = ()=>{
  var doc = yaml.safeLoad(fs.readFileSync('api/swagger/swagger.yaml', 'utf8'));
  return doc;
}
