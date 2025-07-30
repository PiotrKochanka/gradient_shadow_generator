import React, { useState, MouseEvent, useRef } from 'react';
import styles from './ColorBar.module.css';
import html2canvas from 'html2canvas';

// Zaktualizowany typ ActiveButton
type ActiveButton = 'button1' | 'button2' | 'dynamic' | null;

// Interfejs GradientStop zdefiniowany w App.tsx jest tutaj potrzebny
export interface GradientStop {
    color: string;
    percent: number;
}

interface ColorBarProps {
    button1Color: string;
    button2Color: string;
    onButtonClick: (buttonId: ActiveButton) => void;
    activeButtonId: ActiveButton;
    currentPosition: number;
    setNumberPercent: (currentPercent: number) => void;
    onNewButtonColorGenerated: (color: string) => void;
    onAddGradientStop: (color: string, percent: number) => void;
    gradientString: string;
    dynamicGradientStops: GradientStop[]; // Nowa właściwość: tablica dynamicznych przystanków
    onDynamicStopClick: (index: number, color: string) => void; // Nowa właściwość: funkcja do obsługi kliknięcia na dynamiczny przycisk
}

interface MousePosition {
    x: number;
    y: number;
}

const ColorBar: React.FC<ColorBarProps> = ({ 
    button1Color, 
    button2Color, 
    onButtonClick, 
    activeButtonId, 
    currentPosition, 
    setNumberPercent, 
    onNewButtonColorGenerated, 
    onAddGradientStop, 
    gradientString,
    dynamicGradientStops, // Destrukturyzacja nowej właściwości
    onDynamicStopClick // Destrukturyzacja nowej właściwości
}) => {
    const [mousePositionWindow, setMousePositionWindow] = useState<MousePosition>({x: 0, y: 0});
    const [mousePositionDiv, setMousePositionDiv] = useState<MousePosition>({x: 0, y: 0});
    const divRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: MouseEvent) => {
        setMousePositionWindow({
            x: event.clientX,
            y: event.clientY,
        });

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

        let newButtonColor: string = '#FFFFFF'; 

        try {
            const canvas = await html2canvas(divElement, { useCORS: true, logging: false });
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Nie udało się uzyskać kontekstu 2D canvasa.');
                return;
            }
            const rect = divElement.getBoundingClientRect();
            const clickX = event.clientX - rect.left; 
            const clickY = event.clientY - rect.top;  

            if (clickX < 0 || clickY < 0 || clickX >= canvas.width || clickY >= canvas.height) {
                console.warn('Kliknięcie poza obszarem renderowanego canvasa. Spróbuj kliknąć wewnątrz diva.');
                return;
            }

            const pixelData = ctx.getImageData(clickX, clickY, 1, 1).data;

            const r = pixelData[0];
            const g = pixelData[1];
            const b = pixelData[2];

            const newPercent = Math.round((clickX / rect.width) * 100);
            setNumberPercent(newPercent);

            newButtonColor = `rgb(${r}, ${g}, ${b})`;
            
            // Wywołaj onAddGradientStop, aby dodać nowy przystanek dynamiczny w App.tsx
            onAddGradientStop(newButtonColor, newPercent);
            onNewButtonColorGenerated(newButtonColor); // Ustaw ten kolor jako początkowo wybrany
            onButtonClick('dynamic'); // Ustaw aktywny przycisk na 'dynamic'
        } catch (error) {
            console.error("Błąd podczas renderowania div'a na canvasie lub pobierania koloru:", error);
            onNewButtonColorGenerated(newButtonColor);
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
                    className={`${styles.button_1} ${styles.button} ${activeButtonId === 'button1' ? styles.active : ''}`}
                >
                </button>
                <button 
                    style={{
                        backgroundColor: button2Color
                    }}
                    onClick={() => onButtonClick('button2')}
                    className={`${styles.button_2} ${styles.button} ${activeButtonId === 'button2' ? styles.active : ''}`}
                >
                </button>            
            <div 
                ref={divRef}
                className={`${styles.color_bar_main}`}
                style={{
                    background: `linear-gradient(${currentPosition}deg, ${gradientString})`
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
            {/* Mapowanie dynamicznych przystanków gradientu */}
            {dynamicGradientStops.map((stop, index) => (
                <button
                    key={index} // Używamy indeksu jako klucza, lub bardziej unikalnego ID, jeśli planujesz zmieniać kolejność/usuwać
                    style={{
                        ...newButtonStyle,
                        left: `${stop.percent}%`, // Pozycjonowanie oparte na procencie
                        background: stop.color
                    }}
                    className={`${styles.button} ${activeButtonId === 'dynamic' && stop.percent === dynamicGradientStops[index].percent ? styles.active : ''}`}
                    onClick={(e) => {
                        e.stopPropagation(); // Zapobiega wywołaniu handleClick diva
                        onDynamicStopClick(index, stop.color); // Wywołaj nową funkcję z indeksem i kolorem
                    }}
                ></button>
            ))}
            </div>
        </div>
    );
}

export default ColorBar;