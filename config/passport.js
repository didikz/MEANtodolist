// Load all things we need
var LocalStrategy = require('passport-local').Strategy;

// load user's model
var Users = require('../app/models/users');

// expose this function to our app
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
    	done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
    	Users.findById(id, function(err, user) {
    		done(err, user);
    	})
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use('local-signup', new LocalStrategy({

		// by default, local strategy uses username and password, we will override with email
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true, 			// allow us to pass back the entire request to the callback
	},
	function(req, email, password, done) {

		// async
		// User.findOne wont fire unless data is sent back
		process.nextTick(function() {

			// find a user whose email is the same from email form
			// we are checking to see if the user trying to login already exist
			Users.findOne({ 'local.email': email }, function(err, user) {

				// if there any errors, return the error
				if(err)
					return done(err);

				// check to see if theres already a user with that email
				if(user) {
					return done(null, false, req.flash('signupMessage','That email is already taken'));
				} else {

					// create user
					var newUser = new Users();

					// set the user's local credentials
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					// save the user
					newUser.save(function(err) {
						if(err)
							throw err;

						return done(null, newUser);
					});
				}
			})
		})
	}));

	// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use('local-login', new LocalStrategy({

		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	},
	function(req, email, password, done) {

		Users.findOne( {'local.email': email }, function(err, user) {
			if(err)
				return done(err);

			if(!user)
				return done(null, false, req.flash('loginMessage', 'No user found'));

			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Wrong password'));
			
			return done(null, user);
		});
	}));
};
