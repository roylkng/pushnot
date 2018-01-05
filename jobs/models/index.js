var path = require('path'),
    fs = require('fs'),
    files = fs.readdirSync(__dirname);

files.forEach(function(file) {
    // Ignore events folder
    // TODO: Automatically ignore directories
    // For now, we are ignoring files not ending with JS
    if (path.extname(file) !== '.js')
      return;

    var name = path.basename(file, '.js');
    if (name === 'index')
        return;
    if (name === 'BaseModel')
        return;
    if (path.extname(file) === '.swp')
        return;
    if (path.extname(file) === '.orig') // Ignore .orig files create after hg revert
        return;

    var mod = require('./' + name);
    if (mod.model) {
      module.exports[name] = mod;
    } else {
      for (var key in mod) {
        module.exports[key] = mod[key];
      }
    }
});
