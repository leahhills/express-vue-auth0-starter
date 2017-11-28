require('dotenv').config()
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiInit = require('./api/');
const env = process.env;
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

var app = express();

/* Middleware */

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Session
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'x3napoodoos'
}));

// Passport + Auth0
app.use(passport.initialize());
app.use(passport.session());
passport.use(
	new Auth0Strategy({
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		callbackURL: process.env.AUTH0_CALLBACK_URL
	}, (accessToken, refreshToken, extraParams, profile, done) => {
		return done(null, profile);
	})
);
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', { successRedirect: `http://localhost:${process.env.PORT || 3000}/` }))

// serve dev static files - use nginx for staging/prod
if(process.env.NODE_ENV === 'development') {
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '../client/index.html'));
	});
	app.use(express.static(path.join(__dirname, '../public')));
}

app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'x3napoodoos'
}));

/* Api */

apiInit(app);

/* Error handling */

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
