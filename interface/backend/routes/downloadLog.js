var express = require("express");
var router = express.Router();

const { exec } = require("child_process");
const shell = require('shelljs')

router.get("/", function(req, res, next) {
    // 
    res.contentType("text/plain");
    res.sendFile('log_pid0_all.xes', { root: '../../Blockchain-Logging-Framework/test_output' });
    // res.status(200).sendFile('../../Blockchain-Logging-Framework/test_output/log_pid0_all.xes');
});
module.exports = router;
