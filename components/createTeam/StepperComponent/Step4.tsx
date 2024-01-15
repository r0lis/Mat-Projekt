/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { authUtils } from "@/firebase/auth.utils";
import axios from "axios";

type Step4Props = {
  teamEmail: string;
  onCompleteStep: () => void;

};

const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($teamEmail: String!) {
    getTeamMembersByEmail(teamEmail: $teamEmail)
  }
`;

const GET_TEAM_ID = gql`
  query GetTeamIdByEmail($teamEmail: String!) {
    getTeamIdByEmail(teamEmail: $teamEmail) {
      teamId
    }
  }
`;

const UPDATE_TEAM_FINISHED = gql`
  mutation UpdateTeamFinished($teamEmail: String!) {
    updateTeamFinished(teamEmail: $teamEmail)
  }
`;

const Step4: React.FC<Step4Props> = ({ teamEmail, onCompleteStep }) => {
  const [progress, setProgress] = React.useState(0);
  const [showLinearProgress, setShowLinearProgress] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true); 
  const currentUserEmail = authUtils.getCurrentUser()?.email || "";

  const { loading, error, data } = useQuery(GET_TEAM_MEMBERS, {
    variables: { teamEmail },
  });

  const {
    loading: teamIdLoading,
    error: teamIdError,
    data: teamIdData,
  } = useQuery(GET_TEAM_ID, {
    variables: { teamEmail },
  });

  const [updateTeamFinished, { loading: updateLoading }] =
    useMutation(UPDATE_TEAM_FINISHED);

  const handleButtonClick = async () => {
    const membersData = data?.getTeamMembersByEmail || [];
    const members = membersData.filter((member: string) => member !== currentUserEmail);
    const { teamId } = teamIdData?.getTeamIdByEmail || {};

    try {
      setShowLinearProgress(true); // Show LinearProgress
      setButtonVisible(false);
      await axios.post("/api/sendEmail", { emails: members, teamId });
      console.log("E-maily úspěšně odeslány.");

      let currentProgress = 0;
      const intervalId = setInterval(() => {
        currentProgress += 20; 
        setProgress(Math.min(currentProgress, 100));

        if (currentProgress >= 100) {
          clearInterval(intervalId);
          setShowLinearProgress(false);
          updateTeamFinished({
            variables: { teamEmail },
          });
          onCompleteStep();
        }
      }, 1000);
    } catch (error) {
      console.error("Chyba při odesílání e-mailů:", error);
      setButtonVisible(true);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {}, 4000);

    return () => clearTimeout(timeoutId); 
  }, []); 

  const membersData = data?.getTeamMembersByEmail || [];
  const { teamId } = teamIdData?.getTeamIdByEmail || {};

  const members = membersData.filter((member: string) => member !== currentUserEmail);


  if (loading) {
    return(  <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        
      }}
    >
      <CircularProgress color="primary" size={50} />
    </Box>);
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <Box sx={{ margin: "0 auto", marginTop: 4 }}>
        <Box
          sx={{
            backgroundColor: "white",
            width: "60%",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "5%",
            marginTop: "6em",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
           {members.length > 0 ? (
            <div>
              <Box sx={{textAlign:'center'}}><Typography variant="h4">Dokončení</Typography></Box>
              
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Účty na které se zašle pozvánka do klubu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member: string, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{member}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Typography variant="body1">No team members found.</Typography>
          )}

          
          {showLinearProgress && (
            <Box sx={{ textAlign: "center", marginTop: "2em" }}>
              <Box
                sx={{
                  width: "50%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "1em",
                }}
              >
                <Alert severity="info">
                  Uživatelům které jste přidali do klubu byl odeslán e-mail s pozvánkou.
                </Alert>
              </Box>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}
          <Box sx={{ textAlign: "center" }}>
          {buttonVisible && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleButtonClick}
                sx={{
                  marginTop: "2em",
                  backgroundColor: "rgb(255, 224, 254)",
                  padding: "1em",
                  border: "1px solid rgb(255, 150, 252)",
                }}
              >
                <Typography sx={{ fontWeight: "bold", color: "black" }}>
                  Dokončit
                </Typography>
              </Button>
            )}
          </Box>
         
        </Box>
      </Box>
    </div>
  );
};

export default Step4;
