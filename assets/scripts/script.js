// User Story

// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly

// UNIVERSAL VARIABLES

const apiKey = 'b3ba09bbd6c07cf37bc20efef97e170e';

const submitBtn = $("#submit-btn");
const userInput = $("#city-input")
const curCityEl = $("#city-name");
const curListEl = $("#cur-list");

let cities = [];

// SUBMIT BTN FUNCTION

submitBtn.on("submit", function(){


});

getGEO();


// FETCH WEATHER LOCATION FUNCTION
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

function getGEO(city){
  city = 'philadelphia';
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
       console.log(data);
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
      console.log(data);

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

        // create/target elements
        const dateEl = $('h3');
        const dateBox = $('.forecast');

        // attr/text

        // dateEl.text(dates);

        // append


        // Append the weather icon to the day element
        days[i].text(dates[i] + "\r\n");

        // dateEl.text(headings);

        // dateBox.append(dateEl);

        days[i].append("Temp: " + temps[i] + " F" + "\r\n" + "WS: " + winds[i] + " mph" + "\r\n" + "Humidity: " + humidities[i] + "%");

        days[i].append(iconImg);
      
      }
  })
}