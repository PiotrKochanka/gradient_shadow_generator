import React from 'react';
import { Color } from 'react-color';

type ActiveButton = 'button1' | 'button2' | null;

interface ColorBarProps {
    button1Color: string;
    button2Color: string;
    onButtonClick: (buttonId: ActiveButton) => void;
    activeButtonId: ActiveButton;
}

const ColorBar: React.FC<ColorBarProps> = ({ button1Color, button2Color, onButtonClick, activeButtonId }) => {

    return(
        <div>
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
    );
}

export default ColorBar;