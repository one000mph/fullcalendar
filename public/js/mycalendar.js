
var clientId = '120869984880-a4vvjsehunqrv81p1ns2v80dp6u5i4mq.apps.googleusercontent.com';;
var apiKey = 'AIzaSyC54MUT8g0TaoIokL6ZcLsAeviQeXG-qBY';
var scopes = 'https://www.googleapis.com/auth/calendar';
var calendarId = 'l8di2bkd7of5a0l657aofkfnec@group.calendar.google.com';

function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
	window.setTimeout(checkAuth, 1);
}

function checkAuth() {
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('auth-button');
	if (authResult && !authResult.error) {
		authorizeButton.style.visibility = 'hidden';
		makeApiCall();
	} else {
		authorizeButton.style.visibility = '';
		authorizeButton.onclick = handleAuthClick;
	}
}

function handleAuthClick(event) {
	gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
	return false;
}

function makeApiCall() {
	gapi.client.load('calendar', 'v3').then(function () {
		var now = new Date();
		var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		var request = gapi.client.calendar.events.list({
			'calendarId': calendarId,
			'timeMin': startOfMonth.toISOString()
		});

		request.then(function (res) {
			var eventsList = [];
			var successArgs;
			var successRes;

			if (res.result.error) {
 				reportError('Google Calendar API: ' + data.error.message, data.error.errors);
			}
			else if (res.result.items) {
				$.each(res.result.items, function (i, entry) {
					var url = entry.htmlLink;

					//timezone support

					eventsList.push({
						id: entry.id,
						title: entry.summary,
						start: entry.start.dateTime || entry.start.date,
						end: entry.end.dateTime || entry.end.date,
						url: url,
						location: entry.location,
						description: entry.description
					});
				});

				successArgs = [eventsList].concat(Array.prototype.slice.call(arguments, 1));
				successRes = $.fullCalendar.applyAll(true, this, successArgs);
				if ($.isArray(successRes)) {
					return successRes;
				}
			}

			if(eventsList.length > 0) {
				addEvents(eventsList);
			}
		}, function (reason) {
			console.log('Error: ' + reason.result.error.message);
		});
	})
}

function addEvents (events) {
	var myCalendar = $('#calendar');
	myCalendar.fullCalendar('addEventSource', events);
}

$(document).ready(function () {
	$('#calendar').fullCalendar({
		header: {
	        left: 'prev,next today',
	        center: 'title',
	        right: 'month,agendaWeek,agendaDay'
	    },
	    editable: true,
	    eventLimit: true,
		googleCalendarApiKey: apiKey,
	    buttonIcons: {
	        prev: 'left-single-arrow',
	        next: 'right-single-arrow'
	    },
	});
});
