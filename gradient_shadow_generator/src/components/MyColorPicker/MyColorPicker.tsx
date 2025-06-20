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


    // Zmiana koloru po wybraniu go z "pobiernika" RGBA
    const handleChange: ColorChangeHandler = (newColor) => {
        const { r, g, b, a } = newColor.rgb;

        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a !== undefined ? a : 1})`;
        
        setColor(rgbaColor);
        onColorChange(rgbaColor);
    }


    return(
        <div>
            <SketchPicker color={color} onChange={handleChange} />
        </div>
    );
}

export default MyColorPicker;