import React, { useState, MouseEvent, useRef, useEffect, } from 'react';
import styles from './ColorBar.module.css';
import html2canvas from 'html2canvas';

type ActiveButton = 'button1' | 'button2' | null;

interface ColorBarProps {
    button1Color: string;
    button2Color: string;
    onButtonClick: (buttonId: ActiveButton) => void;
    activeButtonId: ActiveButton;
    currentPosition: number;
    setNumberPercent: (currentPercent: number) => void;
    onNewButtonColorGenerated: (color: string) => void;
    onAddGradientStop: (color: string, percent: number) => void;
}

interface MousePosition {
    x: number;
    y: number;
}

interface Button {
  id: string; // Unikalne ID, potrzebne dla klucza React (key prop)
  x: number;   // Pozycja X kropki
  color: string;
}

interface ClickPositionPercent {
    xPercent: number;
}

const ColorBar: React.FC<ColorBarProps> = ({ button1Color, button2Color, onButtonClick, activeButtonId, currentPosition, setNumberPercent, onNewButtonColorGenerated, onAddGradientStop }) => {
    const [mousePositionWindow, setMousePositionWindow] = useState<MousePosition>({x: 0, y: 0});
    const [mousePositionDiv, setMousePositionDiv] = useState<MousePosition>({x: 0, y: 0});
    const [clickPositionDiv, setClickPositionDiv] = useState<MousePosition>({ x: 0, y: 0 });
    const divRef = useRef<HTMLDivElement>(null);
    const [clickPositionPercent, setClickPositionPercent] = useState<ClickPositionPercent>({ xPercent: 0 });
    const [buttons, setButtons] = useState<Button[]>([]);
    const [clickedColor, setClickedColor] = useState<string | null>(null);

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

    const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        const divElement = divRef.current;

        if (!divElement) {
            return;
        }

        let newButtonColor: string = '#FFFFFF'; // Kolor domyślny

        try {
            // 1. Zrenderuj diva z gradientem na tymczasowym canvasie
            const canvas = await html2canvas(divElement, { useCORS: true, logging: false });

            // 2. Pobierz kontekst 2D z wygenerowanego canvasa
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Nie udało się uzyskać kontekstu 2D canvasa.');
                return;
            }
            // 3. Oblicz współrzędne kliknięcia względem samego diva
            const rect = divElement.getBoundingClientRect();
            const clickX = event.clientX - rect.left; // Współrzędna X kliknięcia wewnątrz diva
            const clickY = event.clientY - rect.top;  // Współrzędna Y kliknięcia wewnątrz diva

            // Sprawdź, czy współrzędne są w granicach canvasa
            if (clickX < 0 || clickY < 0 || clickX >= canvas.width || clickY >= canvas.height) {
                console.warn('Kliknięcie poza obszarem renderowanego canvasa. Spróbuj kliknąć wewnątrz diva.');
                return;
            }

            // 4. Pobierz dane piksela z canvasa dla klikniętych współrzędnych
            const pixelData = ctx.getImageData(clickX, clickY, 1, 1).data;

            // pixelData zawiera tablicę [R, G, B, A] dla piksela
            const r = pixelData[0];
            const g = pixelData[1];
            const b = pixelData[2];
            // const a = pixelData[3]; // Wartość alfa (przezroczystość)

            // OBLICZENIE POZYCJI W PROCENTACH
            const newPercent = Math.round((clickX / rect.width) * 100);
            setNumberPercent(newPercent);

            newButtonColor = `rgb(${r}, ${g}, ${b})`;
            setClickedColor(newButtonColor); // Zapisz pobrany kolor

            onNewButtonColorGenerated(newButtonColor);

            onAddGradientStop(newButtonColor, newPercent);

        } catch (error) {
            console.error("Błąd podczas renderowania div'a na canvasie lub pobierania koloru:", error);
            onNewButtonColorGenerated(newButtonColor);
        }

        if(divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            setClickPositionDiv({ x: clickX, y: clickY });

            const newButton: Button = {
                id: Date.now().toString(),
                x: clickX,
                color: newButtonColor,
            };

            setButtons((prevButton) => [...prevButton, newButton]);
        } else {
            console.log("divRef.current JEST NULL!");
        }
    }

    const newButtonStyle: React.CSSProperties = {
        position: 'absolute',
        transform: 'translateX(-50%)',
    };

    return(
        <div className={`${styles.color_bar_container}`}>
                <button 
                    style={{
                        backgroundColor: button1Color
                    }}
                    onClick={() => onButtonClick('button1')}
                    className={`${styles.button_1} ${styles.button}`}
                >
                </button>
                <button 
                    style={{
                        backgroundColor: button2Color
                    }}
                    onClick={() => onButtonClick('button2')}
                    className={`${styles.button_2} ${styles.button}`}
                >
                </button>            
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
            {buttons.map((button) => (
                <button
                    key={button.id}
                    style={{
                        ...newButtonStyle,
                        left: `${button.x}px`,
                        background: button.color
                    }}
                    className={`${styles.button}`}
                ></button>
            ))}
            </div>
        </div>
    );
}

export default ColorBar;