var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var bsConfigDir = './bs-configs/';

const backstop = require("backstopjs");

var indexRouter = require("./routes/index");
var backstopRouter = require("./routes/bsj");

var processStateRoute = require('./routes/process-state');

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

app.use('/reports', express.static(path.join(__dirname, 'backstop_data/html_report')))
app.use('/bitmaps_test', express.static(path.join(__dirname, 'backstop_data/bitmaps_test')))
app.use('/bitmaps_reference', express.static(path.join(__dirname, 'backstop_data/bitmaps_reference')))

app.use("/", indexRouter);
app.use("/bsj", backstopRouter);
app.use('/handle-state', processStateRoute);

app.get('/reports/:website', function(req, res) {
  res.sendFile(path.join(__dirname + '/reports/' + req.params.website +'/index.html'));
});

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
});

module.exports = app;
