/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_TEAM_MEMBERS_DETAILS = gql`
  query GetTeamMembersDetails($teamId: String!) {
    getTeamMembersDetails(teamId: $teamId) {
      Name
      Surname
      Role
      Email
      Picture
      phoneNumber
      DateOfBirth
      Subteams {
        Name
        subteamId
      }
    }
  }
`;

type Props = {
  id: string;
};

const formatPhoneNumber = (phoneNumber: string | undefined) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{1,3})(\d{1,3})?(\d{1,3})?(\d{1,3})?$/);
  if (match) {
    return (
      "+ 420 " +
      match[1] +
      (match[2] ? " " + match[2] : "") +
      (match[3] ? " " + match[3] : "") +
      (match[4] ? " " + match[4] : "")
    );
  }
  return phoneNumber;
};

const Contacts: React.FC<Props> = ({ id }) => {
  const { loading: loadingDetails, error: errorDetails, data: dataDetails } = useQuery(GET_TEAM_MEMBERS_DETAILS, {
    variables: { teamId: id },
});

  if (loadingDetails) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  }

  if (errorDetails) {
    return <Typography>Chyba</Typography>;
  }

  const teamMembers = dataDetails?.getTeamMembersDetails || [];

  return (
    <Box sx={{marginLeft:"2%", marginRight:"2%"}}>
      {teamMembers.length > 0 ? (
        <Box>
          <Box sx={{marginLeft:"2%", paddingTop:"0.5em"}}>
          <Typography variant="h5">Management</Typography>
          </Box>
          <Box sx={{marginLeft:"2%", marginRight:"2%"}}>
          <Table>
            <TableBody>
              {teamMembers
                .filter((member: any) => member.Role === "1")
                .map((member: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{member.Name} {member.Surname}</TableCell>
                    <TableCell>{member.Email}</TableCell>
                    <TableCell>{formatPhoneNumber(member.phoneNumber)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          </Box>
          <Box sx={{marginLeft:"2%", paddingTop:"0.5em"}}>
          <Typography variant="h5">Trenéři</Typography>
          </Box>
          <Box sx={{marginLeft:"2%", marginRight:"2%"}}>
          <Table>
            <TableBody>
              {teamMembers
                .filter((member: any) => member.Role === "2")
                .map((member: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{member.Name} {member.Surname}</TableCell>
                    <TableCell>{member.Email}</TableCell>
                    <TableCell>{formatPhoneNumber(member.phoneNumber)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          </Box>
        </Box>
      ) : (
        <Typography variant="body1">No team members found.</Typography>
      )}
    </Box>
  );
  
};

export default Contacts;
