import { SketchPicker, ColorChangeHandler } from 'react-color';
import React, { useState, useEffect } from 'react';

interface MyColorPickerProps {
    initialColor: string;
    onColorChange: (color: string) => void;
}

const MyColorPicker: React.FC<MyColorPickerProps> = ({ initialColor, onColorChange }) => {
    const [color, setColor] = useState(initialColor);

    // Przypisanie koloru i sprawdzenie czy został on zmieniony
    useEffect(() => {
        setColor(initialColor);
    }, [initialColor]);


    // Zmiana koloru po wybraniu go z "pobiernika"
    const handleChange: ColorChangeHandler = (newColor) => {
        setColor(newColor.hex);
        onColorChange(newColor.hex);
    }

    return(
        <div>
            <SketchPicker color={color} onChange={handleChange} />
            <p>Wybrany kolor (HEX): {color}</p>
        </div>
    );
}

export default MyColorPicker;