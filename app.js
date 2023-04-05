// state
let currCity = "Delhi";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax")
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');



//const API_KEY ='ad488a4e460940ba465485d7132ea890';

















// search
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // prevent default action
    e.preventDefault();
    // change current city
    currCity = search.value;
    // get weather forecast 
    getWeather();
    // clear form
    search.value = ""
})

// units
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if(units !== "metric"){
        // change to metric
        units = "metric"
        // get weather forecast 
        getWeather()
    }
})


function convertTimeStamp(timestamp, timezone){
    const convertTimezone = timezone / 3600; // convert seconds to hours 

   const date = new Date(timestamp * 1000);
   
   const options = {
       weekday: "long",
       day: "numeric",
       month: "long",
       year: "numeric",
       hour: "numeric",
       minute: "numeric",
       timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
       hour12: true,
   }
   return date.toLocaleDateString("en",{weekday:"long",})
  
}


// convert country code to name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country)
}

 // Current weather
function getWeather(){
    const API_KEY = 'ad488a4e460940ba465485d7132ea890';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`)
.then(res => res.json()).then(data => {
    console.log(data)
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`
    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
    weather__forecast.innerHTML = `<p>${data.weather[0].main}`
    weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`
    weather__icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`
    weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`
    weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
    weather__humidity.innerHTML = `${data.main.humidity}%`
    weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph": "m/s"}` 
    weather__pressure.innerHTML = `${data.main.pressure} hPa`


});



fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${currCity}&appid=${API_KEY}&units=${units}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let dailyForecast = "";
      for (let i = 0; i < data.list.length; i++) {
        const forecastData = data.list[i];
        const forecastDate = convertTimeStamp(forecastData.dt, data.city.timezone);
        const forecastTemp = forecastData.main.temp.toFixed();
        const forecastIcon = forecastData.weather[0].icon;
        const forecastDescription = forecastData.weather[0].description;
        dailyForecast += `
          <div class="weather__forecast__day">
            <p>${forecastDate}</p>
            <p><img src="http://openweathermap.org/img/wn/${forecastIcon}.png" /></p>
            <p>${forecastTemp}&#176</p>
            <p>${forecastDescription}</p>
          </div>
        `;
      }
      getWeather.innerHTML = dailyForecast;
    });


}

document.body.addEventListener('load', getWeather())