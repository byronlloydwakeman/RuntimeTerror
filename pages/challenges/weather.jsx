'use client';

import React, { useEffect, useState } from 'react';
import styles from './weather.module.scss';
import Navbar from '../../components/Navbars/Navbar';
import NavbarBottom from '../../components/Navbars/NavbarBottom';
import axios from 'axios';
import { GoogleMap } from '../../components/WeatherApp/GoogleMap';
import { LineChart } from '@mui/x-charts/LineChart';
import { WeatherGraph } from '../../components/WeatherApp/WeatherGraph';

export default function Weather() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locationInput, setLocationInput] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [listOpen, setListOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherCode, setWeatherCode] = useState(null);
  const weatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  useEffect(() => {
    if (navigator.share) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
  }, []);

  const successCallback = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  };

  const errorCallback = (error) => {
    console.log(error);
  };

  // Current day and five-day forecast weather data
  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`
      )
      .then((response) => {
        setWeatherData(response.data);
        setWeatherCode(response.data.weather[0].id);
      });
  }, [latitude, longitude, weatherApiKey]);

  const handleChange = (e) => {
    setLocationInput(e.target.value);
    setListOpen(true);
  };

  let countryCode = '';
  let stateCode = '';

  useEffect(() => {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput},${stateCode},${countryCode}&limit=5&appid=${weatherApiKey}`
      )
      .then((response) => {
        setLocationList(response.data);
      });
  }, [locationInput, stateCode, countryCode]);

  const handleListSelection = (e, location) => {
    console.log(location);
    setLocationInput(`${location.name}, ${location.country}`);
    setLatitude(location.lat);
    setLongitude(location.lon);
    setListOpen(false);
  };

  return (
    <div>
      <div className={styles.container}>
        <Navbar />
        <form className={styles.input_form}>
          <input
            className={styles.form_text_field}
            type="text"
            value={locationInput}
            onChange={handleChange}
          />
          {listOpen &&
            locationList.map((location, index) => (
              <div
                className={styles.location_list_item}
                key={index}
                onClick={(e) => {
                  handleListSelection(e, location);
                }}
              >
                <p>
                  {location.name}, {location.country}
                </p>
              </div>
            ))}
        </form>
        {weatherData && (
          <div>
            <p>Temp: {weatherData?.main?.temp}°C</p>
            <p>Humidity: {weatherData?.main?.humidity}</p>
            <p>Wind speed: {weatherData?.wind?.speed} m/s</p>
            <p>Precipitation: {weatherData?.wind?.speed}</p>
            <p>Weather State: {weatherData?.weather[0]?.main}</p>
            <p>Weather Description: {weatherData?.weather[0]?.description}</p>
            <p>
              Weather Icon:{' '}
              <img
                src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}.png`}
              />
            </p>
          </div>
        )}
        <WeatherGraph latitude={latitude} longitude={longitude} />

        <GoogleMap latitude={latitude} longitude={longitude} />
      </div>
      <NavbarBottom />
    </div>
  );
}
