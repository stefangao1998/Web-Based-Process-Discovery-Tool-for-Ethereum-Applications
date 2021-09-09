var express = require("express");
var router = express.Router();

const { exec } = require("child_process");
const shell = require('shelljs')

router.get("/", function(req, res, next) {
    var processResult = function(stdout) {
        var result = stdout.split("=");
        console.log(result);
    };
    exec(`cd ../.. && cd Blockchain-Logging-Framework/src/main/resources && echo '${req.query.query}' > testPipelineExample.bcql`, (error, stdout, stderr) => {
      console.log("reqq: ", req.query.query)
      if (error) {
          console.log(`errorr: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderrr: ${stderr}`);
          // res.send(stderr)
          var result = stderr.toString().split('\n');
          res.send(result)
          return;
      }
      console.log(`stdout: ${stdout}`);
      res.send('Query saved')
      return;
    });
});
module.exports = router;
