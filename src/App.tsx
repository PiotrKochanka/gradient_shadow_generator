import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import './App.css';
import MyColorPicker from './components/MyColorPicker/MyColorPicker';
import ColorBar from './components/ColorBar/ColorBar';
import InclinedWheel from './components/InclinedWheel/InclinedWheel';
import CodeToCopy from './components/CodeToCopy/CodeToCopy';
import ResetButton from './components/ResetButton/ResetButton';

// Zaktualizowany typ ActiveButton
type ActiveButton = 'button1' | 'button2' | 'dynamic' | null;

interface AppProps {
  initialAppColor?: string;
}

export interface GradientStop {
  color: string;
  percent: number;
}

function App() {
  const [buttonColor, setButtonColor] = useState<string>('');
  const [button1Color, setButton1Color] = useState<string>('#FFFFFF');
  const [button2Color, setButton2Color] = useState<string>('#000000');
  const [activeButton, setActiveButton] = useState<ActiveButton>(null);
  const [currentNumber, setCurrentNumber] = useState<number>(90);
  const [buttonPercent, setButtonPercent] = useState<number>(0);
  const [dynamicGradientStops, setDynamicGradientStops] = useState<GradientStop[]>([]);
  const [activeDynamicStopIndex, setActiveDynamicStopIndex] = useState<number | null>(null); // Nowy stan do śledzenia aktywnego dynamicznego przystanku

  // Przypisywanie koloru dla "pobiernika"
  const handleColorPickerChange = (newColor: string) => {
    if(activeButton === 'button1') {
      setButton1Color(newColor);
    } else if(activeButton === 'button2') {
      setButton2Color(newColor);
    } else if (activeButton === 'dynamic' && activeDynamicStopIndex !== null) {
        // Aktualizacja koloru aktywnego dynamicznego przystanku gradientu
        setDynamicGradientStops(prevStops => 
            prevStops.map((stop, index) => 
                index === activeDynamicStopIndex ? { ...stop, color: newColor } : stop
            )
        );
    }
  };

  const handleAddDynamicGradientStop = (color: string, percent: number) => {
    // Sprawdź, czy przystanek z tym samym procentem już istnieje, jeśli tak, zaktualizuj go
    // Ma to na celu zapobieganie wielu przystankom w dokładnie tej samej pozycji przy wielokrotnym klikaniu
    const existingIndex = dynamicGradientStops.findIndex(stop => stop.percent === percent);
    if (existingIndex !== -1) {
        setDynamicGradientStops(prevStops => 
            prevStops.map((stop, index) => 
                index === existingIndex ? { ...stop, color: color } : stop
            )
        );
        setActiveDynamicStopIndex(existingIndex);
    } else {
        setDynamicGradientStops(prevStops => {
            const newStops = [...prevStops, { color, percent }];
            // Posortuj przystanki według procentów, aby gradient był wyświetlany prawidłowo
            newStops.sort((a, b) => a.percent - b.percent);
            // Ustaw indeks aktywnego przystanku na nowo dodany/zaktualizowany
            setActiveDynamicStopIndex(newStops.findIndex(stop => stop.color === color && stop.percent === percent));
            return newStops;
        });
    }
  }

  const handleNewButtonColor = (color: string) => {
    setButtonColor(color);
  };

  // Funkcja służąca do przypisania id po kliknięciu w dany przycisk
  const handleColorBarButtonClick = (buttonId: ActiveButton) => {
    setActiveButton(buttonId);
    // Zresetuj indeks aktywnego dynamicznego przystanku, gdy kliknięto stały przycisk
    if (buttonId === 'button1' || buttonId === 'button2') {
        setActiveDynamicStopIndex(null);
    }
  };

  // Nowa funkcja do obsługi kliknięcia na dynamiczny przystanek
  const handleDynamicStopClick = (index: number, color: string) => {
    setActiveButton('dynamic');
    setActiveDynamicStopIndex(index);
    // Ustaw color picker na kolor klikniętego dynamicznego przystanku
    handleNewButtonColor(color); 
  };

  // Wyświetlanie koloru w "pobierniku" dla danego przycisku
  const initialColorForPicker = activeButton === 'button1'
    ? button1Color
    : activeButton === 'button2'
      ? button2Color 
      : (activeButton === 'dynamic' && activeDynamicStopIndex !== null)
        ? dynamicGradientStops[activeDynamicStopIndex]?.color // Wyświetl kolor aktywnego dynamicznego przystanku
        : '#ffffff' // Domyślny kolor

  const handleNumberUpdate = (newNumber: number) => {
      setCurrentNumber(newNumber);
  };

  // Upewnij się, że dynamicGradientStops są zawsze posortowane według procentów przed wygenerowaniem ciągu
  const sortedDynamicGradientStops = [...dynamicGradientStops].sort((a, b) => a.percent - b.percent);

  const dynamicGradientStopsString = sortedDynamicGradientStops
    .map(p => `${p.color} ${p.percent}%`)
    .join(', ');


  let fullGradientString = `${button1Color} 0%`;

  
  if (dynamicGradientStopsString) { // Dodaj dynamiczne przystanki tylko jeśli istnieją
      fullGradientString += `, ${dynamicGradientStopsString}`;
  }

  fullGradientString += `, ${button2Color} 100%`;

  const handleUpdateGradientStopPercent = (index: number, newPercent: number) => {
      // Zapobiegamy wyjściu poza zakres 0-100%
      const boundedPercent = Math.max(1, Math.min(99, newPercent));

      setDynamicGradientStops(prevStops => {
          // Zaktualizuj tylko procent dla przystanku o danym indeksie
          const newStops = prevStops.map((stop, i) => 
              i === index ? { ...stop, percent: boundedPercent } : stop
          );
          // Po aktualizacji, upewnij się, że lista jest posortowana,
          // co jest kluczowe dla poprawnego generowania gradientu
          return newStops.sort((a, b) => a.percent - b.percent);
      });
  };


  // Domyślny kontener
  return (
    <Router>
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
          onAddGradientStop={handleAddDynamicGradientStop}
          setNumberPercent={setButtonPercent}
          onNewButtonColorGenerated={handleNewButtonColor}
          gradientString={fullGradientString}
          dynamicGradientStops={sortedDynamicGradientStops}
          onDynamicStopClick={handleDynamicStopClick}
          onUpdateGradientStopPercent={handleUpdateGradientStopPercent} 
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
          gradientString={fullGradientString}
        />
        <ResetButton />
      </div>
    </div>
    </Router>
  );
}

export default App;