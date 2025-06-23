import React, { useState, MouseEvent, useRef } from 'react';
import styles from './ColorBar.module.css';

type ActiveButton = 'button1' | 'button2' | null;

interface ColorBarProps {
    button1Color: string;
    button2Color: string;
    onButtonClick: (buttonId: ActiveButton) => void;
    activeButtonId: ActiveButton;
    currentPosition: number;
}

interface MousePosition {
    x: number;
    y: number;
}

interface ClickPositionPercent {
    xPercent: number;
}

const ColorBar: React.FC<ColorBarProps> = ({ button1Color, button2Color, onButtonClick, activeButtonId, currentPosition }) => {
    const [mousePositionWindow, setMousePositionWindow] = useState<MousePosition>({x: 0, y: 0});
    const [mousePositionDiv, setMousePositionDiv] = useState<MousePosition>({x: 0, y: 0});
    const [clickPositionDiv, setClickPositionDiv] = useState<MousePosition>({ x: 0, y: 0 });
    const divRef = useRef<HTMLDivElement>(null);
    const [clickPositionPercent, setClickPositionPercent] = useState<ClickPositionPercent>({ xPercent: 0 });

    const handleMouseMove = (event: MouseEvent) => {
        // Pozycja myszki względem przeglądarki
        setMousePositionWindow({
            x: event.clientX,
            y: event.clientY,
        });

        // Pozycja myszki względem div'a
        if(divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            setMousePositionDiv({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        }
    }
    
    const handleMouseLeave = () => {
        setMousePositionWindow({ x: 0, y: 0 });
        setMousePositionDiv({ x: 0, y: 0 });
    }

    const handleClick = (event: MouseEvent) => {
        if(divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            setClickPositionDiv({ x: clickX, y: clickY });

            // OBLICZENIE POZYCJI W PROCENTACH
            const clickXPercent = (clickX / rect.width) * 100;

            setClickPositionPercent({ xPercent: clickXPercent });

            console.log(`kliknięto: x: ${clickX}`);
            console.log(`Kliknięto w diva (%): X: ${clickXPercent.toFixed(2)}%`);
        } else {
            console.log("divRef.current JEST NULL!");
        }
    }

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
                ref={divRef}
                className={`${styles.color_bar_main}`}
                style={{
                    background: `linear-gradient(${currentPosition}deg, ${button1Color} 0%, ${button2Color} 100%)`
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >

            </div>
        </div>
    );
}

export default ColorBar;