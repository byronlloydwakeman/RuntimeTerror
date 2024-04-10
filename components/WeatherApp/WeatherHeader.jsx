import React from "react";

import styles from "./weatherheader.module.scss";
import { CustomTextInput } from "./CustomTextInput";

export const WeatherHeader = ({weatherData, listOpen, locationInput, locationList, locationName, setLocationInput, setLatitude, setLongitude, setListOpen}) => {

    const handleChange = (e) => {
        setLocationInput(e.target.value);
        setListOpen(true);
    };

    const handleListSelection = (e, location) => {
        setLocationInput(`${location.name}, ${location.country}`);
        setLatitude(location.lat);
        setLongitude(location.lon);
        setListOpen(false);
      };

    return (
        <>
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
        </>
    )
}