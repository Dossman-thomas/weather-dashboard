// User Story

// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly

//-------------------------------------------------

// UNIVERSAL VARIABLES

const apiKey = 'b3ba09bbd6c07cf37bc20efef97e170e';

const submitBtn = $("#submit-btn");
const clearBtn = $("#clear-btn");

const userInput = $("#city-input")
const curCityEl = $("#city-name");
const curListEl = $("#cur-list");
const forecastEl = $(".forecast");
const forecastInfo = $("#forecast-info");
const citiesStorageEl = $("#ls-cities");


let city;
let cities = [];

function clearLocal(){

  localStorage.clear();
  cities = [];
  loadBtns();
}

clearBtn.on("click", clearLocal);

// Retrieve data from local storage
cities = JSON.parse(localStorage.getItem("cities")) || [];

// console.log(cities);
function loadBtns (){

// Check if there is data in local storage
if (cities && cities.length > 0) {
  // Do something with the data, for example, display it in a list

  citiesStorageEl.empty();

  for (const city of cities) {
    // Create and append buttons, or process the data as needed
    const citiesBtns = $('<button>').addClass("saved-cities").text(city);

    citiesStorageEl.append(citiesBtns);

    // Add a click event listener to each button
  citiesBtns.on("click", function () {
    const cityName = $(this).text(); // Get the city name from the button's text

    // console.log(cityName);
    // Fetch and display the weather info for the clicked city
    curCityEl.empty();
    curListEl.empty();
    forecastEl.empty();
    forecastInfo.show();
    getGEO(cityName);

    });
  }
}
}

loadBtns();

// hide 5-day forecast grid on load
forecastInfo.hide();

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// SUBMIT BTN FUNCTION
function handleSubmit(event){

  event.preventDefault();

  // empties weather content w/ new user input
  curCityEl.empty();
  curListEl.empty();
  forecastEl.empty();

  // sets new user input to variable 'city' to be used in fetch functions
  city = userInput.val().trim();
  city = capitalizeFirstLetter(city);

  if (city.trim() === '') {
    // Show an alert if the input is empty
    alert('Enter a city name, please!');
    
    // Makes sure forecast info is hidden
     // empties weather content w/ new user input
    
    forecastInfo.hide();

    return; // Return to exit the function

  } else if (cities.includes(city)) {
    // Check if the city is already in the list
    
    alert('You already entered this city');

    forecastInfo.hide();

  } else {

    forecastInfo.show();

    getGEO(city);

    // add user input to cities array
    cities.push(city);

    // saving past user inputs in local storage
    localStorage.setItem("cities", JSON.stringify(cities));

    console.log(cities); // testing cities array


    // create
    
    citiesBtns = $('<button>').addClass("saved-cities");

    // attr/text
    citiesBtns.text(city);
    
    // append
    
    citiesStorageEl.append(citiesBtns);

    userInput.val('');
    // cities = [];
    loadBtns();
  }
}

// EVENT LISTENER

submitBtn.on("click", handleSubmit);


// FETCH WEATHER LOCATION FUNCTION
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

function getGEO(city){
  // city = 'philadelphia';
  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  
  fetch(geoURL)
  .then(function(response){
      return response.json();
  })
  .then(function(data){
      // console.log(data);

      const cityName = data[0].name;
      const state = data[0].state;
      const lat = data[0].lat;
      const lon = data[0].lon;

      // console.log(lat);
      // console.log(lon);

      //create h2 element
      const curCity = $('<h2>');

      // attr/text
      curCity.addClass("heading current-city");

      curCity.text(cityName + ", " + state);

      // append

      curCityEl.append(curCity);

      getWeather(lat, lon);
      getForecast(lat, lon);
  })
}


// FETCH WEATHER FUNCTION
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={long}&units=imperial&appid={API key}
function getWeather(lat, lon){
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(weatherURL)
  .then(function(response){
      return response.json();
  })
  .then(function(data){
      // console.log(data);

      const temp = data.main.temp;
      const wind = data.wind.speed;
      const humid = data.main.humidity;
      const icon = data.weather[0].icon;

      // create elements
      const curTemp = $('<li>');
      const curWind = $('<li>');
      const curHumid = $('<li>');
      const curIcon = $('<img>');

      // attr/text
      curIcon.attr('src', `http://openweathermap.org/img/wn/${icon}.png`);
      curIcon.attr('id', 'cur-icon');
      curTemp.text('Temp: ' + temp + "F");
      curWind.text('Windspeed: ' + wind + "mph");
      curHumid.text('Humidity: ' + humid + "%");

      // append
      curListEl.append(curIcon);
      curListEl.append(curTemp);
      curListEl.append(curWind);
      curListEl.append(curHumid);
  })
}

// FETCH 5 DAY FORECAST
// api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
function getForecast(lat, lon){
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(forecastURL)
  .then(function(response){
      return response.json();
  })
  .then(function(data){
      // console.log(data);

      const dates = [];
      const temps = [];
      const winds = [];
      const humidities = [];
      const icons = [];
      

      // Loop through the data and extract the required values
      for (let i = 6; i <= 38; i += 8) {
        
        dates.push(data.list[i].dt_txt.substring(0, 10));
        temps.push(data.list[i].main.temp);
        winds.push(data.list[i].wind.speed);
        humidities.push(data.list[i].main.humidity);
        icons.push (data.list[i].weather[0].icon);
      }

      // Initialize an array of day elements
      const days = [
        $('#day-1'),
        $('#day-2'),
        $('#day-3'),
        $('#day-4'),
        $('#day-5')
      ];

      // Use a loop to display the values for each day
      for (let i = 0; i < days.length; i++) {

        const iconCode = icons[i];

        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`; 

        // Create an <img> element for the weather icon and set its src attribute
        const iconImg = $('<img>').attr('src', iconUrl);

        // Create a heading tag for the dates
        const dateEl = $('<h3>').text(dates[i]);

        // Append content to page
        days[i].append(dateEl);
      
        days[i].append("Temp: " + temps[i] + " F" + "\r\n" + "WS: " + winds[i] + " mph" + "\r\n" + "Humidity: " + humidities[i] + "%");

        days[i].append(iconImg);
      
      }
  })
}