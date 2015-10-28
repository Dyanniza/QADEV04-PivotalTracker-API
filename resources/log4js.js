var fs = require('fs-extra');

fs.mkdirs('./log', function(err){
  if (err) return console.error(err);
  
  console.log("success!")
});

var log4js = require('log4js');

log4js.configure({
    "appenders":[
    {
      "type": "clustered",
      "appenders": [
        {
          "type": "file",
          "filename": "log/app.log"
        },
        {
          "type": "logLevelFilter",
          "level": "ERROR",
          "appender": {
           	"type": "file",
            "filename": "log/errors.log"
          }
        }
      ]
    }
  ]
});

var log = log4js.getLogger('app');
module.exports=log;