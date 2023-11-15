import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Step1 from "./StepperComponent/Step1";
import Step2 from "./StepperComponent/Step2";
import Step3 from "./StepperComponent/Step3";
import Navbar from "./StepperComponent/Navbar";
import Completed1 from "./StepperComponent/Completed1";
import Completed2 from "./StepperComponent/Completed2";
import Completed from "./StepperComponent/Completed";
import { useMutation, gql } from "@apollo/client";


const steps: string[] = [
  "Vyplňte potřebné informace",
  "Nastavení práv",
  "Kontrola údajů",
];

const DELETE_TEAM_MUTATION = gql`
  mutation DeleteTeam($email: String!) {
    deleteTeamByEmail(email: $email)
  }
`;

const StepperComponent: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>(
    {}
  );
  const [teamEmailNow, setTeamEmail] = React.useState<string>("");
  const [confirmUnload, setConfirmUnload] = React.useState<boolean>(false);


  const [deleteTeam] = useMutation(DELETE_TEAM_MUTATION, {
    variables: { email: teamEmailNow },
  });

  React.useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!allStepsCompleted() && !confirmUnload) {
        const confirmationMessage =
          'Opravdu chcete opustit stránku? Neuložené údaje budou ztraceny.';
        event.returnValue = confirmationMessage;
  
        // Zde je volání mutace pro smazání týmu
        
  
        // Nastavení confirmUnload na true a neprovádění smazání týmu
        setConfirmUnload(true);
  
        return confirmationMessage;
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [completed, confirmUnload, deleteTeam]);


  const totalSteps = (): number => {
    return steps.length;
  };

  const completedSteps = (): number => {
    return Object.keys(completed).length;
  };

  const isLastStep = (): boolean => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = (): boolean => {
    return completedSteps() === totalSteps();
  };

  const handleNext = (): void => {
    const newActiveStep: number =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((_, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => (): void => {
    setActiveStep(step);
  };

 

  const handleStepCompletion = (
    step: number,
    isStepCompleted: boolean,
    teamEmail: string
  ) => {
    const newCompleted = { ...completed };
    newCompleted[step] = isStepCompleted;
    setCompleted(newCompleted);
    setTeamEmail(teamEmail);
  };

  const getStepContent = (step: number): JSX.Element => {
    switch (step) {
      case 0:
        return completed[0] ? (
          <Completed1 />
        ) : (
          <Step1
            onCompleteTeamCreation={(teamEmail) =>
              handleStepCompletion(0, true, teamEmail)
            }
          />
        );
      case 1:
        return completed[1] ? (
          <Completed2 />
        ) : (
          <Step2
            teamEmail={teamEmailNow}
            onCompleteStep={() => handleStepCompletion(1, true, teamEmailNow)}
          />
        );
        case 2:
          return completed[2] ? (
            <Completed />
          ) : (
            <Step3
              teamEmail={teamEmailNow}
              onCompleteStep={() => handleStepCompletion(2, true, teamEmailNow)}
            />
          );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
        backgroundColor: "#F0F2F5",
        paddingBottom: "15%",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "#F0F2F5",
          zIndex: 100,
          textAlign: "center",
        }}
      >
        <Navbar />
        <Box></Box>
        <Box
          sx={{
            width: "80%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingTop: "2em",
            paddingBottom: "2em",
          }}
        >
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>

      <Box sx={{ marginTop: "2em" }}>
        <Box sx={{ paddingTop: "5em" }}>
          <div style={{ marginBottom: "20px" }}>
            {getStepContent(activeStep)}
          </div>

          <div>
            {allStepsCompleted() ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1, marginLeft:'30%', }}>
                  Všechny kroky k vytvoření týmu jste již dokončili
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Box
                  sx={{
                    position: "fixed",
                    width: "100%",
                    bottom: "0px",
                    zIndex: 1,
                    backgroundColor: "rgba(240, 242, 245, 0)",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ marginLeft: "5px" }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleNext} sx={{ mr: 1 }}>
                      Next
                    </Button>
                    {activeStep !== steps.length &&
                      (completed[activeStep] ? (
                        <Box sx={{marginRight:'1em'}}>
                          <Typography
                            variant="caption"
                            sx={{ display: "inline-block" }}
                          >
                            Krok {activeStep + 1} jste již dokončili
                          </Typography>
                        </Box>
                      ) : (
                        <Button >
                            
                        </Button>
                      ))}
                  </Box>
                </Box>
              </React.Fragment>
            )}
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default StepperComponent;
