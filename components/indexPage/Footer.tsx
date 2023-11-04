import React from 'react';
import FacebookIcon from '../../public/assets/facebook.png';
import InstagramIcon from '../../public/assets/instagram.png';
import TwitterIcon from '../../public/assets/twitter.png';

const Footer: React.FC = () => {

    return (
        <>
            <div className='footerContainerStyle'>
                <div className='todoStyle'>
                    <div className='columnStyle'>
                        <p>LOGO NAZEV</p>
                        <span style={{ fontSize: '1.2vw' }}>
                            <p>eSports.cz, s.r.o.</p>
                            <p>Jeřabinová 836/30</p>
                            <p>326 00 Plzeň</p>
                            <p>IČ: 26340933</p>
                            <p>DIČ: CZ 26340933</p>
                        </span>
                    </div>

                    <div className='columnStyle'>
                        <p>Pro více informací nás kontaktujte</p>
                        <span style={{ fontSize: '1.2vw' }}>
                            <p>firma@esports.cz</p>
                            <p>Lukáš Rolenec</p>
                            <p>rilencrtgr@esports.cz</p>
                            <p>999 999 999</p>
                        </span>
                    </div>

                    <div className='columnStyle'>
                        <p>Sledujte nás na sítích</p>
                        <img src={FacebookIcon.src} alt="Facebook" className='socialIconStyle' />
                        <img src={InstagramIcon.src} alt="Instagram" className='socialIconStyle'/>
                        <img src={TwitterIcon.src} alt="Twitter" className='socialIconStyle' />
                    </div>
                </div>
            </div>
            <div className='footerBarStyle'>LOGO</div>
        </>
    );
}

export default Footer;
