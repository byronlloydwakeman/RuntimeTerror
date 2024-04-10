import axios from 'axios';

interface LocationParams {
  locationInput: string;
  stateCode: string;
  countryCode: string;
}

function getLocationList({ locationInput, stateCode, countryCode }: LocationParams): void {
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
