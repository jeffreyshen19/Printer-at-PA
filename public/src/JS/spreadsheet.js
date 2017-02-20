$(document).ready(function(){
	getGoogleDataForKey("1Iq6Qh9LJXWWYBtWqj4Ng1DO0SpEx22mVghbQxPtiJrA");
});


function getGoogleDataForKey( key ) {
	// set some variables that are going to get sent to Google
	var worksheetId = "default";
	var feedType = "cells"; // "cells" or "list"
	var callbackFunc = "jsonReturned"; // <-- this is the name of the function that gets called when the request comes back from Google

	// assemble the URL from pieces
	var url = "https://spreadsheets.google.com/feeds/" + feedType  + "/" + key + "/" + worksheetId + "/public/values?alt=json-in-script&callback=" + callbackFunc;

	// build a script
	var script = document.createElement('script');
	script.setAttribute('src', url);
	script.setAttribute('id', 'jsonScript');
	script.setAttribute('type', 'text/javascript');

	// attach it to the document...this makes the query to Google execute
	document.documentElement.firstChild.appendChild(script);
}

var jsonReturned = function (jsonData) { // or listDataReturned
  // Print out the raw json
	var i;
	for(i = 0; i < jsonData.feed.entry.length; i++){
		var entry = jsonData.feed.entry[i].content.$t;

		if(entry === "Students Saved") break;
	}

	var saved = jsonData.feed.entry[i + 1].content.$t.split("$")[1];
	$("#amount").text(saved);
};
