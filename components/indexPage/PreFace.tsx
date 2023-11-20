import React from "react";
import pictureBackground from "../../public/assets/uvodni1.jpg";
import pictureAppPreviewForBackground from "../../public/assets/pictuteappforbackground.png";
import arrowRight from "../../public/assets/arrow-right.png";

const PreFace: React.FC = () => {
  return (
    <div className="imageContainerStyle">
      <div className="imageContainerStyle">
        <img
          src={pictureBackground.src}
          alt="Popis obrázku"
          className="imgStyle"
        />
      </div>
      <div className="textBlockStyle">
        <div className="bigTextStyle">WEBOVÁ APLIKACE PRO FLORBALOVÉ KLUBY</div>
        <div className="smallTextStyle">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean vel
          massa quis mauris vehicula lacinia. Curabitur sagittis hendrerit ante.
          Maecenas aliquet accumsan leegestas leo.
        </div>
        <div className="smallTextStyle2">
          <img
            src={arrowRight.src}
            alt="arrowRight"
            className="arrowRightPicture"
          />{" "}
          OBJEV VÝHODY
          <div className="seeFeaturesStyle">See features</div>
        </div>
      </div>
      <div className="appPreviewStyle">
        <img
          src={pictureAppPreviewForBackground.src}
          alt="Popis obrázku"
          className="imgStyle"
        />
      </div>
    </div>
  );
};

export default PreFace;
