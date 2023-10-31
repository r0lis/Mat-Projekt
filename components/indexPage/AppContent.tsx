import { Typography } from '@mui/material'
import { features } from 'process';
import React from 'react'
import comunicationImg from '../../public/assets/message.png';
import teamImg from '../../public/assets/network.png';
import listHospitalImg from '../../public/assets/patient.png';
import teamPayImg from '../../public/assets/pay.png';
import trainingPlanImg from '../../public/assets/training.png';





function AppContent() {

    const appContentText: React.CSSProperties = {
        fontSize: '1.2vw',
        color: 'black',
        paddingLeft: '5%',
        paddingTop: '5%',
    };

    const divAppContent: React.CSSProperties = {
        borderLeft: '7px solid #B71DDE',
        position: 'relative',
        zIndex: '-999',
        marginLeft: '10%',
        alignItems: 'center',
    };

    const featuresDiv: React.CSSProperties = {
        marginTop: '8%',
        marginBottom: '8%',
        width: '50%',
        padding: '6% 10% 6% 10%',
        marginLeft: '1.5%',
        marginRight: 'auto',
        backgroundColor: '#FFE0FE',
        borderRadius: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
        display: 'flex',
        fontSize: '1.8vw',
        alignItems: 'center',
    };
    const lastfeaturesDiv: React.CSSProperties = {
        marginTop: '8%',
        width: '50%',
        padding: '6% 10% 6% 10%',
        marginLeft: '1.5%',
        marginRight: 'auto',
        backgroundColor: '#FFE0FE',
        borderRadius: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
        display: 'flex',
        fontSize: '1.8vw',
        alignItems: 'center',
    };
    

    const iconStyle: React.CSSProperties = {
        width: '10%',
        marginRight: '5%',
    };

    const leftBorderDiv: React.CSSProperties = {
        position: 'relative',
        marginLeft: '14%',
    };

    const leftBorderPseudoElement: React.CSSProperties = {
        content: "''",
        position: 'absolute',
        top: '0',
        left: '-5px',
        height: '100%',
        width: '7px',
        backgroundColor: '#B71DDE',
        borderRadius: '10px 10px 10px 10px',
    };


    const DivBlock: React.CSSProperties = {
        textAlign: 'center',
        justifyContent: 'center'
    };



    return (
        <div style={divAppContent}>
            <div style={appContentText}>
                <Typography sx={{ fontSize: '2.2vw', fontWeight: 'bold' }}>
                    Co aplikace <span style={{ color: '#B71DDE' }}>poskytuje</span> ?
                </Typography>
            </div>
            <div style={leftBorderDiv}>
                <div style={leftBorderPseudoElement}></div>
                <div style={DivBlock}>
                    <div style={featuresDiv}>
                        <img style={iconStyle} src={comunicationImg.src} />
                        Skvělá komunikace v týmu
                    </div>
                </div>
            </div>
            <div style={leftBorderDiv}>
                <div style={leftBorderPseudoElement}></div>
                <div style={featuresDiv}><img style={iconStyle} src={teamPayImg.src} /> Správa plateb a členských příspěvků</div>
            </div>
            <div style={leftBorderDiv}>
                <div style={leftBorderPseudoElement}></div>
                <div style={featuresDiv}><img style={iconStyle} src={teamImg.src} /> Tvoření soupisek, přehled docházky</div>
            </div>
            <div style={leftBorderDiv}>
                <div style={leftBorderPseudoElement}></div>
                <div style={featuresDiv}><img style={iconStyle} src={trainingPlanImg.src} /> Tvoření treninkových plánů</div>
            </div>
            <div style={leftBorderDiv}>
                <div style={leftBorderPseudoElement}></div>
                <div style={lastfeaturesDiv}><img style={iconStyle} src={listHospitalImg.src} /> Zdravotní prohlídky a dokumentace</div>
            

        </div>
        </div>
    )
}

export default AppContent