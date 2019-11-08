//start by getting an ajax call back from the weather api
//get location value input from the search bar for the api to target
//have weather api react with the location
// have it display the location's weather information
//save what what city was searched for in local storage
//display a 5 day forecast from the api call
//format the program layout

let time, hh, mm;
let timer = "";
let backdropTimer = "";
let clockDisplay = $("#clockDisplay");
let dateDisplay = $("#dateDisplay");
function startClock() {
	timer = setTimeout(updateClockDisplay, 500); //start clock
	setBackdrop(); //set backdrop on page load
	backdropTimer = setTimeout(setBackdrop, 360000); //set interval to check for the right backdrop every hour
}
function getTime() {
	time = new Date();

	hh = time.getHours();
	mm = time.getMinutes();

	displayCurrentDate(time); //update current date display

	return (hh < 10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm);
}

/*
 * Get current date and update display
 * format: MM, dd YYYY
 */
function displayCurrentDate(date) {
	dateDisplay.text(
		months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
	);
}
//basic search format that will call upon the forecast and current weather
$(".search").on("click", function() {
	let locationInput = $(".input")
		.val()
		.trim();
	let API = "dcc63d9789db8e15c208f0a005e7a762";

	let queryURL =
		"https://api.opencagedata.com/geocode/v1/json?q=" +
		locationInput +
		"&key=f0850a731b144cb69211841cba0efbb2";

	let weatherURL =
		"http://api.openweathermap.org/data/2.5/weather?q=" +
		locationInput +
		"&units=imperial&APPID=" +
		API;
	let forecastURL =
		"https://api.openweathermap.org/data/2.5/forecast?q=" +
		locationInput +
		"&units=imperial" +
		"&cnt=5" +
		"&APPID=" +
		API;
	//api call to change text to lon lat
	$.ajax({
		url: queryURL,
		method: "get",
		success: function(response) {
			let lat = response.results[0].geometry.lat;
			let lon = response.results[0].geometry.lng;
			let uvIndex =
				"http://api.openweathermap.org/data/2.5/uvi?appid=" +
				API +
				"&lat=" +
				lat +
				"&lon=" +
				lon;
			console.log(response);
			$.ajax({
				url: uvIndex,
				method: "get"
			}).then(function(uv) {
				$(".uvIndex").append(uv);
				console.log(uv);
			});
			console.log(lat);
			console.log(lon);
		}
	});

	//api call for weather
	$.ajax({
		url: weatherURL,
		method: "get"
	}).then(function(response) {
		console.log(response);
		let temp = "temperature: " + response.main.temp;
		let humid = "Humidity: " + response.main.humidity;
		let windSpeed = "Wind Speed: " + response.wind.speed;
		// let uvIndex = response.wind. UVI requires lon lat which requires another api, ask the TAS
		$(".weatherDisplay").append(locationInput);
		$(".temperature").append(temp);
		$(".humidity").append(humid);
		$(".windSpeed").append(windSpeed);
		// $(".uvIndex").append(uvIndex);
		console.log(temp);
		console.log(humid);
		console.log(windSpeed);
	});
	// api call for the 5 day forecast
	$.ajax({
		url: forecastURL,
		method: "get"
	}).then(function(response) {
		console.log(response);
		for (let i = 0; i < response.list.length; i++) {
			let icon = response.list[i].weather[0].icon;
			let weatherIcon = "http://openweathermap.org/img/w/" + icon + ".png";
			let temperature = "Temperature: " + response.list[i].main.temp;
			let humidity = "Humidity: " + response.list[i].main.humidity;
			let windSpeed = "Wind Speed: " + response.list[i].wind.speed;
			let card = $("<div>").html(`<div class="card" style="width: 18rem;">
        <img src="${weatherIcon}" class="card-img-top" alt="...">
        <div class="card-body">
		  <p class="card-text">${temperature}
		  ${humidity}
		  ${windSpeed}
		  ${weatherIcon}
		  </div>
	  </div>`);
			console.log(weatherIcon);
			let cardContainer = $(".forecastContainer");
			// console.log(card);
			cardContainer.append(card);
		}
	});
	// let key = locationInput.value;
	// let loc = $(locationInput);
	// localStorage.setItem(key, loc);
	// localStorage.getItem(key, task);
	$(".searchParameters").append(locationInput);
});
