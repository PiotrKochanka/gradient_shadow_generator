import React, { useState, MouseEvent, useRef, useEffect, useCallback } from 'react';
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
    dynamicGradientStops: GradientStop[];
    onDynamicStopClick: (index: number, color: string) => void;
    onUpdateGradientStopPercent: (index: number, newPercent: number) => void;
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
    dynamicGradientStops,
    onDynamicStopClick,
    onUpdateGradientStopPercent
}) => {
    const [mousePositionWindow, setMousePositionWindow] = useState<MousePosition>({x: 0, y: 0});
    const [mousePositionDiv, setMousePositionDiv] = useState<MousePosition>({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false); // Stan przeciągania
    const [draggingStopIndex, setDraggingStopIndex] = useState<number | null>(null); // Indeks przeciąganego przystanku
    const divRef = useRef<HTMLDivElement>(null);

    // --- Obsługa Zdarzeń Myszowych (Podświetlanie/Pozycje) ---
    const handleMouseMove = (event: MouseEvent) => {
        setMousePositionWindow({ x: event.clientX, y: event.clientY });
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

    // --- Obsługa Kliknięcia (Dodawanie Nowego Przystanku) ---
    const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            // Ignoruj kliknięcie, jeśli było częścią przeciągania
            return;
        }

        const divElement = divRef.current;
        if (!divElement) return;

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
            
            // ... (reszta logiki pobierania koloru)

            const pixelData = ctx.getImageData(clickX, rect.height / 2, 1, 1).data; // Pobierz kolor ze środka paska

            const r = pixelData[0];
            const g = pixelData[1];
            const b = pixelData[2];

            const rawPercent = (clickX / rect.width) * 100;
            // Ogranicz do 1-99, aby uniknąć kolizji z przyciskami 0% i 100%
            const newPercent = Math.round(Math.max(1, Math.min(99, rawPercent)));
            setNumberPercent(newPercent);

            newButtonColor = `rgb(${r}, ${g}, ${b})`;
            
            // Dodaj nowy przystanek dynamiczny
            onAddGradientStop(newButtonColor, newPercent);
            onNewButtonColorGenerated(newButtonColor);
            onButtonClick('dynamic');
        } catch (error) {
            console.error("Błąd podczas renderowania div'a na canvasie lub pobierania koloru:", error);
            onNewButtonColorGenerated(newButtonColor);
        }
    }

    // --- Obsługa Przeciągania Przycisków (Drag-and-Drop) ---
    const handleMouseDown = (event: React.MouseEvent, index: number) => {
        // Upewnij się, że nie jest to kliknięcie prawym przyciskiem
        if (event.button !== 0) return; 

        event.stopPropagation(); // Kluczowe, aby zapobiec handleClick diva
        
        setIsDragging(true);
        setDraggingStopIndex(index);
        
        // Ustaw aktywny przycisk na "dynamic" i przekaż kolor
        const stopColor = dynamicGradientStops[index].color;
        onDynamicStopClick(index, stopColor);
    };

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDraggingStopIndex(null);
    }, []);

    const handleMouseMoveForDrag = useCallback((event: globalThis.MouseEvent) => {
        if (!isDragging || draggingStopIndex === null || !divRef.current) {
            return;
        }

        const divElement = divRef.current;
        const rect = divElement.getBoundingClientRect();
        
        let newX = event.clientX - rect.left;

        // Ograniczanie X do granic diva (0 do szerokości)
        if (newX < 0) {
            newX = 0;
        } else if (newX > rect.width) {
            newX = rect.width;
        }

        // Obliczanie nowego procentu (ograniczone do 1-99)
        const rawPercent = (newX / rect.width) * 100;
        const newPercent = Math.round(Math.max(1, Math.min(99, rawPercent)));

        // Aktualizacja procentu w komponencie nadrzędnym
        onUpdateGradientStopPercent(draggingStopIndex, newPercent);
        setNumberPercent(newPercent);
        
    }, [isDragging, draggingStopIndex, onUpdateGradientStopPercent, setNumberPercent]);

    // Dodanie globalnych event listenerów do obsługi `mousemove` i `mouseup` na całym dokumencie
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMoveForDrag);
            document.addEventListener('mouseup', handleMouseUp);
             // Opcjonalnie: Zmień kursor dla lepszego UX
            document.body.style.cursor = 'grabbing';
        } else {
            document.removeEventListener('mousemove', handleMouseMoveForDrag);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMoveForDrag);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, [isDragging, handleMouseMoveForDrag, handleMouseUp]);


    const newButtonStyle: React.CSSProperties = {
        position: 'absolute',
        // Użyj translateY(-50%) aby wycentrować button pionowo
    };

    return(
        <div className={`${styles.color_bar_container}`}>
            {/* Przycisk 1 (0%) */}
            <button 
                style={{ backgroundColor: button1Color }}
                onClick={() => onButtonClick('button1')}
                className={`${styles.button_1} ${styles.button} ${activeButtonId === 'button1' ? styles.active : ''}`}
            ></button>
            {/* Przycisk 2 (100%) */}
            <button 
                style={{ backgroundColor: button2Color }}
                onClick={() => onButtonClick('button2')}
                className={`${styles.button_2} ${styles.button} ${activeButtonId === 'button2' ? styles.active : ''}`}
            ></button>            
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
            {dynamicGradientStops
                .filter(stop => stop.percent > 0 && stop.percent < 100) // Filtrujemy, jeśli 0% i 100% są obsługiwane przez stałe buttony
                .map((stop, index) => (
                    <button
                        key={index}
                        style={{
                            ...newButtonStyle,
                            left: `${stop.percent}%`, 
                            background: stop.color
                        }}
                        // 🔥 DODAJEMY onMouseDown, ABY WŁĄCZYĆ PRZECIĄGANIE 🔥
                        onMouseDown={(e) => handleMouseDown(e, index)}
                        className={`${styles.button} ${activeButtonId === 'dynamic' && (draggingStopIndex === index || (dynamicGradientStops[index].percent === stop.percent)) ? styles.active : ''}`}
                        onClick={(e) => {
                            e.stopPropagation(); // Zapobiega wywołaniu handleClick diva
                            // Wywołaj onDynamicStopClick tylko jeśli nie było to przeciąganie
                            if (draggingStopIndex === null && !isDragging) {
                                onDynamicStopClick(index, stop.color);
                            }
                        }}
                    ></button>
            ))}
            </div>
        </div>
    );
}

export default ColorBar;