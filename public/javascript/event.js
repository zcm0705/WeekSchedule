/*
@author Jasmine
*/

$("#add-btn").on('click', function(ev) {
	ev.preventDefault();
	var start = $("#start-time").val();
	var end = $("#end-time").val();
	var eName = $("#event-name").val();
	var eDay = $("#event-day").val();
	var eDesc = $("textarea").val();
	var event = new Event(start, end, parseInt(eDay), eName, eDesc);
	placeEvent(event);

	$("textarea").val('');
	$("#start-time").val('');
	$("#end-time").val('');
	$("#event-name").val('');

	//send to mongoDB
	cloud.put("Create " + event.name +" event");
});

function convertTime(time) {
	var arr = time.toString().split(":");
	var hr = parseInt(arr[0]);
	var min = parseInt(arr[1]);
	return (hr * 60 + min) / 60;
}

function placeEvent(event) {
	//create event element
	var eventDiv = $("<div>").text(event.name).appendTo($("body"));
	eventDiv.css({top:event.top(), left: event.left(), height: event.height()});
	eventDiv.addClass("eventDiv");
	
	var open = false;
	eventDiv.on('click', function(ev) {
		if (ev.target != eventDiv.get(0) && ev.target.className != "info") {
		   return;
		}
		if (open) {
			closeEvent(eventDiv, event);
			open = false;
		} else {
			openEvent(eventDiv, event);
			open = true;
		}
	});
}

function Event(start, end, day, name, description) {
	this.startTime = start;
	this.endTime = end;
	this.day = day;
	this.name = name;
	this.description = description;

	this.top = function() {
		return 65 + 40 * (convertTime(this.startTime) - 9);
	};
	this.height = function() {
		return 40 * (convertTime(this.endTime) - convertTime(this.startTime));
	};
	this.left = function() {
		return 140 + (this.day - 1) * 102;
	}
}

var cloud = {
	put: function(log) {
		$.ajax({
			url:"/history",
			method:"PUT",
			data:{operation:log}
		});	
	}
};

function openEvent(evDiv, event) {
	evDiv.css("z-index", 5);
	//enlarge the individual event
	evDiv.animate({
		width:"800px",
		height: "200px",
		top: "100px",
		left: "100px",
	}, 1000, function() {
		//show detailed info
		var info = $("<div>", {class:"info"});
		var start = $("<input>", {placeholder: "Type the start time", type: "text"}).val(event.startTime).appendTo(info);
		var end = $("<input>", {placeholder: "Type the end time", type: "text"}).val(event.endTime).appendTo(info);
		var desc = $("<textarea>", {placeholder: "Description"}).val(event.description).appendTo(info);
		evDiv.append(info);
		start.on("change", function() {
			cloud.put("Change start time from " + event.startTime + " to " + this.value);
			event.startTime = this.value;
		});
		end.on("change", function() {
			cloud.put("Change end time from " + event.endTime + " to " + this.value);
			event.endTime = this.value;
		});
		desc.on("change", function() {
			cloud.put("Change description from " + event.description + " to " + this.value);
			event.description = this.value;
		});

		var del = $("<button class='delBtn'>");
		del.text("Delete");
		evDiv.append(del);
		del.css({left: "700px", top: "10px", position: "absolute", marginBottom: "0px"});
		del.on('click', function () {
			cloud.put("Delete" + event.name +" event");
			evDiv.remove();
		});
		
	});
}

function closeEvent(evDiv, event) {
	evDiv.css("z-index", 1);
	//change back to the normal status

	evDiv.animate({
		width: "102px",
		height: event.height() + "px",
		top: event.top() + "px",
		left: event.left() + "px"
	}, 1000, function() {
		//after the animation, remove button
		$(".delBtn").remove();
		$(".info").remove();
	});
}

//set some default events for testing
var yoga = new Event("10:00", "11:00", 2, "yoga", "yoga refreshes your brain");
placeEvent(yoga);


var GER20B = new Event("9:00", "12:30", 3, "GER 20B: Continuing German", "Provides an overview of the relationship between nature and culture in North America. Covers Native Americans, the European invasion, the development of a market system of resource extraction and etc.");
placeEvent(GER20B);

var SOC147A = new Event("10:30", "13:00", 1, "SOC 147A: Sustainable and Resilient Cities", "Studies innovations in the U.S and around the world that enhance urban sustainability");
placeEvent(SOC147A);
