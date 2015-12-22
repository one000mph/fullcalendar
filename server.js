/*
 * Author: Heather Seaman
 */

var querystring = require('querystring');
var _ = require('lodash');
var Promise = require('bluebird');

var express = require('express');
var config = require('getconfig');
var bodyParser = require('body-parser');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2client = new OAuth2(config.google.clientId, config.google.clientSecret, 'http://localhost:8000/auth');
var gcal = google.calendar({version:'v3', auth: oauth2client});

var scopes = 'https://www.googleapis.com/auth/calendar';

var authUrl = oauth2client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes
});

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');
app.use(express.static('public'));

var port = process.env.PORT || 8000;

var params = {
	title: 'FullCalendar App',
	authUrl: authUrl,
	loggedin: false,
	calendars: [],
	events: {}
}

app.get('/', function (req, res) {
	if (oauth2client.credentials.access_token) {
		params.loggedin = true;
	}
	console.log(params);
	res.render('index', params);
});

app.get('/auth', function (req, res) {
	var code = querystring.parse(req.url)['/auth?code'];
	oauth2client.getToken(code, function (err, tokens) {
		if (err) {
			throw err;
		} else {
			oauth2client.setCredentials(tokens);
			gcal.calendarList.list({auth: oauth2client}, function (err, calList) {
				if (err) { throw err; }
				var calendarList = calList.items;
				params.calendars = calendarList;
				res.redirect('/')
			});
		}
	});
});

app.post('/calendars/update', function (req, res) {
	var calendarIds = req.body.calendars;
	console.log(calendarIds);
	var id = calendarIds;
	console.log("getting id", id);

	var eventResponse = {}
	gcal.calendarList.get({auth: oauth2client, calendarId: id, fields:'backgroundColor,summary'}, function (err, calData) {
		if (err) { throw err; }

		eventResponse.backgroundColor = calData.backgroundColor;
		eventResponse.summary = calData.summary;
		var now = new Date();
		var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
		gcal.events.list({calendarId: id, timeMin: startOfMonth}, function (err, eventData) {
			if (err) { throw err; }
			eventResponse.events = eventData;
			console.log(eventResponse.events.items);
			params.events = eventResponse;
			res.redirect('/');
		});
	});
});



app.listen(port, function () {
	console.log("App running on http://localhost:" + port);
})
