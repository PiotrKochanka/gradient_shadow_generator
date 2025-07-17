import React, { useState } from 'react';
import styles from './CodeToCopy.module.css';
import { GradientStop } from '../../App';

interface ColorBarProps {
    button1Color: string;
    button2Color: string;
    currentPosition: number;    
    gradientString: string;
}

interface Parameter {
  color: string;
  percent: number;
}


const CodeToCopy: React.FC<ColorBarProps> = ({ button1Color, button2Color, currentPosition, gradientString }) => {


    return(
        <div className={`${styles.code_container}`}>
            <h2>Kod do skopiowania</h2>
            <div className={`${styles.code_bar}`}>
                <span>
                    background: `linear-gradient({currentPosition}deg, {gradientString})`;
                </span>
            </div>
        </div>
    );
}

export default CodeToCopy;