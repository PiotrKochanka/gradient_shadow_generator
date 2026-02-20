import React, { useState, useEffect } from 'react';
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
    const [cssCode, setCssCode] = useState("");

    // Aktualizacja kodu CSS przy zmianie propsów
    useEffect(() => {
        const newCode = `background: linear-gradient(${currentPosition}deg, ${gradientString});`;
        setCssCode(newCode);
    }, [currentPosition, gradientString]);

    // Kopiowanie kodu do schowka
    const handleCodeToCopy = () => {
        navigator.clipboard.writeText(cssCode)
            .then(() => alert("Skopiowano do schowka"))
            .catch(err => alert("Błąd kopiowania"));
    }

    return(
        <div className={`${styles.code_container}`}>
            <div className={`${styles.code_bar}`}>
                <div className={`${styles.code_bar_copy}`}>
                    <button
                        onClick={handleCodeToCopy}
                    >Kopiuj</button>
                </div>
                <span>
                    {cssCode}
                </span>    
            </div>
        </div>
    );
}

export default CodeToCopy;