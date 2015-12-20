
var clientId = '120869984880-a4vvjsehunqrv81p1ns2v80dp6u5i4mq.apps.googleusercontent.com';;
var apiKey = 'AIzaSyC54MUT8g0TaoIokL6ZcLsAeviQeXG-qBY';


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
		events: {
			googleCalendarId: 'ten000mph@gmail.com',
			className: 'gcal-event'
		},
	    buttonIcons: {
	        prev: 'left-single-arrow',
	        next: 'right-single-arrow'
	    },
	});
});
