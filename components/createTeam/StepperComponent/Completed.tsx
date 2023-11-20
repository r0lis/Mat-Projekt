/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql, useQuery } from "@apollo/client";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";


type CompletedProps = {
  teamEmail: string;
};

const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($teamEmail: String!) {
    getTeamMembersByEmail(teamEmail: $teamEmail)
  }
`;

const Completed: React.FC<CompletedProps> = ({ teamEmail }) => {
  const [progress, setProgress] = React.useState(0);
  const [showLinearProgress, setShowLinearProgress] = useState(false);

  const { loading, error, data } = useQuery(GET_TEAM_MEMBERS, {
    variables: { teamEmail },
  });

  const handleButtonClick = async () => {
    const members = data?.getTeamMembersByEmail || [];

    try {
      setShowLinearProgress(true); // Show LinearProgress
      await axios.post('/api/sendEmail', { emails: members });
      console.log('E-maily úspěšně odeslány.');
      // Zvyšování hodnoty progress každou sekundu až na 100
    let currentProgress = 0;
    const intervalId = setInterval(() => {
      currentProgress += 20; // Zvyšte hodnotu podle potřeby
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 100) {
        clearInterval(intervalId);
        setShowLinearProgress(false);
      }
    }, 1000);
    } catch (error) {
      console.error('Chyba při odesílání e-mailů:', error);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {}, 4000);

    return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
  }, []); // Empty dependency array to run the effect only once

  const members = data?.getTeamMembersByEmail || [];

  if (loading) {
    return <CircularProgress />;
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
              <Typography variant="h6">Team Members:</Typography>
              <ul>
                {members.map((member: string, index: number) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            </div>
          ) : (
            <Typography variant="body1">No team members found.</Typography>
          )}
          
          

          <Box sx={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
            <Alert severity="success">
              Tým byl úspěšně vytvořen! Jste přesunuti na hlavní stránku.
            </Alert>
          </Box>

          

          {showLinearProgress && (
        <Box sx={{ textAlign: "center", marginTop: "2em" }}>
          <Box sx={{ width: "50%", marginLeft: "auto", marginRight: "auto", marginBottom:'1em' }}>
            <Alert severity="warning">
              Uživatelům které jste přidali do týmu byl odeslán e-mail pro přidání do týmu.
            </Alert>
          </Box>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            sx={{ marginTop: "2em" }}
          >
            Zpět na úvodní stránku
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Completed;
