import React from "react";
import FacebookIcon from "../../public/assets/facebook.png";
import InstagramIcon from "../../public/assets/instagram.png";
import TwitterIcon from "../../public/assets/twitter.png";

const Footer: React.FC = () => {
  return (
    <>
      <div className="footerContainerStyle">
        <div className="todoStyle">
          <div className="columnStyle">
            <p>LOGO ProFlorbal</p>
            <span style={{ fontSize: "1.2vw" }}>
              <p>Aplikace pro florbalové kluby</p>
              <p>Efektivní komunikace</p>
              <p>Vše na jednom místě</p>
              <p>Správa více týmů v jednom klubu</p>
             
            </span>
          </div>

          <div className="columnStyle">
            <p>Kontakty: </p>
            <span style={{ fontSize: "1.2vw" }}>
              <p>appteammanager@gmail.com</p>
              <p>Lukáš Rolenec</p>
              <p>luky.rolenec@seznam.cz</p>
              <p>+420 732 742 713</p>
            </span>
          </div>

          <div className="columnStyle">
            <p>Sledujte nás na sítích</p>
            <img
              src={FacebookIcon.src}
              alt="Facebook"
              className="socialIconStyle"
            />
            <img
              src={InstagramIcon.src}
              alt="Instagram"
              className="socialIconStyle"
            />
            <img
              src={TwitterIcon.src}
              alt="Twitter"
              className="socialIconStyle"
            />
          </div>
        </div>
      </div>
      <div className="footerBarStyle">LOGO</div>
    </>
  );
};

export default Footer;
