// Set up
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var morgan         = require('morgan');						// log request to console
var bodyParser     = require('body-parser');			// pull information from HTML POST
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');		// simulate DELETE & PUT
var passport	   = require('passport');
var session		   = require('express-session');
var flash		   = require('connect-flash');
var appPort        = 7676;
var database       = require('./config/database');

// configuration ============================================

mongoose.connect(database.url);

require('./config/passport')(passport); // pass passport for configuration

//check connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("connection mongodb success");
});

app.use(express.static(__dirname + '/public'));		// set the static files location /public/img will be /img for user
app.use(morgan('dev'));								// log every request to te console
app.use(bodyParser.urlencoded({'extended':'true'}));	//parse application/x-www-form-urlencoded
app.use(bodyParser.json());								// parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));	// parse application/vnd.api+json
app.use(bodyParser());									// get information from html forms
app.use(methodOverride());
app.use(cookieParser());								// read cookies (need for auth)

app.set('view engine', 'ejs');

// Required for passport ======================================
app.use(session({ secret: 'holaholohominahomina123*' }));		// session secret
app.use(passport.initialize());
app.use(passport.session());									// persistent login session
app.use(flash());

// Routes ==================================================
require('./app/routes')(app, passport);

// Listen (start app with node server.js)
app.listen(appPort);
console.log('app listening in port ' + appPort);