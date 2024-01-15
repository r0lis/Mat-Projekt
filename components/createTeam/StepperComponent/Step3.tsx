import React from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery, gql } from "@apollo/client";

type Step3Props = {
  teamEmail: string;
  onCompleteStep: () => void;
};

const GET_TEAM_DETAILS = gql`
  query GetTeamDetails($email: String!) {
    getTeamByEmail(email: $email) {
      AdminEmail
      Email
      Logo
      Name
      OwnerName
      OwnerSurname
      Place
      TimeCreated
      teamId
    }
  }
`;

const Step3: React.FC<Step3Props> = ({ teamEmail, onCompleteStep }) => {
  const { loading, error, data } = useQuery(GET_TEAM_DETAILS, {
    variables: { email: teamEmail },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const teamDetails = data.getTeamByEmail;


  return (
    <Box sx={{ margin: "0 auto", marginTop: 10, paddingBottom: "4em" }}>
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
        <Box>
          <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
            Zkontrolujte údaje Klubu
          </Typography>
        </Box>

        <Box sx={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell variant="head">Email klubu</TableCell>
                  <TableCell>{teamDetails.Email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Název klubu</TableCell>
                  <TableCell>{teamDetails.Name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Logo</TableCell>
                  <TableCell>
                    <img
                      src={teamDetails.Logo}
                      alt="Logo"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Jméno vlastníka</TableCell>
                  <TableCell>{teamDetails.OwnerName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Příjmení vlastníka</TableCell>
                  <TableCell>{teamDetails.OwnerSurname}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Místo</TableCell>
                  <TableCell>{teamDetails.Place}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Button
          sx={{
            backgroundColor: "rgb(255, 224, 254)",
            padding: "1em",
            border: "1px solid rgb(255, 150, 252)",
            marginLeft: "40%", // Adjust the margin as needed
            marginRight: "auto",
            marginTop: "2em",
            width: "14em",
          }}
          onClick={onCompleteStep}
        >
          <Typography sx={{ fontWeight: "bold", color: "black" }}>
            Dokončit
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default Step3;
