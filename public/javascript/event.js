/*
@author Jasmine
*/

$("#add-btn").on('click', function(ev) {
	ev.preventDefault();
	var start = $("#start-time").val();
	var end = $("#end-time").val();
	var eName = $("#event-name").val();
	var eDay = $("#event-day").val();
	var eInfo = $("textarea").val();
	$("textarea").val('');
	$("#start-time").val('');
	$("#end-time").val('');
	$("#event-name").val('');
	
	//json: store data
	var event = {
		startTime: start,
		endTime: end,
		name: eName,
		day: parseInt(eDay),
		info: eInfo
	};
	placeEvent(event);

	//send to mongoDB
	$.ajax({
		url:"/history",
		method:"PUT",
		data:{operation:"add event"}
	});
	
});

function convertTime(time) {
	var arr = time.toString().split(":");
	var hr = parseInt(arr[0]);
	var min = parseInt(arr[1]);
	return (hr * 60 + min) / 60;
}

function placeEvent(event) {
	var top = 65 + 40 * (convertTime(event.startTime) - 9);
	var height = 40 * (convertTime(event.endTime) - convertTime(event.startTime));
	var left = 140 + (event.day - 1) * 102;

	//create event element
	var eventDiv = $("<div>").text(event.name).appendTo($("body"));
	eventDiv.css({top:top, left: left, height: height});
	eventDiv.addClass("eventDiv");
	
	var open = false;
	eventDiv.on('click', function(ev) {
		if (open) {
			closeEvent(ev, top, left, height);
			open = false;
		} else {
			openEvent(ev, event);
			open = true;
		}
	});
}

function openEvent(ev, event) {
	var evDiv = $(ev.target);
	evDiv.css("z-index", 5);
	//enlarge the individual event
	evDiv.animate({
		width:"800px",
		height: "200px",
		top: "100px",
		left: "100px",
	}, 1000, function() {
		//show detailed info
		var info = $("<div class='info'>");
		var $start = $("<div>").text("start time: " + event.startTime).addClass("display-time").appendTo(info);
		var $end = $("<div>").text("end time: " + event.endTime).addClass("display-time").appendTo(info);
		var $desc = $("<div>").text(event.info).addClass("display-info").appendTo(info);
		evDiv.append(info);
		
		//create delete button
		var del = $("<button class='delBtn'>");
		del.text("Delete");
		evDiv.append(del);
		del.css({left: "700px", top: "10px", position: "absolute", marginBottom: "0px"});
		del.on('click', function () {
			$.ajax({
				url:"/history",
				method:"PUT",
				data:{operation:"delete event"}
			});
			evDiv.remove();
		});

		//edit function
		
	});
}

function closeEvent(ev, top, left, height) {
	var evDiv = $(ev.target);
	evDiv.css("z-index", 1);
	//change back to the normal status
	evDiv.animate({
		width: "102px",
		height: height + "px",
		top: top + "px",
		left: left + "px"
	}, 1000, function() {
		//after the animation, remove button
		// $(".edit-Btn").remove();
		$(".delBtn").remove();
		$(".info").remove();
		$(".editBtn").remove();
	});
}

//set some default events for testing
var yoga = {
	startTime: "10:00",
	endTime: "11:00",
	day: 2,
	name: "Yoga",
	info: "yoga refreshes your brain"
};

placeEvent(yoga);

var GER20B = {
	startTime: "9:00",
	endTime: "12:30",
	day: 3,
	name: "GER 20B: Continuing German",
	info: "Provides an overview of the relationship between nature and culture in North America. Covers Native Americans, the European invasion, the development of a market system of resource extraction and etc."
};

placeEvent(GER20B);

var SOC147A = {
	startTime: "10:30",
	endTime: "13:00",
	day: 1,
	name: "SOC 147A: Sustainable and Resilient Cities",
	info: "Studies innovations in the U.S and around the world that enhance urban sustainability"
};

placeEvent(SOC147A);
