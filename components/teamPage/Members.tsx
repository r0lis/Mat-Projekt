/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_TEAM_MEMBERS_DETAILS = gql`
  query GetTeamMembersDetails($teamId: String!) {
    getTeamMembersDetails(teamId: $teamId) {
      Name
      Surname
      Role
    }
  }
`;

interface Member {
  Name: string;
  Surname: string;
  Role: string; // Assuming Role is of type string, adjust if necessary
}

type MembersProps = {
  id: string; // Assuming id is of type string
};

const MembersComponent: React.FC<MembersProps> = ({ id }) => {
  const { loading, error, data } = useQuery<{
    getTeamMembersDetails: Member[];
  }>(GET_TEAM_MEMBERS_DETAILS, {
    variables: { teamId: id },
  });

  if (loading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (error) return <p>Error: {error.message}</p>;

  const members = data?.getTeamMembersDetails || [];

  return (
    <Box>
      <Box sx={{ marginLeft: "1em" }}>
        <Typography
          sx={{ fontFamily: "Roboto", fontWeight: "500" }}
          variant="h4"
        >
          Členové týmu
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Jméno</TableCell>
              <TableCell>Přijmení</TableCell>
              <TableCell>Práva</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map(
              (member: Member, index: React.Key | null | undefined) => (
                <TableRow key={index}>
                  <TableCell>{member.Name}</TableCell>
                  <TableCell>{member.Surname}</TableCell>
                  <TableCell>{member.Role}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Link href={`/Team/AddMember/${id}/`}>
        <Button variant="contained">Přidat nového hráče</Button>
      </Link>
    </Box>
  );
};

export default MembersComponent;
