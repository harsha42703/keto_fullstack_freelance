import React, { useEffect, useState } from 'react';
import { useTheme } from './Context/ThemeProvider';

const ThemePicker: React.FC = () => {
  const { setColor, color } = useTheme(); // Assuming you have a color state in your context
  const [selectedColor, setSelectedColor] = useState('red'); // Default color

  useEffect(() => {
    setSelectedColor(color); // Set the initial state based on the current theme color
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    setSelectedColor(newColor); // Update the selected color state
  };

  return (
    <select value={selectedColor} onChange={handleColorChange} className="p-2 border rounded">
      <option value="blue">Blue</option>
      <option value="red">Red</option>
      <option value="green">Green</option>
      {/* Add more colors as needed */}
    </select>
  );
};

export default ThemePicker;
