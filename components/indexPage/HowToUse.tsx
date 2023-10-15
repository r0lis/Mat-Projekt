import { Typography } from '@mui/material';
import React from 'react';
import LeftDownArr from '../../public/arrowLeftDown.png';
import RightDownArr from '../../public/arrowRightDown.png';



function HowToUse() {
    const appContentText: React.CSSProperties = {
        fontSize: '1.2vw',
        color: 'black',
        paddingLeft: '5%',
        paddingTop: '5%',
    };

    const divAppContent: React.CSSProperties = {
        borderLeft: '7px solid #B71DDE',
        position: 'relative',
        marginLeft: '10%',
    };

    const howToUseDiv: React.CSSProperties = {
        marginBottom: '8%',
        width: '50%',
        height: '10em',
        marginLeft: '1.5%',
        marginRight: '0',
        border: '3px solid black',
        borderRadius: '30px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1.8vw',
        background: 'linear-gradient(to bottom, #B71DDE 20%, #EBEBEB 20%)',
    };
    const howToUseDiv2: React.CSSProperties = {
        marginBottom: '8%',
        width: '50%',
        height: '10em',
        marginRight: '0',
        border: '3px solid black',
        borderRadius: '30px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1.8vw',
        background: 'linear-gradient(to bottom, #B71DDE 20%, #EBEBEB 20%)',
    };

    const howToUseDiv3: React.CSSProperties = {
        marginBottom: '8%',
        width: '50%',
        height: '10em',
        marginRight: '0',
        marginLeft: '37%',
        border: '3px solid black',
        borderRadius: '30px',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1.8vw',
        background: 'linear-gradient(to bottom, #B71DDE 20%, #EBEBEB 20%)',
    };

    

    const leftBorderDiv: React.CSSProperties = {
        position: 'relative',
        marginLeft: '14%',
    };

    const StepDiv: React.CSSProperties = {
        display: 'block', 
        paddingTop: '1.5%',

    };

    const DecsDiv: React.CSSProperties = {
        paddingLeft: '5%',
        paddingTop: ' 10%',
        paddingBottom: 'auto',
        marginRight: '5%',
        display: 'block', 
    };

    const RightDownArrStyle: React.CSSProperties = {
        width: '10%',
        height: '10%',
        left:'0',
        marginTop: '20%',
    };

    const LeftDownArrStyle: React.CSSProperties = {
        width: '10%',
        height: '10%',
        left:'0',
        marginTop: '20%',
        marginLeft: '25%',
    };


    return (
        <div style={divAppContent}>
            <div style={appContentText}>
                <Typography sx={{ display: 'block', marginLeft: '30%', fontSize: '2.2vw', paddingTop: '6%', paddingBottom: '5%', fontWeight: 'bold' }}>
                    Jak začít aplikaci <span style={{ color: '#B71DDE' }}>používat</span> ?
                </Typography>
            </div>
            <div style={leftBorderDiv}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={howToUseDiv}>
                        <div style={StepDiv}>
                            <Typography sx={{ top: '0%',  color: 'white', fontSize: '1.5vw' }}>Step 1</Typography>
                        </div>
                        <div style={DecsDiv}>
                            <Typography sx={{fontSize:'1.2vw', textAlign:'center', justifyContent:'center'}}>
                                popis ffefefefefefefefefeeeeeeeeeeeeeeeeeeeeeeeeeeef fef efefe fe fe fe edwdwdwdwdwdwdwdwdwdw
                            </Typography>
                        </div>
                    </div>
                    <img style={RightDownArrStyle} src={RightDownArr.src} alt="arrow" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <img style={LeftDownArrStyle} src={LeftDownArr.src} alt="arrow" />
                    <div style={howToUseDiv2}>
                        <div style={StepDiv}>
                            <Typography sx={{ top: '0%',  color: 'white', fontSize: '1.5vw' }}>Step 2</Typography>
                        </div>
                        <div style={DecsDiv}>
                            <Typography sx={{fontSize:'1.2vw', textAlign:'center', justifyContent:'center'}}>
                                popis ffefefefefefefefefeeeeeeeeeeeeeeeeeeeeeeeeeeef fef efefe fe fe fe edwdwdwdwdwdwdwdwdwdw
                            </Typography>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={howToUseDiv}>
                        <div style={StepDiv}>
                            <Typography sx={{ top: '0%',  color: 'white', fontSize: '1.5vw' }}>Step 3</Typography>
                        </div>
                        <div style={DecsDiv}>
                            <Typography sx={{fontSize:'1.2vw', textAlign:'center', justifyContent:'center'}}>
                                popis ffefefefefefefefefeeeeeeeeeeeeeeeeeeeeeeeeeeef fef efefe fe fe fe edwdwdwdwdwdwdwdwdwdw
                            </Typography>
                        </div>s
                    </div>
                    <img style={RightDownArrStyle} src={RightDownArr.src} alt="arrow" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={howToUseDiv3}>
                        <div style={StepDiv}>
                            <Typography sx={{ top: '0%',  color: 'white', fontSize: '1.5vw' }}>Last Step </Typography>
                        </div>
                        <div style={DecsDiv}>
                            <Typography sx={{fontSize:'1.2vw', textAlign:'center', justifyContent:'center'}}>
                                popis ffefefefefefefefefeeeeeeeeeeeeeeeeeeeeeeeeeeef fef efefe fe fe fe edwdwdwdwdwdwdwdwdwdw
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HowToUse;
