import React from 'react';
import pictureBackground from '../../public/assets/uvodni1.jpg';
import pictureAppPreviewForBackground from '../../public/assets/pictuteappforbackground.png';
import arrowRight from '../../public/assets/arrow-right.png';

const PreFace : React.FC = () => {
    const imageContainerStyle: React.CSSProperties = {
        width: '100%',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
    };

    const imgContainerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    };

    const imgStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
    };

    const textBlockStyle: React.CSSProperties = {
        width: '27%',
        position: 'absolute',
        left: '15%',
        height: '50%',
        marginTop: '0%',
        textAlign: 'left',
        padding: '1em',
        top: '10%',
    };

    const bigTextStyle: React.CSSProperties = {
        fontSize: '4vw',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        marginBottom: '10px',
    };

    const smallTextStyle: React.CSSProperties = {
        fontSize: '1.3vw',
        color: 'white',
    };

    const arrowRightPicture: React.CSSProperties = {
        height: '8%',
        width: '8%',
        marginRight: '2%',
    };

    const smallTextStyle2: React.CSSProperties = {
        fontSize: '1.4vw',
        color: 'black',
        display: 'flex',
        marginTop: '20%',
        width: '100%',
        marginLeft: '10%',
        alignItems: 'center',
        fontWeight: 'bold',
        paddingRight: '10%',
    };

    const seeFeaturesStyle: React.CSSProperties = {
        fontSize: '1.5vw',
        color: 'white',
        paddingLeft: '10%',
    };

    const appPreviewStyle: React.CSSProperties = {
        width: '32%',
        maxWidth: '100%',
        height: 'auto',
        position: 'absolute',
        right: '15%',
        top: '5%',
        transform: 'translateY(0)',
        zIndex: 1,
    };

    return (
        <div className="imageContainerStyle">
            <div className='imageContainerStyle'>
                <img src={pictureBackground.src} alt="Popis obrázku" className="imgStyle" />
            </div>
            <div className='textBlockStyle'>
                <div className='bigTextStyle'>WEBOVÁ APLIKACE PRO FLORBALOVÉ KLUBY</div>
                <div className='smallTextStyle'>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean vel massa quis
                    mauris vehicula lacinia. Curabitur sagittis hendrerit ante. Maecenas aliquet
                    accumsan leegestas leo.
                </div>
                <div className='smallTextStyle2'>
                    <img src={arrowRight.src} alt='arrowRight' className='arrowRightPicture' />  OBJEV VÝHODY
                    <div className='seeFeaturesStyle'>See features</div>
                </div>
            </div>
            <div className='appPreviewStyle'>
                <img src={pictureAppPreviewForBackground.src} alt="Popis obrázku" className="imgStyle" />
            </div>
        </div>
    );
};

export default PreFace;