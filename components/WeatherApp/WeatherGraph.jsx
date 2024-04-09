'use client';

import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { SweepButton } from './SweepButton';
import styles from "./weathergraph.module.scss"
import axios from 'axios';

export const WeatherGraph = ({latitude, longitude, futureTemps, setFutureTemps, futureTempsFarenheit, setFutureTempsFarenheit}) => {
  const [weatherDataFuture, setWeatherDataFuture] = useState(null);
  const [weatherDataFutureFarenheit, setWeatherDataFutureFarenheit] = useState(null);
  const [dates, setDates] = useState([]);
  const [displayCelsius, setDisplayCelsius] = useState(true);
  const weatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`
      )
      .then((response) => {
        setWeatherDataFuture(response.data);
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=imperial`
      )
      .then((response) => {
        setWeatherDataFutureFarenheit(response.data);
      });

    resetValues();
  }, [weatherApiKey, latitude, longitude]);

  useEffect(() => {
    if (weatherDataFuture && weatherDataFutureFarenheit) {
      for (let i = 0; i < weatherDataFuture?.list.length; i++) {
        if (i % 8 == 0) {
          let unixTimestamp = weatherDataFuture?.list[i].dt;
          let forecastDate = new Date(unixTimestamp * 1000); // convert timestamp to milliseconds and construct Date object
          dates.push(forecastDate);
          if (futureTemps.length < 5)
            futureTemps.push(weatherDataFuture?.list[i]?.main?.temp);
          if (futureTempsFarenheit.length < 5)
            futureTempsFarenheit.push(
              weatherDataFutureFarenheit?.list[i]?.main?.temp
            );
        }
      }
    }
  }, [weatherDataFuture, weatherDataFutureFarenheit, displayCelsius]);

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
    <>
      {futureTemps && futureTempsFarenheit ? (
        <div className={styles.weather_graph__container}> 
          {displayCelsius ? (
            <div>
              <LineChart
              sx={{
                //change left yAxis label styles
                "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                  strokeWidth:"0.4",
                  fill:"#FFFFFF"
                },
                "& .MuiChartsAxis-label": {
                  color:"#FFFFFF"
                },
                // change bottom label styles
                "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                    strokeWidth:"0.5",
                    fill:"#FFFFFF"
                 },
                  // bottomAxis Line Styles
                 "& .MuiChartsAxis-bottom .MuiChartsAxis-line":{
                    stroke:"#FFFFFF",
                    strokeWidth:0.4
                 },
                 // leftAxis Line Styles
                 "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                    stroke:"#FFFFFF",
                    strokeWidth:0.4
                 }
              }}
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
                    color: '#76b7b2'
                  },
                ]}
                width={500}
                height={300}
              />
              <SweepButton Content={"Switch to Farenheit (°F)"} Function={() => {setDisplayCelsius(false);}}/>
            </div>
          ) : (
            <div>
              <LineChart
                sx={{
                  //change left yAxis label styles
                  "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
                    strokeWidth:"0.4",
                    fill:"#FFFFFF"
                  },
                  "& .MuiChartsAxis-label": {
                    color:"#FFFFFF"
                  },
                  // change bottom label styles
                  "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
                      strokeWidth:"0.5",
                      fill:"#FFFFFF"
                    },
                    // bottomAxis Line Styles
                    "& .MuiChartsAxis-bottom .MuiChartsAxis-line":{
                      stroke:"#FFFFFF",
                      strokeWidth:0.4
                    },
                    // leftAxis Line Styles
                    "& .MuiChartsAxis-left .MuiChartsAxis-line":{
                      stroke:"#FFFFFF",
                      strokeWidth:0.4
                    }
                }}
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
                    color: '#76b7b2'
                  },
                ]}
                width={500}
                height={300}
              />
              <SweepButton Content={"Switch to Celsius (°C)"} Function={() => {setDisplayCelsius(true)}}/>
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
