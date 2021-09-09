var express = require("express");
var router = express.Router();

const { exec } = require("child_process");
const shell = require('shelljs')

router.get("/", function(req, res, next) {
    req.setTimeout(0) // no timeout
    var processResult = function(stdout) {
        var result = stdout.split("=");
        console.log(result);
    };
    // exec(`cd ../.. && cd Blockchain-Logging-Framework && java -jar target/blf-cmd.jar extract src/main/resources/${req.query.filename}`, (error, stdout, stderr) => {
      exec(`cd ../.. && cd Blockchain-Logging-Framework/src/main/resources && echo '${req.query.query}' > testPipelineExample.bcql && cd ../../.. && java -jar target/blf-cmd.jar extract src/main/resources/testPipelineExample.bcql`, (error, stdout, stderr) => {
      console.log("req: ", req.query.query)
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          // console.log(`stderr: ${stderr}`);
          // res.send(stderr)
          var result = stderr.toString().split('\n');
          // res.send(result)
          // return;
      }
    //   console.log(`stdout: ${stdout}`);
      res.send(stdout)
      return;
    });
    // res.send('run test query success');

    // shell.cd('../../..');
    // shell.cd('testGeth/node1');
    // const { stdout, stderr, code } = shell.exec('sh node1.sh')
    // res.send(stdout);
});
// cd ../.. && cd Blockchain-Logging-Framework && java -jar target/blf-cmd.jar extract src/main/resources/test.bcql
// cd ../.. && cd Blockchain-Logging-Framework && java -jar target/blf-cmd.jar extract src/main/resources/testCryptoKitties.bcql

module.exports = router;
