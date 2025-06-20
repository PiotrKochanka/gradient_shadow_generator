import React from 'react';
import { Color } from 'react-color';
import styles from './ColorBar.module.css';

type ActiveButton = 'button1' | 'button2' | null;

interface ColorBarProps {
    button1Color: string;
    button2Color: string;
    onButtonClick: (buttonId: ActiveButton) => void;
    activeButtonId: ActiveButton;
    currentPosition: number;
}

const ColorBar: React.FC<ColorBarProps> = ({ button1Color, button2Color, onButtonClick, activeButtonId, currentPosition }) => {

    return(
        <div className={`${styles.color_bar_container}`}>
            <div className={`${styles.color_bar_buttons}`}>
                <button 
                    style={{
                        backgroundColor: button1Color
                    }}
                    onClick={() => onButtonClick('button1')}
                >
                    kolor #1
                </button>
                <button 
                    style={{
                        backgroundColor: button2Color
                    }}
                    onClick={() => onButtonClick('button2')}
                >
                    kolor #2
                </button>
            </div>
            <div 
                className={`${styles.color_bar_main}`}
                style={{
                    background: `linear-gradient(${currentPosition}deg, ${button1Color} 0%, ${button2Color} 100%)`
                }}
            >

            </div>
        </div>
    );
}

export default ColorBar;