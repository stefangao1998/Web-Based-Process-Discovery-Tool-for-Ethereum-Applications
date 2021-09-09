var express = require("express");
var router = express.Router();

const { exec } = require("child_process");
const shell = require('shelljs')

router.get("/", function(req, res, next) {
    exec("cd ../../../.. && cd smart-contract/contracts && ganache-cli -p 8545 -f http://localhost:7545", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
      // console.log("data:", data)
      
    });
    res.send('run ganache cli success');
});
// ganache-cli -p 8545 -f http://localhost:7545
module.exports = router;
