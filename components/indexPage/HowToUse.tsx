import { Typography } from '@mui/material';
import React from 'react';
import LeftDownArr from '../../public/assets/arrowLeftDown.png';
import RightDownArr from '../../public/assets/arrowRightDown.png';


const HowToUse: React.FC = () => {

    return (
        <div style={{zIndex:'-999', backgroundColor:'#F0F2F5'}} >
            <div className="divAppContent2">
                <div className="appContentText2">
                    <Typography sx={{ display: 'block', marginLeft: '30%', fontSize: '2.2vw', paddingTop: '6%', paddingBottom: '5%', fontWeight: 'bold' }}>
                        Jak začít aplikaci <span style={{ color: '#B71DDE' }}>používat</span> ?
                    </Typography>
                </div>
                <div className="leftBorderDivBack">
                    <div className="leftBorderDiv">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="howToUseDiv">
                                <div className="StepDiv">
                                    <Typography sx={{ top: '0%', color: 'white', fontSize: '1.5vw', fontFamily:"Roboto", fontWeight:"500" }}>Krok 1</Typography>
                                </div>
                                <div className="DecsDiv">
                                    <Typography sx={{ fontSize: '1.4vw', textAlign: 'center', justifyContent: 'center',fontFamily:"Roboto", fontWeight:"500"  }}>
                                    Zaregistujte se do aplikace.
                                    </Typography>
                                </div>
                            </div>
                            <img className="RightDownArrStyle" src={RightDownArr.src} alt="arrow" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img className="LeftDownArrStyle" src={LeftDownArr.src} alt="arrow" />
                            <div className="howToUseDiv2">
                                <div className="StepDiv">
                                    <Typography sx={{ top: '0%', color: 'white', fontSize: '1.5vw',fontFamily:"Roboto", fontWeight:"500"  }}>Krok 2</Typography>
                                </div>
                                <div className="DecsDiv">
                                    <Typography sx={{ fontSize: '1.4vw', textAlign: 'center', justifyContent: 'center',fontFamily:"Roboto", fontWeight:"500"  }}>
                                        Vytvořte Vás klub, do apliace a pozvěte všechny členy klubu do akplikace.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="howToUseDiv">
                                <div className="StepDiv">
                                    <Typography sx={{ top: '0%', color: 'white', fontSize: '1.5vw',fontFamily:"Roboto", fontWeight:"500"  }}>Krok 3</Typography>
                                </div>
                                <div className="DecsDiv">
                                    <Typography sx={{ fontSize: '1.4vw', textAlign: 'center', justifyContent: 'center',fontFamily:"Roboto", fontWeight:"500"  }}>
                                        Dokončete nastavení klubu, práv, veškeré potřebné kroky pro kompletaci vytvoření klubu a začněte aplikaci používat.
                                    </Typography>
                                </div>
                            </div>
                            <img className="RightDownArrStyle" src={RightDownArr.src} alt="arrow" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="howToUseDiv3">
                                <div className="StepDiv">
                                    <Typography sx={{ top: '0%', color: 'white', fontSize: '1.5vw',fontFamily:"Roboto", fontWeight:"500"  }}>Poslední krok </Typography>
                                </div>
                                <div className="DecsDiv">
                                    <Typography sx={{ fontSize: '1.4vw', textAlign: 'center', justifyContent: 'center',fontFamily:"Roboto", fontWeight:"500"  }}>
                                        Začněte aplikaci používat a využívat všechny její funkce, mějte lepší přehled o svém klubu.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       

    );
}

export default HowToUse;
