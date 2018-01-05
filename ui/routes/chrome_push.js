'use strict';

/* Routes related to chrome push notifications */

var C = require('../../lib/constants');
var NodeZip = require('node-zip');
var fs = require('fs');
var hogan = require('hogan.js');
var path = require('path');


/* Returns zip for chrome package for a given project id. */
exports.getChromePackage = function(req, res) {

  var projectId = req.query.projectId;
  var writeKey = req.query.writeKey;

  var SOURCE_FOLDER = path.join(__dirname, '../../client/chrome-scripts/');
  var MANIFEST_FILE_NAME = 'connecto_manifest.json';
  var MANIFEST_FILE = SOURCE_FOLDER + MANIFEST_FILE_NAME;
  var SERVICE_WORKER_FILE_NAME = 'connecto_service_worker.js';
  var SERVICE_WORKER_FILE = SOURCE_FOLDER + SERVICE_WORKER_FILE_NAME;
  var README_FILE_NAME = 'README';
  var README_FILE = SOURCE_FOLDER + README_FILE_NAME;

  var zip = new NodeZip();

  fs.readFile(SERVICE_WORKER_FILE, function(err, data) {
    if (err) {
      console.log('Error while reading ' + SERVICE_WORKER_FILE, err);
      res.status(500).send('Internal Error');
      return;
    }

    var protocol = 'https://';
    var loggingEnabled = true;
    if (process.env.NODE_ENV !== 'production') {
      protocol = 'http://';
      loggingEnabled = true;
    }

    var hoganContext = {
      writeKey: writeKey,
      pushUrl: protocol + C.config.pushHostName,
      loggingEnabled: loggingEnabled,
    };

    try {
      var compiledTemplate = hogan.compile(data.toString());
      zip.file(SERVICE_WORKER_FILE_NAME, compiledTemplate.render(hoganContext));
    } catch(hoganErr) {
      console.log('Error while compiling hogan template %s',
        SERVICE_WORKER_FILE, hoganErr);
      res.status(500).send('Internal Error');
      return;
    }

    fs.readFile(MANIFEST_FILE, function(manifestErr, manifestData) {
      if (manifestErr) {
        console.log('Error while reading ' + MANIFEST_FILE, manifestErr);
        res.status(500).send('Internal Error');
        return;
      }
      zip.file(MANIFEST_FILE_NAME, manifestData);


      fs.readFile(README_FILE, function(readmeErr, readmeData) {

        if (readmeErr) {
          console.log('Error while reading ' + README_FILE, readmeErr);
          res.status(500).send('Internal Error');
          return;
        }

        zip.file(README_FILE_NAME, readmeData);
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition',
          'attachment; filename=Connecto-Chrome-Package.zip');
        var data = zip.generate( {type: 'nodebuffer'} );
        res.send(data).end();

      });
    });
  });
};
