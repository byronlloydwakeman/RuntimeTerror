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

  useEffect(() => {
    // Find the div element by its ID or class
    const divElement = document.getElementById('weather-container'); // Replace 'yourDivId' with the actual ID of your div

    const weatherImagePairs = [{
      "name": "Thunderstorm",
      "image": "https://zenitube.com/img/posts/2016/storm-gif/storm-gif10.gif"
    }, {
      "name": "Drizzle",
      "image": "https://i.pinimg.com/originals/e6/18/95/e618957b8c16e662392bd086a2d94f3c.gif"
    },{
      "name": "Rain",
      "image": "https://i.pinimg.com/originals/e6/18/95/e618957b8c16e662392bd086a2d94f3c.gif"
    },{
      "name": "Snow",
      "image": "https://th.bing.com/th/id/R.06c2dbb8ba84eb51b87ac04d25e09288?rik=UzCRPhm3Z4V9lA&pid=ImgRaw&r=0"
    },{
      "name": "Atmosphere",
      "image": "https://i.gifer.com/origin/45/454ba38b4ce5b3fdc8796ed710769e69.gif"
    },{
      "name": "Clear",
      "image": "https://static.vecteezy.com/system/resources/previews/003/692/649/large_2x/beautiful-clear-blue-sky-in-summer-look-lke-heaven-free-photo.jpg"
    },{
      "name": "Clouds",
      "image": "https://i.giphy.com/media/gINumlT106MrivPf0j/giphy.gif"
    },]

    const currentWeather = weatherData?.weather[0]?.main;

    // Define the new background image URL
    const newBackgroundImageUrl = weatherImagePairs.find(pair => pair.name === currentWeather)?.image;
    
    console.log(newBackgroundImageUrl);

    divElement.style.backgroundImage = `url("${newBackgroundImageUrl}")`;
  }, [weatherData])

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
      <div id="weather-container" className={styles.container}>
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
            {/* <WeatherWidget elements={[<div className={styles.widget_item}>
                  <h1>Today</h1>
                  <h1>13C</h1>
              </div>, <div className={styles.widget_item}>
                  <h1>Today</h1>
                  <h1>13C</h1>
              </div>, <div className={styles.widget_item}>
                  <h1>Today</h1>
                  <h1>13C</h1>
              </div>]}
            /> */}

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
