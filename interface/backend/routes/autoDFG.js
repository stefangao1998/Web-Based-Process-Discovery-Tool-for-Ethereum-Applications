var express = require("express");
var router = express.Router();

const { exec } = require("child_process");
const shell = require('shelljs')

router.get("/", function(req, res, next) {
    exec(`cd ../.. && cd Blockchain-Logging-Framework/test_output && cat log_pid0_all.xes`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          // console.log(`stderr: ${stderr}`);
          // res.send(stderr)
          res.send(stderr)
        //   return;
      }
    //   console.log(`stdout: ${stdout}`);
      res.send(stdout)
    });
});
module.exports = router;
