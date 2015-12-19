/*
 * Author: Heather Seaman
 */


var express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'))

app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');
app.use(express.static('public'));

var port = process.env.PORT || 8000;


app.get('/', function (req, res) {
	res.render('index', {title: 'FullCalendar App'})
	// getIds(function (imageIds) {
	// 	var imageCount = imageIds.length;
	// 	// shuffle order before loading
	// 	var randomIds = shuffle(imageIds);
	// 	res.render('index', {title: 'AppSheet Art Gallery', ids: randomIds});
	// });
});


app.listen(port, function () {
	console.log("App running on http://localhost:" + port);
})
