import React from "react";
import styles from "./weatherwidget.module.scss";

import { motion, useAnimation } from 'framer-motion';

const WeatherItem = ({element}) => {
    return(
        <div className={styles.item_container}>
            <>
                {element}
            </>
        </div>
    )
}

export const WeatherWidget = ({elements}) => {
    const dragControls = useAnimation();

    return (
        <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.5}
            dragControls={dragControls}
            style={{ cursor: 'grab' }}
        >
            <div className={styles.widget_container}>
                {elements.map(el => {
                    return (
                        <WeatherItem element={<>
                            {el}
                        </>}/>
                    )
                })}
            </div>  
        </motion.div>

    )
}