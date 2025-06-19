import React, { useState } from 'react';
import './App.css';
import MyColorPicker from './components/MyColorPicker/MyColorPicker';
import ColorBar from './components/ColorBar/ColorBar';

type ActiveButton = 'button1' | 'button2' | null;

interface AppProps {
  initialAppColor?: string;
}

function App() {
  const [button1Color, setButton1Color] = useState<string>('#808080');
  const [button2Color, setButton2Color] = useState<string>('#0000FF');
  const [activeButton, setActiveButton] = useState<ActiveButton>(null);

  const handleColorPickerChange = (newColor: string) => {
    if(activeButton === 'button1') {
      setButton1Color(newColor);
    } else if(activeButton === 'button2') {
      setButton2Color(newColor);
    }
  };

  const handleColorBarButtonClick = (buttonId: ActiveButton) => {
    setActiveButton(buttonId);
  };

  const initialColorForPicker = activeButton === 'button1'
    ? button1Color
    : activeButton === 'button2'
      ? button2Color 
      : '#CCCCCC'

  return (
    <div className="App">
      <MyColorPicker 
        initialColor={initialColorForPicker}
        onColorChange={handleColorPickerChange}
      />
      <ColorBar 
        button1Color={button1Color}
        button2Color={button2Color}
        onButtonClick={handleColorBarButtonClick}
        activeButtonId={activeButton}
      />
    </div>
  );
}

export default App;
