import { SketchPicker, ColorChangeHandler } from 'react-color';
import React, { useState, useEffect } from 'react';

interface MyColorPickerProps {
    initialColor: string;
}

const MyColorPicker: React.FC<MyColorPickerProps> = ({ initialColor }) => {
    const [color, setColor] = useState(initialColor);

    useEffect(() => {
        setColor(initialColor);
    }, [initialColor]);

    const handleChange: ColorChangeHandler = (newColor) => {
        setColor(newColor.hex);
        console.log('wybrany kolor HEX', newColor.hex);
        console.log('wybrany kolor RGB', newColor.rgb);
    }

    return(
        <div>
            <SketchPicker color={color} onChange={handleChange} />
            <p>Wybrany kolor (HEX): {color}</p>
        </div>
    );
}

export default MyColorPicker;