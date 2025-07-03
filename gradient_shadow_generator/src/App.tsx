import React, { useState } from 'react';
import './App.css';
import MyColorPicker from './components/MyColorPicker/MyColorPicker';
import ColorBar from './components/ColorBar/ColorBar';
import InclinedWheel from './components/InclinedWheel/InclinedWheel';
import CodeToCopy from './components/CodeToCopy/CodeToCopy';

type ActiveButton = 'button1' | 'button2' | null;

interface AppProps {
  initialAppColor?: string;
}

function App() {
  const [button1Color, setButton1Color] = useState<string>('#808080');
  const [button2Color, setButton2Color] = useState<string>('#0000FF');
  const [activeButton, setActiveButton] = useState<ActiveButton>(null);
  const [currentNumber, setCurrentNumber] = useState<number>(90);
  const [percent, setPercent] = useState<number>(0);

  // Przypisywanie koloru dla "pobiernika"
  const handleColorPickerChange = (newColor: string) => {
    if(activeButton === 'button1') {
      setButton1Color(newColor);
    } else if(activeButton === 'button2') {
      setButton2Color(newColor);
    }
  };

  // Funkcja służąca do przypisania id po kliknięciu w dany przycisk
  const handleColorBarButtonClick = (buttonId: ActiveButton) => {
    setActiveButton(buttonId);
  };

  // Wyświetlanie koloru w "pobierniku" dla danego przycisku
  const initialColorForPicker = activeButton === 'button1'
    ? button1Color
    : activeButton === 'button2'
      ? button2Color 
      : '#CCCCCC' // Domyślny kolor

  const handleNumberUpdate = (newNumber: number) => {
      setCurrentNumber(newNumber);
  };

  const handlePercentUpdate = (newPercent: number) => {
    setPercent(newPercent);
  }

  // Domyślny kontener
  return (
    <div className="App">
      <div className="menu">

      </div>
      <div className="content">
        <MyColorPicker 
          initialColor={initialColorForPicker}
          onColorChange={handleColorPickerChange}
        />
        <ColorBar 
          button1Color={button1Color}
          button2Color={button2Color}
          onButtonClick={handleColorBarButtonClick}
          activeButtonId={activeButton}
          currentPosition={currentNumber}
          percent={percent}
        />
        <br />
        <InclinedWheel 
          initialNumber={currentNumber}
          onNumberChange={handleNumberUpdate}
        />
        <CodeToCopy 
          button1Color={button1Color}
          button2Color={button2Color}
          currentPosition={currentNumber}
          percent={percent}
        />
      </div>
    </div>
  );
}

export default App;
