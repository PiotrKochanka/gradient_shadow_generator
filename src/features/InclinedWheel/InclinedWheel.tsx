import React, { useState, useEffect } from 'react';
import styles from './InclinedWheel.module.css';

interface InclinedWheelProps {
  initialNumber: number; // Komponent przyjmuje pojedynczą liczbę
  onNumberChange: (newNumber: number) => void; // Funkcja do zgłaszania zmian na zewnątrz
}

const InclinedWheel: React.FC<InclinedWheelProps> = ({ initialNumber, onNumberChange }) => {
    const [inputValue, setInputValue] = useState<string>(String(initialNumber));

    useEffect(() => {
        setInputValue(String(initialNumber));
    }, [initialNumber]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = () => {
        const num = parseInt(inputValue, 10); // Konwertuj inputValue na liczbę całkowitą

        if (!isNaN(num)) { // Sprawdź, czy konwersja zakończyła się sukcesem
            onNumberChange(num); // Zgłoś nową liczbę do komponentu nadrzędnego (App.tsx)
        } else {
            console.warn("Wprowadzona wartość nie jest liczbą.");
        }
    };

    return(
        <div>
            <input 
                type="text" 
                name="deg-number" 
                id="deg-number" 
                value={inputValue} 
                onChange={handleInputChange}
            />
            <button
                onClick={handleButtonClick}
            >
                Zmień
            </button>
            <div>
                {initialNumber}
            </div>
        </div>
    );
}

export default InclinedWheel;