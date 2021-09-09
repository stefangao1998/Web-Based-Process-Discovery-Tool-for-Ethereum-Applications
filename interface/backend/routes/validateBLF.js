var express = require("express");
var router = express.Router();

const { exec } = require("child_process");
const shell = require('shelljs')

router.get("/", function(req, res, next) {
    var processResult = function(stdout) {
        var result = stdout.split("=");
        console.log(result);
    };
    exec(`cd ../.. && cd Blockchain-Logging-Framework/src/main/resources && echo '${req.query.query}' > testPipelineExample.bcql && cd ../../.. && java -jar target/blf-cmd.jar validate src/main/resources/testPipelineExample.bcql > ./test_output/validation.log && cat ./test_output/validation.log`, (error, stdout, stderr) => {
      console.log("reqq: ", req.query.query)
      var result;
      if (error) {
          console.log(`errorr: ${error.message}`);
        //   return;
      }
      if (stderr) {
          console.log(`stderrr: ${stderr}`);
          // res.send(stderr)
          result = stderr.toString().split('\n');
        //   res.send(result)
        //   return;
      }
      console.log(`stdout: ${stdout}`);
      // res.send(result+stdout)
      if (stdout) {
        res.send(stdout)
      } else {
        res.send('No Error')
      }
      return;
    });
});
module.exports = router;
