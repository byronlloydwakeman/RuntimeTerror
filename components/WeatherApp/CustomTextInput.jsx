import React from 'react';

import styles from './customtextinput.module.scss';

export const CustomTextInput = ({ value, onChange }) => {
  return (
    <div id="weatherInput" className={styles.custom_text_input__container}>
      <input
        id="inputForWeather"
        value={value}
        onChange={onChange}
        onBlur={() => {
          var element = document.getElementById('weatherInput');
          element.classList.remove(
            `${styles.custom_text_input__boxSlideInComplete}`
          );
        }}
        onFocus={() => {
          var element = document.getElementById('weatherInput');
          element.classList.add(
            `${styles.custom_text_input__boxSlideInComplete}`
          );
        }}
        className={styles.custom_text_input}
        type="text"
        placeholder="🔎︎ Search"
      />
    </div>
  );
};
