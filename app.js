document.addEventListener("DOMContentLoaded", function(event) {
	
	const url = 'https://beta.gouv.fr/api/v1.6/startups.json'; // Get startups from beta gouv api
	const name = document.getElementById('name'); // Get the element where we will place our startups
	const pitch = document.getElementById('pitch'); // Get the element where we will place our startups
	const timer = document.getElementById('timer'); // Get the timer
	const next = document.getElementById('next'); // Get the next button
	const back = document.getElementById('back'); // Get the next button
	var startups = {};
	var currentStartupId = 0;
	var currentStartup = {};
	var totalSeconds = 0;
	var timeVar

	// Shuffle function
	function shuffle(sourceArray) {
	    for (var i = 0; i < sourceArray.length - 1; i++) {
	        var j = i + Math.floor(Math.random() * (sourceArray.length - i));
	        var temp = sourceArray[j];
	        sourceArray[j] = sourceArray[i];
	        sourceArray[i] = temp;
	    }
	    return sourceArray;
	}
	function fixedLengthShuffledArray(arrayLength) {
	   	var randomArray = [];
	    for (var i = 0; i < arrayLength - 1; i++) {
		    randomArray.push(i);
	    }
		return shuffle(randomArray);
	}

   	// Timer functions
	function prefixZero(num) {
		if (num < 10) {
			return "0" + num;
		} else {
			return num;
		}
	}
   	function runTimer() {
		++totalSeconds;
		var minute = Math.floor(totalSeconds/60);
		var second = totalSeconds - minute*60;
		minute = prefixZero(minute);
		second = prefixZero(second);	
		timer.innerHTML = minute + ":" + second;
	}

	// The standup app
	function getMtesStartups() {

		fetch(url)
		.then((resp) => resp.json()) // Transform the data into json
		.then(function(data) {
			// Get the MTES startups
		   	startups = data.data.filter(startup => startup.relationships.incubator.data.id == 'mtes');
		   	var startupIdList = fixedLengthShuffledArray(Object.keys(startups).length);
			// Display the first startup and launch the clock
			currentStartup = startups[Object.keys(startups)[startupIdList[currentStartupId]]];
		   	name.innerHTML = currentStartup.attributes.name;
		   	pitch.innerHTML = currentStartup.attributes.pitch;
			timer.innerHTML = '00:00';
			timeVar = setInterval(runTimer, 1000);
		   	//console.log(startups);

		   	// Go to next startup
		   	function goToNextStartup() {
		   		// Don't allow going to last startup + 2
		   		if (currentStartupId == startupIdList.length) {
		   			return;
		   		}
		   		// Increment startup counter
		   		// If last startup, then go to sujets transverses
		   		if (currentStartupId == startupIdList.length - 1) {
					++currentStartupId;
		   			name.innerHTML = 'Sujets transverses';
					pitch.innerHTML = 'Sujets ou annonces qui concernent l\'ensemble de la fabrique numérique'
		   		} else {
					// Change startup
					++currentStartupId;
					currentStartup = startups[Object.keys(startups)[startupIdList[currentStartupId]]];
					// Display new startup
					var currentStartupIdDisplayed = currentStartupId + 1
					name.innerHTML = currentStartup.attributes.name;
					pitch.innerHTML = currentStartup.attributes.pitch;
				}
				// Launch the clock
				totalSeconds = 0;
				timer.innerHTML = '00:00';
				clearInterval(timeVar);
				timeVar = setInterval(runTimer, 1000);
			};
			next.addEventListener('click', goToNextStartup);

			// Go to previous startup
		   	function goToPreviousStartup() {
		   		// Don't allow going to first startup - 1
		   		if (currentStartupId == 0) {
		   			return;
		   		}
				// Change startup
				--currentStartupId;
				currentStartup = startups[Object.keys(startups)[startupIdList[currentStartupId]]];
				// Display new startup
				name.innerHTML = currentStartup.attributes.name;
				pitch.innerHTML = currentStartup.attributes.pitch;
				// Launch the clock
				totalSeconds = 0;
				timer.innerHTML = '00:00';
				clearInterval(timeVar);
				timeVar = setInterval(runTimer, 1000);
			};
			back.addEventListener('click', goToPreviousStartup);

		})
		.catch(function(error) {
		   	// If there is any error you will catch them here
		   	console.log(error);
		})

	}

	getMtesStartups();

});