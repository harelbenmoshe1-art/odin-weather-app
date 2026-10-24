async function getWeatherData(location) {
  const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=`)
  
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return response.json();
}

function processWeatherData(data) {
  return {
    exactLocation: data.resolvedAddress,
    temperature:data.currentConditions.temp,
    conditions: data.currentConditions.conditions,
    localTime: data.currentConditions.datetime.slice(0, 5),  // cut the seconds out
    humidity: data.currentConditions.humidity,
    windSpeed: data.currentConditions.windspeed,
    icon: data.currentConditions.icon  // TODO: check if this property works
  }
}

const weatherForm = document.getElementById('weather-form');
const locationInput = document.getElementById('location-input');

weatherForm.addEventListener('submit', async (event) => {
  event.preventDefault();  // prevents refreshing the page on submit
  
  try {
    const dataDisplayContainer = document.getElementById('weather-data-container');
    const currentWeatherData = processWeatherData(await getWeatherData(locationInput.value));

    let showCelsius = false;
    let showKmh = false;

    dataDisplayContainer.innerHTML = `
      <h1>${currentWeatherData.exactLocation}</h1>
      <p>
        ${currentWeatherData.conditions},
        <span id="temperature-value">${currentWeatherData.temperature}</span>
        <button type="button" id="switch-temp-unit">°F</button>
      </p>
      <p>Local Time: ${currentWeatherData.localTime}</p>
      <p>Humidity: ${currentWeatherData.humidity}%</p>
      <p>
        Wind Speed:
        <span id="wind-speed-value">${currentWeatherData.windSpeed}</span>
        <button type="button" id="switch-windspeed-unit">mph</button>
      </p>
    `;

    const temperatureValue = dataDisplayContainer.querySelector('#temperature-value');
    const tempButton = dataDisplayContainer.querySelector('#switch-temp-unit');

    tempButton.addEventListener('click', () => {
      showCelsius = !showCelsius;

      const temperature = showCelsius
        ? (currentWeatherData.temperature - 32) * 5 / 9
        : currentWeatherData.temperature;

      temperatureValue.textContent = temperature.toFixed(1);
      tempButton.textContent = showCelsius ? '°C' : '°F';
    });

    const windSpeedValue = dataDisplayContainer.querySelector('#wind-speed-value');
    const windButton = dataDisplayContainer.querySelector('#switch-windspeed-unit');

    windButton.addEventListener('click', () => {
      showKmh = !showKmh;

      const windSpeed = showKmh
        ? currentWeatherData.windSpeed * 1.60934
        : currentWeatherData.windSpeed;

      windSpeedValue.textContent = windSpeed.toFixed(1);
      windButton.textContent = showKmh ? 'km/h' : 'mph';
    });
  } catch (error) {
    console.error('Could not get weather data:', error);
  }
});
