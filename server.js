/*
 * Author: Heather Seaman
 * This file serves a single-page calendar integration with FullCalendar
 * The core functionality retrieves a user's calendar from the Google Calendar
 * API and allows a user to display their calendars with FullCalendar.
 * 
 * Limitations: Currently only allows one calendar to be displayed at a time.
 *
 */

// ***** REQUIRED NPM MODULES ***** //
var querystring = require('querystring');
var express = require('express');
var config = require('getconfig');
var bodyParser = require('body-parser');
// ***** OAuth & Google  API ** //
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2client = new OAuth2(config.google.clientId, config.google.clientSecret, 'http://localhost:8000/auth');
var gcal = google.calendar({version:'v3', auth: oauth2client});
var scopes = 'https://www.googleapis.com/auth/calendar';

// Get authentication url
var authUrl = oauth2client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes
});

// Express App Setup
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');
app.use(express.static('public'));
var port = process.env.PORT || 8000;

// Params to be passed to the client for rendering
var params = {
	title: 'FullCalendar App',
	authUrl: authUrl,
	loggedin: false,
	calendars: [],
	events: {}
}

// Index Page
app.get('/', function (req, res) {
	if (oauth2client.credentials.access_token) {
		params.loggedin = true;
	}
	res.render('index', params);
});

// Oauth Redirect
app.get('/auth', function (req, res) {
	// finish authentication & set credentials
	var code = querystring.parse(req.url)['/auth?code'];
	oauth2client.getToken(code, function (err, tokens) {
		if (err) {
			throw err;
		} else {
			oauth2client.setCredentials(tokens);

			// get all user's calendars
			gcal.calendarList.list({auth: oauth2client}, function (err, calList) {
				if (err) { throw err; }
				var calendarList = calList.items;
				params.calendars = calendarList;
				res.redirect('/')
			});
		}
	});
});

// Make API Call to fetch Calendar Data based on form input
app.post('/calendars/update', function (req, res) {
	var calendarIds = req.body.calendars;
	var id = calendarIds;

	// retrieve calendar color and summry (name)
	gcal.calendarList.get({auth: oauth2client, calendarId: id, fields:'backgroundColor,summary'}, function (err, calData) {
		if (err) { throw err; }
		params.backgroundColor = calData.backgroundColor;
		params.summary = calData.summary;
		// For privacy, we restrict to this month's calendar data this could be changed later
		var now = new Date();
		var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

		// retrieve list of events
		gcal.events.list({calendarId: id, timeMin: startOfMonth}, function (err, eventData) {
			if (err) { throw err; }
			params.events = eventData;
			res.redirect('/');
		});
	});
});

// Server listens on port specified by process.env or else 8000 by default
app.listen(port, function () {
	console.log("App running on http://localhost:" + port);
});
