var Todo = require('./models/todo'); // load model here

module.exports = function(app, passport) {

	
	// Get all todos
	app.get('/api/todos', function(req, res) {

		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {

			// if there is error retrieving, send the error. nothing after res.send()
			if(err)
				res.send(err);

			res.json(todos); // return all todos in json format
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from ajax request from Angular
		Todo.create({
			text: req.body.text,
			done: false
		}, function(err, todo){
			if(err)
				res.send(err);

				// get all todos after creation
				Todo.find(function(err, todos) {

					// if there is error retrieving, send the error. nothing after res.send()
					if(err)
						res.send(err);

					res.json(todos); // return all todos in json format
				});
		});

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {

		Todo.remove({
		
			_id: req.params.todo_id
		
		},function(err, todos) {
			
			if(err)
				res.send(err);

				Todo.find(function(err, todos) {

						// if there is error retrieving, send the error. nothing after res.send()
						if(err)
							res.send(err);

						res.json(todos); // return all todos in json format
				
				});
		});

	});

	// ROute auth user ==================================================================
	
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/user', function(req, res) {
		res.render('index.ejs');		// load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/user/login', function(req, res) {

		// render the page and pass in any flash data if it exist
		res.render('login.ejs', { message: req.flash('loginMessage')});
	});

	// process the login form
	app.post('/user/login', passport.authenticate('local-login', {
		successRedirect: '/user/profile',
		failureRedirect: '/user/login',
		failureFlash: true,
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/user/signup', function(req, res) {

		// render the page and pass in any flash data if t exist
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process signup form
	app.post('/user/signup', passport.authenticate('local-signup', {
		successRedirect: '/user/profile',
		failureRedirect: '/user/signup',
		failureFlash: true,
	}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/user/profile', isLoggedIn, function(req, res) {

		res.render('profile.ejs', {
			user: req.user			// get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/user/logout', function(req, res) {
		req.logout();
		res.redirect('/user');
	});

	// route middleware to make sure user is logged in
	function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, then carry on
		if(req.isAuthenticated())
			return next();

		// if they aren't, redirect to user index
		res.redirect('/user');
	}
	// Application frontend ===========================================================
	// app.get('/', function(req, res) {
	// 	res.sendfile('./public/index.html');		// load the single view file (angular will handle the page changes)
	// });	

};