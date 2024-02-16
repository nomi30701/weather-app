const API_KEY = '26c08b62f95ab60f0f2c6232f52a1124';
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
    // show_weatherInfo_ToPage(RespData.json());
}

function show_weatherInfo_ToPage(data) {
    const {
        name: cityName,
        weather: [{
            icon: icon_id
        }],
        main: {
            temp: temp,
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
    const current_date_time = new Date(timestamp * 1000); 
    console.log(current_date_time.toUTCString());
    /*
    const Info_city = document.createElement('h1');
    const Info_temp = document.createElement('p');
    Info_city.innerHTML = `
                        ${cityName}
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="15" viewBox="0 0 384 512"><path fill="#ffffff" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
                        `;
    Info_temp.innerHTML = `
                        https://openweathermap.org/img/wn/${icon_id}@2x.png
                        ${(temp - 273.15).toFixed(1)}°C
                        `;
    Info_city.classList.add('Info_city');
    Info_container.appendChild(Info_city);
    Info_container.appendChild(Info_temp);
    */
}

function show_error_ToPage(error) {
    console.log(error)
}
