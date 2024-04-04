'use client';

import React, { useEffect, useState } from 'react';
import styles from './weather.module.scss';
import Navbar from '../../components/Navbars/Navbar';
import NavbarBottom from '../../components/Navbars/NavbarBottom';
import axios from 'axios';
import { GoogleMap } from '../../components/WeatherApp/GoogleMap';

export default function Weather() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locationInput, setLocationInput] = useState('');
  const [weatherData, setWeatherData] = useState({});

  const apiKey = 'f24fe0abae01bf3d756acc534d415427';
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

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      )
      .then((response) => {
        setWeatherData(response.data);
      });
  }, [latitude, longitude, locationInput]);

  console.log(weatherData);

  const handleChange = (e) => {
    setLocationInput(e.target.value);
  };

  console.log(locationInput);

  return (
    <div>
      <div className={styles.container}>
        <Navbar />
        <form>
          <input type="text" value={locationInput} onChange={handleChange} />
        </form>
        <h1>{weatherData?.main?.temp}</h1>
        <GoogleMap latitude={latitude} longitude={longitude} />
      </div>
      <NavbarBottom />
    </div>
  );
}
