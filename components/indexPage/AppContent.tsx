import { Typography } from '@mui/material'
import React from 'react'
import comunicationImg from '../../public/assets/message.png';
import teamImg from '../../public/assets/network.png';
import listHospitalImg from '../../public/assets/patient.png';
import trainingPlanImg from '../../public/assets/training.png';
import Settings from "../../public/assets/Settings.png";


const AppContent: React.FC = () => {

    return (
        <div style={{zIndex:'-999', backgroundColor:'#F0F2F5'}} >

            <div className='mainDiv'>
                <div style={{ backgroundColor: '#F0F2F5' }} className='divAppContent2'>
                    <div className='appContentTextContent'>
                        <Typography sx={{ fontSize: '2vw', fontWeight: 'bold' }}>
                            Co aplikace <span style={{ color: '#B71DDE' }}>poskytuje</span> ?
                        </Typography>
                    </div>
                    <div style={{ backgroundColor: '#F0F2F5' }} className='leftBorderDiv'>
                        <div className='leftBorderPseudoElement'></div>
                        <div className='DivBlock'>
                            <div className='featuresDiv'>
                                <img className='iconStyle' src={comunicationImg.src} />
                                Skvělá komunikace v klubu
                            </div>
                        </div>
                    </div>
                    <div className='leftBorderDiv'>
                        <div className='leftBorderPseudoElement'></div>
                        <div className='featuresDiv'><img className='iconStyle' src={Settings.src} /> Správa více týmů v klubu</div>
                    </div>
                    <div className='leftBorderDiv'>
                        <div className='leftBorderPseudoElement'></div>
                        <div className='featuresDiv'><img className='iconStyle' src={teamImg.src} /> Tvoření soupisek, přehled docházky událostí</div>
                    </div>
                    <div className='leftBorderDiv'>
                        <div className='leftBorderPseudoElement'></div>
                        <div className='featuresDiv'><img className='iconStyle' src={trainingPlanImg.src} /> Tvoření tréninkových plánů</div>
                    </div>
                    <div className='leftBorderDiv'>
                        <div className='leftBorderPseudoElement'></div>
                        <div className='lastfeaturesDiv'><img className='iconStyle' src={listHospitalImg.src} /> Zdravotní prohlídky</div>


                    </div>
                </div>
            </div>

        </div>


    )
}

export default AppContent