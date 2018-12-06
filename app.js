document.addEventListener("DOMContentLoaded", function(event) {
	
	const url = 'https://beta.gouv.fr/api/v1.6/startups.json'; // Get startups from beta gouv api
	const name = document.getElementById('name'); // Get the startup name element
	const pitch = document.getElementById('pitch'); // Get the startup pitch element
	const timer = document.getElementById('timer'); // Get the timer
	const next = document.getElementById('next'); // Get the next button
	const back = document.getElementById('back'); // Get the back button
	const nextIndicator = document.getElementById('nextIndicator'); // Get the next startup indicator


	/****************
	GENERAL FUNCTIONS
	****************/

	// Shuffle function
	function fixedLengthShuffledArray(arrayLength) {
		function shuffle(sourceArray) {
		    for (var i = 0; i < sourceArray.length - 1; i++) {
		        var j = i + Math.floor(Math.random() * (sourceArray.length - i));
		        var temp = sourceArray[j];
		        sourceArray[j] = sourceArray[i];
		        sourceArray[i] = temp;
		    }
		    return sourceArray;
		}
	   	var randomArray = [];
	    for (var i = 0; i < arrayLength - 1; i++) {
		    randomArray.push(i);
	    }
		return shuffle(randomArray);
	}

	// JSON to array function
	function JsonToArray(json) {
		return Object.keys(json);
	}

	// Change HTML
	function setCurrentStartup(newName, newPitch) {
		name.innerHTML = newName;
		pitch.innerHTML = newPitch;
	}
	function setNextStartup(newName, startupId, startupLength) {
		if (startupLength == -1) {
			nextIndicator.innerHTML = "-";
		} else {
			nextIndicator.innerHTML = startupId + "/" + startupLength + " - prochain : " + newName;
		}
	}
	function changeStartup(startups, startupIdList, currentStartupId) {
		currentStartup = startups[JsonToArray(startups)[startupIdList[currentStartupId]]];
		nextStartup = startups[JsonToArray(startups)[startupIdList[currentStartupId + 1]]];
		setCurrentStartup(currentStartup.attributes.name, currentStartup.attributes.pitch);
		setNextStartup(nextStartup.attributes.name, currentStartupId + 1, startupIdList.length);
	}

   	// Timer functions
	var totalSeconds = 0;
	var timeVar;
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
	function launchClock() {
		totalSeconds = 0;
		timer.innerHTML = '00:00';
		clearInterval(timeVar);
		timeVar = setInterval(runTimer, 1000);
	}

	/**************
	THE STANDUP APP
	**************/

	function getMtesStartups() {

		var startups = {}; // json of all mtes startups
		var currentStartupId = 0; // current startup id displayed
		var currentStartup = {}; // current startup object displayed
		var nextStartup = {}; // next startup object displayed

		fetch(url)
		.then((resp) => resp.json())
		.then(function(data) {
			// Get the MTES startups not in death status
		   	startups = data.data.filter(startup => startup.relationships.incubator.data.id == 'mtes');
		   	startups = startups.filter(startup => startup.attributes.status != 'death');
		   	var startupIdList = fixedLengthShuffledArray(JsonToArray(startups).length);
			// Display the first startup and launch the clock
			changeStartup(startups, startupIdList, currentStartupId);
			launchClock();

		   	// Go to next startup
		   	function goToNextStartup() {
		   		// If second startup show back button
				if (currentStartupId == 0) {
					back.classList.remove('hidden');
				}
		   		// Don't allow going to last startup + 2
		   		if (currentStartupId == startupIdList.length) {
		   			return;
		   		}
		   		// If last startup, then go to sujets transverses
		   		if (currentStartupId == startupIdList.length - 1) {
					++currentStartupId;
		   			name.innerHTML = 'Sujets transverses';
					pitch.innerHTML = 'Sujets ou annonces qui concernent l\'ensemble de la fabrique numérique'
					setNextStartup('', -1, -1);
					next.classList.add('hidden');
		   		}
		   		// If second to last startup, then don't display next startup
		   		else if (currentStartupId == startupIdList.length - 2) {
					++currentStartupId;
					currentStartup = startups[JsonToArray(startups)[startupIdList[currentStartupId]]];
					setCurrentStartup(currentStartup.attributes.name, currentStartup.attributes.pitch);
					setNextStartup('Sujets transverses', currentStartupId + 1, startupIdList.length);
		   		}
		   		// Else change startup and increment counter
		   		else {
					++currentStartupId;
					changeStartup(startups, startupIdList, currentStartupId);
				}
				// Launch the clock
				launchClock();
			};
			next.addEventListener('click', goToNextStartup);

			// Go to previous startup
		   	function goToPreviousStartup() {
		   		// Don't allow going to first startup - 1
		   		if (currentStartupId == 1) {
					back.classList.add('hidden');	
		   		}
		   		// Don't allow going to first startup - 1
		   		if (currentStartupId == 0) {
		   			return;
		   		}
		   		// If last startup display sujets transverses as next
		   		if (currentStartupId == startupIdList.length) {
		   			--currentStartupId;
					currentStartup = startups[JsonToArray(startups)[startupIdList[currentStartupId]]];
					setCurrentStartup(currentStartup.attributes.name, currentStartup.attributes.pitch);
					setNextStartup('Sujets transverses', currentStartupId + 1, startupIdList.length);
					next.classList.remove('hidden');	
		   		}
				// Else change startup
				else {
					--currentStartupId;
					changeStartup(startups, startupIdList, currentStartupId);
				}
				// Launch the clock
				launchClock();
			};
			back.addEventListener('click', goToPreviousStartup);

		})

		// Catch errors in the console
		.catch(function(error) {
		   	console.log(error);
		})

	}

	getMtesStartups();

});