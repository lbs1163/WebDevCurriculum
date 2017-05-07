var express = require('express'),
	path = require('path'),
	app = express(),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	session = require('express-session');

app.use('/static', express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: 'keyboard cat',
	cookie: { maxAge: 1000 * 10 }
}));

var user_ids = [ 'lbs1163', 'hots', 'csed101' ];
var passwords = [ 'password1', 'password2', 'password3' ];

app.get('/', function (req, res) {
	var user_id = req.session.user_id;

	if (!user_id)
		res.redirect('/login');
	else
		res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/login', function (req, res) {
	var user_id = req.session.user_id;

	if (!user_id)
		res.sendFile(path.join(__dirname, 'client/login.html'));
	else
		res.redirect('/');
});

app.post('/login', function (req, res) {
	var user_id = req.body['user_id'];
	var password = req.body['password'];

	console.log(user_id + " " + password);

	for (var i = 0; i < user_ids.length; i++) {
		if (user_id == user_ids[i] && password == passwords[i])
			break;
	}

	if (i == user_ids.length)
		res.redirect("/login");
	else {
		req.session.user_id = user_id;
		res.redirect("/");
	}
});

app.post('/logout', function (req, res) {
	var user_id = req.session.user_id;

	req.session.destroy(function(err) {
		console.log(user_id + " logged out");
	});

	res.redirect('/login');
});

app.get('/note', function (req, res) {
	var user_id = req.session.user_id;

	if (!user_id)
		res.send("");
	else {
		var id = req.query.id;

		fs.readFile(user_id + "_" + id + '.txt', function(err, data) {
			var d;

			if (err)
				d = "";
			else
				d = data;

			res.send(d);
		});
	}
});

app.post('/note', function (req, res) {
	var user_id = req.session.user_id;

	if (!user_id)
		res.send("");
	else {
		var id = req.query.id;

		fs.writeFile(user_id + '_' + id + '.txt', req.body['data'], "utf8", function(err) {
			var d;

			if (err) d = err;
			else d = user_id + '_' + id + '.txt is saved';
			console.log(d);

			res.send(d);
		});
	}
});

app.get('/test', function(req, res) {
	var sess = req.session;
	if (sess.views) {
		sess.views++;
		res.setHeader('Content-Type', 'text/html');
		res.write('<p>views: ' + sess.views + '</p>');
		res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
		res.end();
	} else {
		sess.views = 1;
		res.end('welcome to the session demo. refresh!');
	}
});

/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */

var server = app.listen(8000, function () {
	console.log('Server started!');
});
