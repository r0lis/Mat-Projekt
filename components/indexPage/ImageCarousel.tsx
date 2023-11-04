import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
//ts-ignore
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import pictureForCarousel from '../../public/assets/AppPreview.jpg';
import pictureForCarousel2 from '../../public/assets/AppPreview2.png';
import pictureForCarousel3 from '../../public/assets/AppPreview3.jpg';
import pictureForCarousel4 from '../../public/assets/AppPreview4.jpg';



const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
    {

        imgPath: pictureForCarousel.src,
    },
    {

        imgPath: pictureForCarousel2.src,
    },
    {

        imgPath: pictureForCarousel3.src,
    },
    {


        imgPath: pictureForCarousel4.src,
    },
];

const SwipeableTextMobileStepper: React.FC = () => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };


    return (
        <><div className="leftBorderDiv"><div className='leftBorderDivText'><div className="appContentText">
        <Typography sx={{ display: 'block',  fontSize: '2.2vw', paddingTop: '6%', paddingBottom: '5%', fontWeight: 'bold', marginLeft:'30%' }}>
            Ukázky z <span style={{ color: '#B71DDE' }}>aplikace</span>
        </Typography></div>
    </div></div><div className="divCarousel">
                <Box sx={{ maxWidth: '70%', flexGrow: 1 }}>

                    <AutoPlaySwipeableViews
                        style={{ color: 'purple' }}
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {images.map((step, index) => (
                            <div>
                                {Math.abs(activeStep - index) <= 2 ? (
                                    <Box
                                        component="img"
                                        sx={{
                                            height: '100%',
                                            display: 'block',
                                            maxWidth: 900,
                                            overflow: 'hidden',
                                            width: '100%',
                                        }}
                                        src={step.imgPath} />
                                ) : null}
                            </div>
                        ))}
                    </AutoPlaySwipeableViews>
                    <MobileStepper
                        steps={maxSteps}
                        className="mobileStepperStyle"
                        position="static"
                        activeStep={activeStep}
                        nextButton={<Button
                            sx={{ color: 'purple' }}
                            size="small"
                            onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}
                        >
                            Next
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowLeft />
                            ) : (
                                <KeyboardArrowRight />
                            )}
                        </Button>}
                        backButton={<Button sx={{ color: 'purple' }} size="small" onClick={handleBack} disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowRight />
                            ) : (
                                <KeyboardArrowLeft />
                            )}
                            Back
                        </Button>} />
                </Box>
            </div></>

    );
}

export default SwipeableTextMobileStepper;