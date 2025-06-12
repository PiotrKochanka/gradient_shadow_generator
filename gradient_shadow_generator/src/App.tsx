import React, { useState } from 'react';
import './App.css';
import MyColorPicker from './components/MyColorPicker/MyColorPicker';

interface AppProps {
  initialAppColor?: string;
}

function App() {
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000');

  return (
    <div className="App">
      <MyColorPicker 
        initialColor={selectedColor}
      />
    </div>
  );
}

export default App;
