import React from 'react'
import FooterImage from './../../public/assets/teamphoto.jpg'

const containerStyle: React.CSSProperties = {
    position: 'relative',
    height: '60vh', 
  };
  
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(	255, 224, 254)',
  };
  
  // Styl pro obrázek
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: '0.5',
  };
  
  // Styl pro text uprostřed obrázku
  const textStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white', 
    fontSize: '4vw', 
    textAlign: 'center',
    opacity: '100', 
    fontWeight: 'bold',

  };
  
  function FooterImg() {
    return (
      <div style={containerStyle}>
        <div style={overlayStyle}></div>
        <img src={FooterImage.src} alt="Týmový obrázek" style={imageStyle} />
        <div style={textStyle}>Enjoy and build your <span style={{ color: '#B71DDE' }}>team</span> </div>
      </div>
    );
  }
  
  export default FooterImg;