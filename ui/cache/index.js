'use strict';
/*jslint node: true */

var path = require('path');
var fs = require('fs');
var files = fs.readdirSync(__dirname);

files.forEach(function(file) {
    // For now, we are ignoring files not ending with JS
    if (path.extname(file) !== '.js')
      return;

    var name = path.basename(file, '.js');
    if (name === "index" ||
        name === "BaseCache" ||
        path.extname(file) === ".swp" ||
        path.extname(file) === ".orig") {
      return;
    }

    var mod = require('./' + name);
    module.exports[name] = mod;
});
