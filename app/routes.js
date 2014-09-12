var Todo = require('./models/todo'); // load model here

module.exports = function(app) {

	
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
	
	// Application frontend ===========================================================
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');		// load the single view file (angular will handle the page changes)
	});	

};