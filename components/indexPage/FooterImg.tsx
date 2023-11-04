import React from 'react'
import FooterImage from './../../public/assets/teamphoto.jpg'

  const FooterImg: React.FC = () => {
    return (
      <div className='containerStyle'>
        <div className='overlayStyle'></div>
        <img src={FooterImage.src} alt="Týmový obrázek" className='imageStyle' />
        <div className='textStyle'>Enjoy and build your <span style={{ color: '#B71DDE' }}>team</span> </div>
      </div>
    );
  }
  
  export default FooterImg;