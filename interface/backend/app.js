var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testAPIRouter = require("./routes/testAPI");
var execBLF = require("./routes/execBLF");
var validateBLF = require("./routes/validateBLF");
var autoDFG = require("./routes/autoDFG")
var downloadLog = require("./routes/downloadLog")
var saveBLF = require("./routes/saveBLF")

var runNode1 = require("./routes/runNode1");
var runNode2 = require("./routes/runNode2");
var runNode3 = require("./routes/runNode3");
var runGanacheCli = require("./routes/runGanacheCli");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/testAPI", testAPIRouter);
app.use("/execBLF", execBLF);
app.use("/validateBLF", validateBLF);
app.use("/autoDFG", autoDFG);
app.use("/downloadLog", downloadLog);
app.use("/saveBLF", saveBLF);

app.use("/runNode1", runNode1);
app.use("/runNode2", runNode2);
app.use("/runNode3", runNode3);
app.use("/runGanacheCli", runGanacheCli);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");

    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
        if (req.method === 'OPTIONS') return res.send(200)
    }
    next()
});


module.exports = app;
