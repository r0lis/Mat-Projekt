/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { authUtils } from "@/firebase/auth.utils";
import { gql, useQuery } from "@apollo/client";
import { Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";


const GET_COMPLETESUBTEAM_DETAILS = gql`
  query GetCompleteSubteamDetail($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      Name
      subteamId
      teamId
      subteamMembers {
        name
        surname
        picture
        email
        role
        position
      }
    }
  }
`;

const GET_SUBTEAM_DETAILS = gql`
  query GetSubteamDetails($subteamId: String!) {
    getSubteamDetails(subteamId: $subteamId) {
      Name
      subteamId
      teamId
      subteamMembers {
        email
        role
        position
      }
    }
  }
`;

interface SubteamMember {
  email: string;
  role: string;
  name: string;
  surname: string;
  picture: string;
  position: string;
}


const getPositionText = (position: string): string => {
  switch (position) {
    case "0":
      return "Není zvolena pozice";
    case "1":
      return "Správce";
    case "2":
      return "Hlavní trenér";
    case "3":
      return "Asistent trenéra";
    case "4":
      return "Hráč";
    default:
      return "";
  }
};

type ContentRousterProps = {
  idTeam: string;
  subteamId: string;
};

const ContentRouster: React.FC<ContentRousterProps> = ({
  subteamId,
  idTeam,
}) => {
  const user = authUtils.getCurrentUser();

  const { loading, error, data } = useQuery(GET_SUBTEAM_DETAILS, {
    variables: { subteamId },
    skip: !user,
  });

  const {
    loading: loadingComplete,
    error: errorComplete,
    data: dataComplete,
  } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: { subteamId },
    skip: !user,
  });

  if (loading || loadingComplete)
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
  if (error || errorComplete) return <Typography>Chyba</Typography>;

  const subteamMembers: SubteamMember[] = dataComplete.getCompleteSubteamDetail.subteamMembers.filter((member: SubteamMember) => member.position === "4");



  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Jméno</TableCell>
            <TableCell>Příjmení</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Pozice</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subteamMembers.map((member: SubteamMember, index: number) => (
            <TableRow key={index}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.surname}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{getPositionText(member.position)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContentRouster;
