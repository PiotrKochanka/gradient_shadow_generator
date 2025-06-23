import React from 'react';

interface ColorBarProps {
    button1Color: string;
    button2Color: string;
    currentPosition: number;
}

const CodeToCopy: React.FC<ColorBarProps> = ({ button1Color, button2Color, currentPosition }) => {
    return(
        <div>
            Kod do skopiowania
            <div>
                <span>
                    background: linear-gradient({currentPosition}deg, {button1Color} 0%, {button2Color} 100%);
                </span>
            </div>
        </div>
    );
}

export default CodeToCopy;