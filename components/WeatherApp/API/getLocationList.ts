import axios from 'axios';

export function getLocationList(locationInput, stateCode, countryCode): void {
  const weatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  axios
    .get<any[]>(`http://api.openweathermap.org/geo/1.0/direct?q=${locationInput},${stateCode},${countryCode}&limit=5&appid=${weatherApiKey}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching location list:', error);
    });
}
