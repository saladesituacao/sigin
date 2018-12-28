const yaml   = require('js-yaml');
const fs   = require('fs');

module.exports = ()=>{
  var filename  = 'api/swagger/swagger.yaml';

  var file = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
  return file;
}
