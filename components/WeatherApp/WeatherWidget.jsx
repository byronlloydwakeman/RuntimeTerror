import React from 'react';
import styles from './weatherwidget.module.scss';

const WeatherItem = ({ element }) => {
  return (
    <div className={styles.item_container}>
      <>{element}</>
    </div>
  );
};

export const WeatherWidget = ({ elements }) => {
  return (
    <div className={styles.widget_container}>
      {elements.map((el, index) => {
        return <WeatherItem key={index} element={<>{el}</>} />;
      })}
    </div>
  );
};
