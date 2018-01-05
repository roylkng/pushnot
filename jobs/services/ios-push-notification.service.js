var apn = require('apn');
var fs = require('fs');
var q = require('q');

// var key = require('/home/rajankadeval/work/repos/connecto/jobs/pushcert.pem');
fs.readFile('/home/rajankadeval/work/repos/connecto/jobs/services/develop_pushcert.pem', function(err, fileInput) {
    if (err) {
      console.log(err);
    } else {
    	var apn = require("apn");
		var token = 'e0237b06f34b4461bb3b9f809322f8728a6b6300110a07464bc01a7e1936390f';
		var service = new apn.connection({
		    pfx: process.env.apnpfx, passphrese: 'gecko'
		});

		service.on("connected", function() {
		    console.log("Connected");
		});

		service.on("error", function(err) {
		    console.log("Standard error", err);
		});

		function pushNotification() {
		    var note = new apn.notification().setAlertText("Hello");

		    service.pushNotification(note, token);
		    service.shutdown();
		}

		pushNotification();
  //     	var certData = fileInput;
		// var keyData = fileInput;
		// console.log(fileInput);

		// var options =		{
		//     // cert: '/home/rajankadeval/work/repos/connecto/jobs/services/develop_pushcert.pem',
		// //     key: fileInput,
		//     pfx : fileInput,
		//     passphrase: 'gecko',                 /* A passphrase for the Key file */
		// //     // ca: null,                         /* String or Buffer of CA data to use for the TLS connection */
		// //     gateway: 'gateway.sandbox.push.apple.com',/* gateway address */
		// //     port: 2195,                       /* gateway port */
		// //     // enhanced: true,                   /* enable enhanced format */
		// //     errorCallback: undefined,         /* Callback when error occurs function(err,notification) */
		// //     cacheLength: 100
		// };

		// var apnConnection = new apn.Connection(options);
		// var myDevice = new apn.Device(token);

		// var note = new apn.Notification();

		// note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		// note.badge = 3;
		// note.sound = "ping.aiff";
		// note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
		// note.payload = {'messageFrom': 'Caroline'};

		// apnConnection.pushNotification(note, myDevice);
  }
});
