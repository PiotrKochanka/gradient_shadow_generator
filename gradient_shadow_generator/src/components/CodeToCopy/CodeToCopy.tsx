import React from 'react';
import styles from './CodeToCopy.module.css';

interface ColorBarProps {
    button1Color: string;
    button2Color: string;
    currentPosition: number;
}

const CodeToCopy: React.FC<ColorBarProps> = ({ button1Color, button2Color, currentPosition }) => {
    return(
        <div className={`${styles.code_container}`}>
            <h2>Kod do skopiowania</h2>
            <div className={`${styles.code_bar}`}>
                <span>
                    background: linear-gradient({currentPosition}deg, {button1Color} 0%, {button2Color} 100%);
                </span>
            </div>
        </div>
    );
}

export default CodeToCopy;