import React from 'react';
import picture from '../public/uvodni.jpg';

const PreFace = () => {
  const imageContainerStyle = {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative', 
  };

  const imgContainerStyle = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
  };

  const textOverlayStyle = {
    position: 'absolute', 
    left: '10%', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    color: 'white',
    fontSize: '24px', 
    fontWeight: 'bold', 
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', 
  };

  return (
    <div style={imageContainerStyle}>
      <div style={imgContainerStyle}>
        <img src={picture.src} alt="Popis obrázku" style={imgStyle} />
      </div>
      <div style={textOverlayStyle}>Text uprostřed obrázku</div>
    </div>
  );
};

export default PreFace;