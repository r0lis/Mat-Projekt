import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import pictureForCarousel from "../../public/assets/ukazka1.png";
import pictureForCarousel2 from "../../public/assets/ukazka2.png";
import pictureForCarousel3 from "../../public/assets/ukazka3.png";
import pictureForCarousel4 from "../../public/assets/ukazka4.png";

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
    <>
      <Box sx={{ backgroundColor: "#F0F2F5" }}>
        <Box
          sx={{
            marginLeft: ["7%", "10%", "10%"],
            borderLeft: "6.5px solid #B71DDE",
            backgroundColor: "#F0F2F5",
            "@media screen and (max-width: 768px)": {
              borderLeft: "5px solid #B71DDE",
            },
          }}
        >
          <Box className="leftBorderDivText">
            <Box
              sx={{
                fontSize: "1.4vw",
                color: "black",
                position: "relative",
                paddingLeft: "5%",
                paddingTop: "5%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Typography
                sx={{
                  display: "block",
                  fontSize: ["3em", "3em", "2em"],
                  paddingTop: "6%",
                  paddingBottom: "5%",
                  fontWeight: "bold",
                  marginLeft: ["20%", "22%", "30%"],
                }}
              >
                Ukázky z <span style={{ color: "#B71DDE" }}>aplikace</span>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "white",
            paddingTop: "6%",
            paddingBottom: "4%",
            width: ["85%", "80%", "80%"],
            height: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.21)",
          }}
        >
          <Box sx={{ maxWidth: ["95%", "80%", "70%"], flexGrow: 1 }}>
            <AutoPlaySwipeableViews
              style={{ color: "purple" }}
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {images.map((step, index) => (
                <Box>
                  {Math.abs(activeStep - index) <= 2 ? (
                    <Box
                      component="img"
                      sx={{
                        height: "100%",
                        display: "block",
                        maxWidth: 900,
                        overflow: "hidden",
                        width: "100%",
                      }}
                      src={step.imgPath}
                    />
                  ) : null}
                </Box>
              ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
              steps={maxSteps}
              sx={{ backgroundColor: "white" }}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  sx={{ color: "purple" }}
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Next
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button
                  sx={{ color: "purple" }}
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
          </Box>
        </Box>{" "}
      </Box>
    </>
  );
};

export default SwipeableTextMobileStepper;
