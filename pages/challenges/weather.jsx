'use client';

import React, { useEffect, useState } from 'react';
import styles from './weather.module.scss';
import Navbar from '../../components/Navbars/Navbar';
import NavbarBottom from '../../components/Navbars/NavbarBottom';
import axios from 'axios';

import { GoogleMap } from '../../components/WeatherApp/GoogleMap';
import { WeatherGraph } from '../../components/WeatherApp/WeatherGraph';
import { WeatherWidget } from '../../components/WeatherApp/WeatherWidget';
import { motion, useAnimation } from 'framer-motion';
import { WeatherDaysWidget } from '../../components/WeatherApp/WeatherDaysWidget';
import { WeatherHeader } from '../../components/WeatherApp/WeatherHeader';
import { getLocationList } from '../../components/WeatherApp/API/getLocationList.ts';


export default function Weather() {
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locationInput, setLocationInput] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [listOpen, setListOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherCode, setWeatherCode] = useState(null);

  // Future Weather

  const [futureTemps, setFutureTemps] = useState(null);
  const [futureTempsFarenheit, setFutureTempsFarenheit] = useState(null);

  const weatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const dragControls = useAnimation();

  // Get users current location

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

  // API Calls

  let countryCode = '';
  let stateCode = '';

  // Gets a list of places for user upon input
  useEffect(() => {
    setLocationList(getLocationList());
  }, [locationInput, stateCode, countryCode]);

  // Current day weather data
  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`
      )
      .then((response) => {
        console.log(response);
        setWeatherData(response.data);
        setWeatherCode(response.data.weather[0].id);
        setLocationName(response.data.name);
      });
  }, [latitude, longitude, weatherApiKey]);

  // codes given by api for extreme weather events
  const extremeWeatherCodes = [
    200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 312, 314, 504, 522, 602,
    622, 781, 771, 762,
  ];

  return (
    <div>
      <div className={styles.container}>
        <Navbar />

        <WeatherHeader weatherData={weatherData} listOpen={listOpen} locationInput={locationInput} 
          locationList={locationList} locationName={locationName} setLocationInput={setLocationInput}
          setLatitude={setLatitude} setLongitude={setLongitude} setListOpen={setListOpen}/>
    
        <motion.div
            style={{ display: 'flex', justifyContent: "center" }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.5}
            dragControls={dragControls}
          >
          <div className={styles.widgets_container}>
            <WeatherDaysWidget futureTemps={futureTemps}/>

            <WeatherWidget elements={[<WeatherGraph latitude={latitude} longitude={longitude} 
              futureTemps={futureTemps} setFutureTemps={setFutureTemps} 
              futureTempsFarenheit={futureTempsFarenheit} setFutureTempsFarenheit={setFutureTempsFarenheit}/>]} />

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
