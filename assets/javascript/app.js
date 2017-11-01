$(document).ready(function() {
	console.log("hello");

	// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDS0tXo7I9gMlvH2QRDb9JNe9dcxDfkCkY",
    authDomain: "new-train-schedule-homework.firebaseapp.com",
    databaseURL: "https://new-train-schedule-homework.firebaseio.com",
    projectId: "new-train-schedule-homework",
    storageBucket: "new-train-schedule-homework.appspot.com",
    messagingSenderId: "883959661798"
  };
  firebase.initializeApp(config);

//create variables
  var database = firebase.database();

    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";
    var nextArrival = "";
    var minAway = 0;   

    // capture the submit button click

	$("#add-train").on("click", function() {
      
      event.preventDefault();

      // Store and retrieve the most recent user inputs.

		trainName = $("#trainName-input").val().trim();
		destination = $("#destination-input").val().trim();
		firstTrainTime = $("#firstTrainTime-input").val().trim();
		frequency = $("#frequency-input").val().trim();

		console.log(trainName);
		console.log(destination);
		console.log(firstTrainTime);
		console.log(frequency);
		
		//perform "math" to calculate nextArrival and minAway

		// convert the firstTrainTime from the input string into machine using moment.js
		// capital HH is used for military time
		var firstTrainTimeConvert = moment(firstTrainTime, "HH:mm");
		console.log("firstTrainTimeConvert = " + firstTrainTimeConvert);

		//get the current time - right now! ... and convert and log it in both
		// machine and HH:mm (military)
		var timeRightNow = moment();
		console.log("Current time in machine: " + timeRightNow);
		console.log("Current time: " + moment(timeRightNow).format("HH:mm"));

		//Now get the difference between these two times in minutes
		var differenceInTime = moment().diff(moment(firstTrainTimeConvert), "minutes");

		console.log("Difference between first arrival and now in minutes: " + differenceInTime);

		// if difference is a negative number, i.e.
		// the first arrival is after right now, then
		// don't do the following, the difference is simply the minutes away
		// and the next arrival time is the first arrival time.

		if (differenceInTime >= 0) {


		// use modulus; take the remainder of (the difference in time (1st train to now)
		// divided by the frequency of train arrivals), then 
		// subtract that from the freqency gives
		// how many minutes to the next train.  really cool.
		var mathRemainder = differenceInTime % frequency;
		console.log(mathRemainder + " remainder after modulus");
		
		var minAway = frequency - mathRemainder;
		console.log("Minutes until next train arrival: " + minAway);

    	//  then, add those minutes to right now, and get the time of next arrival
    	var nextArrivalMinutes = moment().add(minAway, "minutes");
    	// and convert format to hours and minutes string to display in table
    	var nextArrival = moment(nextArrivalMinutes).format("HH:mm");
		console.log("Arrival time of next train: " + nextArrival);

		}

		else {

			// again, if the train's 1st arrival is AFTER right now, then this...
			minAway = Math.abs(differenceInTime);
			nextArrival = firstTrainTime;
			console.log(minAway);
			console.log(nextArrival);
		}
		

      //  the "initial load"
		database.ref().push({
		trainName: trainName,
 		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency,
		nextArrival: nextArrival,
		minAway: minAway      
      });

		//empty out the input fields after submission

		$("#trainName-input").val("");
		$("#destination-input").val("");
		$("#firstTrainTime-input").val("");
		$("#frequency-input").val("");


	});

	// Create Firebase "watcher". Responds when a new input has been made (child)
	database.ref().on("child_added", function(snapshot) {

	//      Print to the console the initial data...
		// console.log(snapshot.val());

	//      Then the value of the various variables
		// console.log(snapshot.val().trainName);
		// console.log(snapshot.val().destination);
		// console.log(snapshot.val().firstTrainTime);
		// console.log(snapshot.val().frequency);
		// console.log(snapshot.val().nextArrival);
		// console.log(snapshot.val().minAway);

		// make a tr variable for the new row to be put in the tbody

		var newRow = $("<tr>");

		// then make a variable for each new column value, the td's

		var firstTd = $("<td>").text(snapshot.val().trainName);
		var secondTd = $("<td>").text(snapshot.val().destination);
		var thirdTd = $("<td>").text(snapshot.val().frequency);
		var fourthTd = $("<td>").text(snapshot.val().nextArrival);
		var fifthTd = $("<td>").text(snapshot.val().minAway);

		// console.log(firstTd);
		// console.log(secondTd);
		// console.log(thirdTd);
		// console.log(fourthTd);
		// console.log(fifthTd);

		// use .append, to put the column values together in the row

		newRow.append(firstTd);
		newRow.append(secondTd);
		newRow.append(thirdTd);
		newRow.append(fourthTd);
		newRow.append(fifthTd);

		//then, use .append again, so it doesn't overwrite the last row.

		$("#tbody-new-row").append(newRow);
	

		// Create Error Handling
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

});