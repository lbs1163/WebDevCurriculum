var express = require('express'),
	path = require('path'),
	app = express(),
	fs = require('fs'),
	bodyParser = require('body-parser');

app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/note', function (req, res) {
	var id = req.query.id;

	fs.readFile('note' + id + '.txt', function(err, data) {
		var d;

		if (err)
			d = "";
		else
			d = data;

		res.send(d);
	});
});

app.post('/note', function (req, res) {
	var id = req.query.id;

	fs.writeFile('note' + id + '.txt', req.body['data'], "utf8", function(err) {
		var d;

		if (err) d = err;
		else d = 'note' + id + '.txt is saved';
		console.log(d);

		res.send(d);
	});
});

/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */

var server = app.listen(8000, function () {
	console.log('Server started!');
});
