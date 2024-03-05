import React from "react";
import Box from "@mui/material/Box";
import Stepper from "../components/createTeam/Stepper";
import { authUtils } from "@/firebase/auth.utils";
import LoginError from "../components/teamPage/error/LoginError";

const CreateTeam: React.FC = () => {
  const user = authUtils.getCurrentUser();

  return (
    <>
      <Box>
        {user ? ( 
          <Stepper />
        ) : (
          <LoginError />
        )}
      </Box>
    </>
  );
};

export default CreateTeam;
  