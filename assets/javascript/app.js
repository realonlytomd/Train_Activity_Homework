$(document).ready(function() {
	console.log("hello");

	// Initialize Firebase
  var config = {
    apiKey: "AIzaSyA4CjnWCZCfOismj1Xu4qdMA6JqgQsjWys",
    authDomain: "my-train-sched.firebaseapp.com",
    databaseURL: "https://my-train-sched.firebaseio.com",
    projectId: "my-train-sched",
    storageBucket: "my-train-sched.appspot.com",
    messagingSenderId: "799124966854"
  };
  firebase.initializeApp(config);

//create variables
  var database = firebase.database();

    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";
    var nextArrival = "";
    var minAway = "";   

    // capture the submit button click

	$("#add-train").on("click", function() {
      
      event.preventDefault();

      // Store and retrieve the most recent user inputs.

		trainName = $("#trainName-input").val().trim();
		destination = $("#destination-input").val().trim();
		firstTrainTime = $("#firstTrainTime-input").val().trim();
		frequency = $("#frequency-input").val().trim();
		nextArrival = "23:32";
		minAway = "25";

      //  the "initial load"
		database.ref().set({
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

	// Create Firebase "watcher" 
	database.ref().on("value", function(snapshot) {

      // Print to the console the initial data...
		console.log(snapshot.val());

      // Then the value of the various variables
		console.log(snapshot.val().trainName);
		console.log(snapshot.val().destination);
		console.log(snapshot.val().firstTrainTime);
		console.log(snapshot.val().frequency);
		console.log(snapshot.val().nextArrival);
		console.log(snapshot.val().minAway);
      
		// Need to create the rows in the table...
      // And change the HTML
		var firstRowTds = $("table") // Get a reference to the table 
			.children() // Get all of table's immediate children as an array
			.eq(1) // Get element at the first index of this returned array (the <tbody>)
			.children("tr") // Get an array of all <tr> children inside the returned <tbody>
			.eq(0) // Get the 0th child of this returned array (the first <tr>)
			.children("td"); // Get an array of all <td> children inside the returned <tr>

      // Setting the inner text of each <td> in the firstRowTds array
		firstRowTds.eq(0).text(snapshot.val().trainName);

		firstRowTds.eq(1).text(snapshot.val().destination);

		firstRowTds.eq(2).text(snapshot.val().frequency);

		firstRowTds.eq(3).text(snapshot.val().nextArrival);

		firstRowTds.eq(4).text(snapshot.val().minAway);



		// Create Error Handling
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

});