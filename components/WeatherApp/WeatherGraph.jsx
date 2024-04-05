'use client';

import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import GreenResponsiveButton from '../UiElements/GreenResponsiveButton';

export const WeatherGraph = (coords) => {
  const [weatherDataFuture, setWeatherDataFuture] = useState(null);
  const [weatherDataFutureFarenheit, setWeatherDataFutureFarenheit] =
    useState(null);
  const [futureTemps, setFutureTemps] = useState(null);
  const [futureTempsFarenheit, setFutureTempsFarenheit] = useState(null);
  const [dates, setDates] = useState([]);
  const [displayCelsius, setDisplayCelsius] = useState(true);
  const weatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${weatherApiKey}&units=metric`
      )
      .then((response) => {
        setWeatherDataFuture(response.data);
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${weatherApiKey}&units=imperial`
      )
      .then((response) => {
        setWeatherDataFutureFarenheit(response.data);
      });

    resetValues();
  }, [weatherApiKey, coords]);

  useEffect(() => {
    for (let i = 0; i < weatherDataFuture?.list.length; i++) {
      if (i % 8 == 0) {
        let unixTimestamp = weatherDataFuture?.list[i].dt;
        let forecastDate = new Date(unixTimestamp * 1000); // convert timestamp to milliseconds and construct Date object
        let mm = forecastDate.getMonth() + 1;
        let dd = forecastDate.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        const formattedDate = dd + '/' + mm;
        dates.push(forecastDate);
        if (futureTemps.length < 5)
          futureTemps.push(weatherDataFuture?.list[i]?.main?.temp);
        if (futureTempsFarenheit.length < 5)
          futureTempsFarenheit.push(
            weatherDataFutureFarenheit?.list[i]?.main?.temp
          );
      }
    }
  }, [weatherDataFuture, weatherDataFutureFarenheit]);

  const valueFormatter = (date) =>
    date.toLocaleDateString('fr-FR', {
      month: '2-digit',
      day: '2-digit',
    });

  const resetValues = () => {
    setFutureTemps([]);
    setFutureTempsFarenheit([]);
    setDates([]);
  };

  return (
    <div>
      {futureTemps && futureTempsFarenheit ? (
        <div>
          {displayCelsius ? (
            <div>
              <LineChart
                xAxis={[
                  {
                    data: dates,
                    scaleType: 'point',
                    valueFormatter,
                    label: 'Date',
                    position: 'top',
                  },
                ]}
                yAxis={[{ label: 'Temperature (°C)' }]}
                series={[
                  {
                    data: futureTemps,
                  },
                ]}
                width={500}
                height={300}
              />

              <GreenResponsiveButton
                text="Switch to Farenheit (°F)"
                onClick={() => {
                  setDisplayCelsius(false);
                }}
              />
            </div>
          ) : (
            <div>
              <LineChart
                xAxis={[
                  {
                    data: dates,
                    scaleType: 'point',
                    valueFormatter,
                    label: 'Date',
                    position: 'top',
                  },
                ]}
                yAxis={[{ label: 'Temperature (°F)' }]}
                series={[
                  {
                    data: futureTempsFarenheit,
                  },
                ]}
                width={500}
                height={300}
              />

              <GreenResponsiveButton
                text="Switch to Celsius (°C)"
                onClick={() => {
                  setDisplayCelsius(true);
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
