import React from 'react';
import pictureBackground from '../../public/uvodni1.jpg';
import pictureAppPreviewForBackground from '../../public/pictuteappforbackground.png';
import arrowRight from '../../public/arrow-right.png';

const PreFace = () => {
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
        <div style={imageContainerStyle}>
            <div style={imgContainerStyle}>
                <img src={pictureBackground.src} alt="Popis obrázku" style={imgStyle} />
            </div>
            <div style={textBlockStyle}>
                <div style={bigTextStyle}>WEBOVÁ APLIKACE PRO FLORBALOVÉ KLUBY</div>
                <div style={smallTextStyle}>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean vel massa quis
                    mauris vehicula lacinia. Curabitur sagittis hendrerit ante. Maecenas aliquet
                    accumsan leegestas leo.
                </div>
                <div style={smallTextStyle2}>
                    <img src={arrowRight.src} alt='arrowRight' style={arrowRightPicture} />  OBJEV VÝHODY
                    <div style={seeFeaturesStyle}>See features</div>
                </div>
            </div>
            <div style={appPreviewStyle}>
                <img src={pictureAppPreviewForBackground.src} alt="Popis obrázku" style={imgStyle} />
            </div>
        </div>
    );
};

export default PreFace;