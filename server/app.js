require('dotenv').config()
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const thoughtService = require('./service/');
const env = process.env;

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// serve dev static files - use nginx for staging/prod
if(process.env.NODE_ENV === 'development') {
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '../client/index.html'));
	});
	app.use(express.static(path.join(__dirname, '../public')));
}

thoughtService(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500).send();
});

module.exports = app;
