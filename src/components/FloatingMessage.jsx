import React, { useEffect, useState } from 'react';
import './FloatingMessage.css'; // Import the CSS file for styling

const FloatingMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`floating-message ${isVisible ? 'visible' : 'hidden'}`}>
      {message}
    </div>
  );
};

export default FloatingMessage;