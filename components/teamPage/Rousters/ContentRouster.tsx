/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  CircularProgress,
  Table,
  TableBody,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";

const GET_COMPLETESUBTEAM_DETAILS = gql`
  query GetCompleteSubteamDetail($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      subteamMembers {
        name
        surname
        dateOfBirth
        picture
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
  dateOfBirth: string;
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
  const [searchInput, setSearchInput] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<SubteamMember[]>([]);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const { loading, error, data } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: { subteamId },
  });

  useEffect(() => {
    if (data) {
      const subteamMembers: SubteamMember[] =
        data.getCompleteSubteamDetail.subteamMembers.filter(
          (member: SubteamMember) => member.position === "4"
        );
      setFilteredMembers(subteamMembers);
    }
  }, [data]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
  };

  const filteredMembersToShow = searchInput
    ? filteredMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          member.surname.toLowerCase().includes(searchInput.toLowerCase())
      )
    : filteredMembers;

  return (
    <Box>
      <Box
        sx={{
          marginLeft: "5%",
          marginRight: "5%",
          marginTop: "2em",
        }}
      >
        <Autocomplete
          options={filteredMembers}
          getOptionLabel={(option) => `${option.name} ${option.surname}`}
          filterOptions={(options, { inputValue }) =>
            options.filter(
              (option) =>
                option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                option.surname.toLowerCase().includes(inputValue.toLowerCase())
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Hledat podle jména a příjmení"
              variant="outlined"
              value={searchInput}
              sx={{ marginBottom: searchInput.length < 1 ? "0em" : "2em" }}
              onChange={handleSearchInputChange}
            />
          )}
        />
      </Box>

      <TableContainer
        sx={{
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "2em",
          marginBottom: "3em",
        }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Jméno</TableCell>
              <TableCell>Příjmení</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Pozice</TableCell>
            </TableRow>
          </TableHead>
          <TableBody ref={tableBodyRef}>
            {filteredMembersToShow.map((member: SubteamMember, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <Avatar
                    sx={{ width: 50, height: 50 }}
                    alt={member.name[0] + member.surname[0]}
                    src={member.picture}
                  />
                </TableCell>
                <TableCell>
                  {member.name} {member.surname}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{getPositionText(member.position)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ContentRouster;
