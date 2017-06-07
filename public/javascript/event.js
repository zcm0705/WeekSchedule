/*
@author Jasmine
*/

$("#add-btn").on('click', function(ev) {
	ev.preventDefault();
	var sTime = $("#start-time").val();
	var eTime = $("#end-time").val();
	var eName = $("#event-name").val();
	var eDay = $("#event-day").val();
	var eInfo = $("textarea").val();
	$("textarea").val('');
	$("#start-time").val('');
	$("#end-time").val('');
	$("#event-name").val('');
	
	//json: store data
	var event = {
		startTime: parseInt(sTime),
		endTime: parseInt(eTime),
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

function placeEvent(event) {
	var top = 61 + 40 * (event.startTime - 9);
	var height = 40 * (event.endTime - event.startTime);
	var left = 140 + (event.day - 1) * 102;

	//create event element
	var eventDiv = $("<div>");
	
	eventDiv.text(event.name);
	$("body").append(eventDiv);

	eventDiv.css({top:top, left: left, height: height, position: "absolute", width: 102, backgroundColor: "#0088FF"});

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

		// var editBtn = $("<button class='edit-Btn'>");
		// editBtn.text("Edit");
		// evDiv.append(editBtn);
		// editBtn.css({left: "700px", top: "30px", position: "absolute"});
		// editBtn.on('click', function () {
		// 	$.ajax({
		// 		url:"/history",
		// 		method:"PUT",
		// 		data:{operation:"edit event"}
		// 	});
		// 	//TODO
		// 	//implement edit function
		// });

		//show detailed info
		var info = $("<div class='info'>");
		info.text(event.startTime + " - " + event.endTime + ": " + event.info);
		info.addClass("display-info")
		evDiv.append(info);
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
	});
}

//set some default events for testing
var yoga = {
	startTime: 10,
	endTime: 11,
	day: 2,
	name: "yoga",
	info: "yoga refreshes your brain"
};

placeEvent(yoga);

var GER20B = {
	startTime: 9,
	endTime: 12,
	day: 3,
	name: "GER 20B: Continuing German",
	info: "Provides an overview of the relationship between nature and culture in North America. Covers Native Americans, the European invasion, the development of a market system of resource extraction and etc."
}

placeEvent(GER20B);
