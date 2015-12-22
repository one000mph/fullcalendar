if ('#{events}')
	console.log(!{JSON.stringify(events)});

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
	    events: events,
	    editable: true,
	    eventLimit: true,
	    buttonIcons: {
	        prev: 'left-single-arrow',
	        next: 'right-single-arrow'
	    },
	});
});
