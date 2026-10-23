async function getWeatherData(location) {
  const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=XPNHB4AJFKPUB2HU57AZNL4NU`)
  
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return response.json();
}

function processWeatherData(data) {
  return {
    exactLocation: data.resolvedAddress,
    temperature:data.currentConditions.temp,
    description: data.currentConditions.conditions,
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
    console.log(processWeatherData(await getWeatherData(locationInput.value)));
  } catch (error) {
    console.error('Could not get weather data:', error);
  }
});
