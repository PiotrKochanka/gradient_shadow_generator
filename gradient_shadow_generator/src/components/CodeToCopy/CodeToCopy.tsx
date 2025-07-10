import React, { useState } from 'react';
import styles from './CodeToCopy.module.css';
import { GradientStop } from '../../App';

interface ColorBarProps {
    button1Color: string;
    button2Color: string;
    currentPosition: number;    
    dynamicStops: GradientStop[];
}

interface Parameter {
  color: string;
  percent: number;
}


const CodeToCopy: React.FC<ColorBarProps> = ({ button1Color, button2Color, currentPosition, dynamicStops }) => {

    const dynamicGradientStopsString = dynamicStops
        .map(p => `${p.color} ${p.percent}%`)
        .join(', ');

    let fullGradientString = `${button1Color} 0%`;

    if (dynamicGradientStopsString) { // Dodaj dynamiczne przystanki tylko jeśli istnieją
        fullGradientString += `, ${dynamicGradientStopsString}`;
    }

    fullGradientString += `, ${button2Color} 100%`;

    return(
        <div className={`${styles.code_container}`}>
            <h2>Kod do skopiowania</h2>
            <div className={`${styles.code_bar}`}>
                <span>
                    background: `linear-gradient(${currentPosition}deg, ${fullGradientString})`;
                </span>
            </div>
        </div>
    );
}

export default CodeToCopy;