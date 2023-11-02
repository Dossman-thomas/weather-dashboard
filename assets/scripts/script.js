// User Story

// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly

// UNIVERSAL VARIABLES
const geoAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=';
const geoAPI2 = '&limit=1&appid=';
const forecastAPI = 'https://api.openweathermap.org/data/2.5/forecast?'
const apiKey = 'b3ba09bbd6c07cf37bc20efef97e170e';

const submitBtn = $("#submit-btn");
const userInput = $("#city-input")
const curCityEl = $("#city-name");
const curListEl = $("#cur-list");

let cities = [];

getGEO();

// SUBMIT BTN FUNCTION
// submitBtn.on("submit", );

// FETCH WEATHER LOCATION FUNCTION
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

function getGEO(city){
  city = 'fort myers';
  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  
  fetch(geoURL)
  .then(function(response){
      return response.json();
  })
  .then(function(data){
      console.log(data);

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
      console.log(data);
      const temp = data.main.temp;
      const wind = data.wind.speed;
      const humid = data.main.humidity;

      // create elements
      const curTemp = $('<li>');
      const curWind = $('<li>');
      const curHumid = $('<li>');

      // attr/text
      curTemp.text('Temp: ' + temp + "F");
      curWind.text('Windspeed: ' + wind + "mph");
      curHumid.text('Humidity: ' + humid + "%");

      // append
      curListEl.append(curTemp);
      curListEl.append(curWind);
      curListEl.append(curHumid);
  })

}
