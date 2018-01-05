var request = require('request');

exports.sendTestMail = function(mailOptions, callback){


  var data = {"name":"Connecto",
              "subject":mailOptions.subject,
              "content":mailOptions.html,
              "email":mailOptions.to,
              "bcc": mailOptions.bcc,
              "requester":"Connecto"
              };
  try{

   var req = request({
          url:'http://172.16.101.8:8080/messaging/api/messages?apiId=15&templateId=47',
          method:'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Authorization' :'Basic Y2FyZGVraG8tYXBpbXNnOmtqQmMwcm1TRm1zT21QYmZkcmNmVVIyWVZvMGRnVg=='
          },
        },
    function (error, response, body) {
      if (error) {
        callback(new Error('Mail Send failed:', error));
        console.error('Mail Send failed:', error);
      }
      req.end();
      callback(null, body);
      console.log('Mail send successful!  Server responded with:', body);
    });
  } catch(e){
      callback(new Error('Mail Send failed:', e));
      console.log(e);
  }
}
  var mailOptions = {
    from: 'Connecto<contact@thoughtfabrics.com>', //sender
    // to: email, //list of receivers
    to:'rajan@connecto.io',
    bcc: 'saurabh@connecto.io',
    subject: 'Connecto - ' + "weekName" +' Summary Report for ' + "website",
    html: "html"
  };

exports.sendTestMail(mailOptions, function(err, info) {
    if(err) {
      console.log(err);
    }
    console.log(info);
  });


// exports.sendTestMails = function(){

//   var data = {"name":"Rajan",
//               "subject":"HII",
//               "content":"<html><body>Hiii this is Divyanshu<a href=\"www.google.com\">Google</a></body></html>",
//               "email":"rajan.k@girnarsoft.com",
//               "requester":"CarDekho"
//               };
  
//  var req = request({
//         url:'http://172.16.101.8:8080/messaging/api/messages?apiId=15&templateId=47',
//         method:'POST',
//         multipart: [{'content-type': 'application/json',
//           'Authorization' :'Basic Y2FyZGVraG8tYXBpbXNnOmtqQmMwcm1TRm1zT21QYmZkcmNmVVIyWVZvMGRnVg==',
//                       'body': JSON.stringify(data)
//                     }],
//       },
//   function (error, response, body) {
//     if (error) {
//       return console.error('upload failed:', error);
//     }
//     console.log('Upload successful!  Server responded with:', body);
//   });

//   // req.on('response', function(res) {
//   //     var chunks = [];
//   //     req.on('response', function(res) {
//   //     var chunks = [];
//   //     }

//   //     res.on('end', function() {
//   //       } else {
//   //         console.log(buffer.toString());
//   //       }
//   //     });
//   //   });
//     req.on('error', function(err) {
//       console.log(err);
//     });

// //The url we want is `www.nodejitsu.com:1337/`
// }

