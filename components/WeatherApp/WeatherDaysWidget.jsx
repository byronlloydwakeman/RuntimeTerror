import React, { useState } from "react";

import styles from "./weatherdayswidget.module.scss";
import { WeatherWidget } from "./WeatherWidget";

const getFutureDays = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const currentDay = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  
    // Array to store the next 5 days
    const futureDays = [];
  
    // Loop to get the next 5 days
    for (let i = 0; i < 5; i++) {
      // Calculate the index of the next day in the daysOfWeek array
      const nextDayIndex = (currentDay + i) % 7;
      // Push the name of the next day to the futureDays array
      futureDays.push(daysOfWeek[nextDayIndex]);
    }
  
    return futureDays;
};


export const WeatherDaysWidget = ({ futureTemps }) => 
{
    const futureDays = getFutureDays();

    return (
        <WeatherWidget elements={[<div className={styles.widget_item}>
            <h1 style={{marginRight: "auto"}}>Today</h1>
            <h1>{futureTemps ? `${futureTemps[0]}°C` : <p>Loading...</p>}</h1>
        </div>, <div className={styles.widget_item}>
            <h1 style={{marginRight: "auto"}}>Tomorrow</h1>
            <h1>{futureTemps ? `${Math.round(futureTemps[1])}°C` : <p>Loading...</p>}</h1>
        </div>, <div className={styles.widget_item}>
            <h1 style={{marginRight: "auto"}}>{futureDays[2]}</h1>
            <h1>{futureTemps ?  `${Math.round(futureTemps[2])}°C` : <p>Loading...</p>}</h1>
        </div>, <div className={styles.widget_item}>
            <h1 style={{marginRight: "auto"}}>{futureDays[3]}</h1>
            <h1>{futureTemps ?  `${Math.round(futureTemps[3])}°C` : <p>Loading...</p>}</h1>
        </div>, <div className={styles.widget_item}>
            <h1 style={{marginRight: "auto"}}>{futureDays[4]}</h1>
            <h1>{futureTemps ?  `${Math.round(futureTemps[4])}°C` : <p>Loading...</p>}</h1>
        </div>]}
      />
    )
}