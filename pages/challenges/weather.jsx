'use client';

import React, { useEffect, useState } from 'react';
import styles from './weather.module.scss';
import Navbar from '../../components/Navbars/Navbar';
import NavbarBottom from '../../components/Navbars/NavbarBottom';
import axios from 'axios';
import { GoogleMap } from '../../components/WeatherApp/GoogleMap';
import { WeatherGraph } from '../../components/WeatherApp/WeatherGraph';
import { WeatherWidget } from '../../components/WeatherApp/WeatherWidget';
import { style } from '@mui/system';
import { CustomTextInput } from '../../components/WeatherApp/CustomTextInput';
import { motion, useAnimation } from 'framer-motion';

export default function Weather() {
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locationInput, setLocationInput] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [listOpen, setListOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherCode, setWeatherCode] = useState(null);
  const weatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const dragControls = useAnimation();

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

  // Current day weather data
  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`
      )
      .then((response) => {
        setWeatherData(response.data);
        setWeatherCode(response.data.weather[0].id);
        setLocationName(response.data.name);
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
    setLocationInput(`${location.name}, ${location.country}`);
    setLatitude(location.lat);
    setLongitude(location.lon);
    setListOpen(false);
  };

  // codes given by api for extreme weather events
  const extremeWeatherCodes = [
    200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 312, 314, 504, 522, 602,
    622, 781, 771, 762,
  ];

  return (
    <div>
      <div className={styles.container}>
        <Navbar />
        <div className={styles.header_container}>

          <h1 className={styles.header_title}>{locationName}</h1>
          <h2 className={styles.header_temperature}>{weatherData?.main?.temp.toFixed(0)}°</h2>
          <p>{weatherData?.weather[0]?.description}</p>
        </div>
        <div className={styles.input_form_container}>
          <form className={styles.input_form}>
              <CustomTextInput value={locationInput} onChange={handleChange}/>
              {listOpen &&
                locationList.map((location, index) => (
                  <div
                    className={styles.location_list_item}
                    key={index}
                    onClick={(e) => {
                      handleListSelection(e, location);
                    }}
                  >
                    <p className={styles.list_item}>
                      {location.name}, {location.country}
                    </p>
                  </div>
                ))}
          </form>
        </div>
    
        <motion.div
            style={{ display: 'flex', justifyContent: "center" }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.5}
            dragControls={dragControls}
          >
          <div className={styles.widgets_container}>
            <WeatherWidget elements={[<div className={styles.widget_item}>
                  <h1>Today</h1>
                  <h1>13C</h1>
              </div>, <div className={styles.widget_item}>
                  <h1>Today</h1>
                  <h1>13C</h1>
              </div>, <div className={styles.widget_item}>
                  <h1>Today</h1>
                  <h1>13C</h1>
              </div>]}
            />

            <WeatherWidget elements={[<WeatherGraph latitude={latitude} longitude={longitude} />]} />

            <WeatherWidget elements={[<div className={styles.widget_item}>
                <p>Humidity: {weatherData?.main?.humidity}</p>
              </div>, <div className={styles.widget_item}>
                <p>Wind speed: {weatherData?.wind?.speed} m/s</p>
              </div>, <div className={styles.widget_item}>
                <p>Precipitation: {weatherData?.wind?.speed}</p>
              </div>, <>
              <p>Weather State: {weatherData?.weather[0]?.main}</p>
                <p>
                    Weather Icon:{' '}
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}.png`}
                    />
                </p>
              </>]}
            />
          </div>
        </motion.div>
          

        <GoogleMap
          latitude={latitude}
          longitude={longitude}
          temp={`${weatherData?.main?.temp.toFixed(0)}°C`}
        />
      </div>
      <NavbarBottom />
    </div>
  );
}
