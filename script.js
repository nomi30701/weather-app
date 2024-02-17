const API_KEY = '';
const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const Info_container = document.querySelector('.Info_container');

weatherForm.addEventListener('submit', async event => {
    event.preventDefault();
    city_name = cityInput.value;
    if (city_name){
        try{
            weather_data = await get_data(city_name);
            show_weatherInfo_ToPage(weather_data);
        }
        catch (error){
            show_error_ToPage(error);
        }
    }

});

async function get_data(city_name) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}`;
    const RespData = await fetch(API_URL);
    if (!RespData.ok){
        throw new Error('Could not fetch weather data');
    }
    return RespData.json()
}

function show_weatherInfo_ToPage(data) {
    // get data from json
    const {
        name: cityName,
        weather: [{
            icon: icon_id
        }],
        main: {
            temp: current_temp,
            feels_like: temp_feel,
            temp_max: temp_max,
            temp_min: temp_min,
            humidity: humidity
        },
        wind: {
            speed: wind_speed
        },
        sys: {
            sunrise: sunrise_timestamp,
            sunset: sunset_timestamp
        },
        dt: timestamp,
    } = data;
    // calculate time
    const data_date = new Date(timestamp * 1000);
    const current_date = new Date();
    const sunriseDate = new Date(sunrise_timestamp * 1000);
    const sunsetDate = new Date(sunset_timestamp * 1000);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = days[current_date.getDay()];
    const hour = current_date.getHours().toString().padStart(2, '0');
    const minute = current_date.getMinutes().toString().padStart(2, '0');
    
    const sunriseHour = sunriseDate.getHours().toString().padStart(2, '0');
    const sunriseMinute = sunriseDate.getMinutes().toString().padStart(2, '0');
    const sunsetHour = sunsetDate.getHours().toString().padStart(2, '0');
    const sunsetMinute = sunsetDate.getMinutes().toString().padStart(2, '0');

    // clean Info
    Info_container.textContent = '';
    
    // Show Weather Info
    const Info_basic = document.createElement('div');
    const sun_rise_set_time = document.createElement('div');
    const Info_windSpeed_humidity = document.createElement('div');

    Info_basic.innerHTML = `
                        <h1 class="Info_city">
                            ${cityName}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#ffffff" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
                        </h1>
                        <p class="Info_temp">
                            <img src="https://openweathermap.org/img/wn/${icon_id}@2x.png">
                            ${temp_KtoC(current_temp)}°C
                        </p>
                        <p class="Info_temp_min_max">
                            ${temp_KtoC(temp_max)}°C / ${temp_KtoC(temp_min)}°C | feels like ${temp_KtoC(temp_feel)}°C
                        </p>
                        <p class="Info_date_time">
                            ${dayOfWeek}, ${hour}:${minute}
                        </p>
                        `;
    sun_rise_set_time.innerHTML = `
                        <div class="sun_rise">
                            <p>Sun rise</p>
                            <p>${sunriseHour}:${sunriseMinute}</p>
                            <img src="https://openweathermap.org/img/wn/02d@2x.png">
                        </div>
                        <div class="sun_set">
                            <p>Sun set</p>
                            <p>${sunsetHour}:${sunsetMinute}</p>
                            <img src="https://openweathermap.org/img/wn/02n@2x.png">
                        </div>
                        `;
    Info_windSpeed_humidity.innerHTML = `
                        <div class="Info_windSpeed">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.<path fill="#ffffff" d="M288 32c0 17.7 14.3 32 32 32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c53 0 96-43 96-96s-43-96-96-96H320c-17.7 0-32 14.3-32 32zm64 352c0 17.7 14.3 32 32 32h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H384c-17.7 0-32 14.3-32 32zM128 512h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H160c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32z"/></svg>
                            <p>Wind</p>
                            <p>${wind_speed} meter/sec</p>
                        </div>
                        <div class="Info_humidity">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.<path fill="#ffffff" d="M269.5 69.9c11.1-7.9 25.9-7.9 37 0C329 85.4 356.5 96 384 96c26.9 0 55.4-10.8 77.4-26.1l0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 149.7 417 160 384 160c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4C42.8 92.6 61 83.5 75.3 71.6c11.1-9.5 27.3-10.1 39.2-1.7l0 0C136.7 85.2 165.1 96 192 96c27.5 0 55-10.6 77.5-26.1zm37 288C329 373.4 356.5 384 384 384c26.9 0 55.4-10.8 77.4-26.1l0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 437.7 417 448 384 448c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.4 27.3-10.1 39.2-1.7l0 0C136.7 373.2 165.1 384 192 384c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0zm0-144C329 229.4 356.5 240 384 240c26.9 0 55.4-10.8 77.4-26.1l0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 293.7 417 304 384 304c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.5 27.3-10.1 39.2-1.7l0 0C136.7 229.2 165.1 240 192 240c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0z"/></svg>
                            <p>Humidity</p>
                            <p>${humidity}%</p>
                        </div>
                        `;

    Info_basic.classList.add('Info_basic');
    sun_rise_set_time.classList.add('sun_rise_set_time');
    Info_windSpeed_humidity.classList.add('Info_windSpeed_humidity');

    Info_container.appendChild(Info_basic);
    Info_container.appendChild(sun_rise_set_time);
    Info_container.appendChild(Info_windSpeed_humidity);
}

function show_error_ToPage(error) {
    console.log(error)
}
function temp_KtoC(temp) {
    return (temp - 273.15).toFixed(1)
}