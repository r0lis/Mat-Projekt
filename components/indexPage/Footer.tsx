import React from 'react';
import FacebookIcon from '../../public/assets/facebook.png';
import InstagramIcon from '../../public/assets/instagram.png';
import TwitterIcon from '../../public/assets/twitter.png';

function Footer() {
    const footerContainerStyle: React.CSSProperties = {
        borderTop: '7px solid #B71DDE',
        marginTop: '5%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
    };

    const columnStyle: React.CSSProperties = {
        flex: '1',
        textAlign: 'left',
        fontSize: '1.4vw',
        fontStyle: 'bold',
        fontWeight: 'bold',
    };

    const todoStyle: React.CSSProperties = {
        display: 'flex',
        marginLeft: '15%',
        marginRight: 'auto',
        flex: '3',
    };

    const footerBarStyle: React.CSSProperties = {
        backgroundColor: '#B71DDE',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.4vw',
    };

    const socialIconStyle: React.CSSProperties = {
        marginRight: '4%',
        width: '2.5em',
        height: '2.5em',
    };

    return (
        <>
            <div style={footerContainerStyle}>
                <div style={todoStyle}>
                    <div style={columnStyle}>
                        <p>LOGO NAZEV</p>
                        <span style={{ fontSize: '1.2vw' }}>
                            <p>eSports.cz, s.r.o.</p>
                            <p>Jeřabinová 836/30</p>
                            <p>326 00 Plzeň</p>
                            <p>IČ: 26340933</p>
                            <p>DIČ: CZ 26340933</p>
                        </span>
                    </div>

                    <div style={columnStyle}>
                        <p>Pro více informací nás kontaktujte</p>
                        <span style={{ fontSize: '1.2vw' }}>
                            <p>firma@esports.cz</p>
                            <p>Lukáš Rolenec</p>
                            <p>rilencrtgr@esports.cz</p>
                            <p>999 999 999</p>
                        </span>
                    </div>

                    <div style={columnStyle}>
                        <p>Sledujte nás na sítích</p>
                        <img src={FacebookIcon.src} alt="Facebook" style={socialIconStyle} />
                        <img src={InstagramIcon.src} alt="Instagram" style={socialIconStyle} />
                        <img src={TwitterIcon.src} alt="Twitter" style={socialIconStyle} />
                    </div>
                </div>
            </div>
            <div style={footerBarStyle}>LOGO</div>
        </>
    );
}

export default Footer;
