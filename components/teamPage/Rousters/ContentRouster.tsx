/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
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

const GET_USER_ROLE_IN_TEAM = gql`
  query GetUserRoleInTeam($teamId: String!, $email: String!) {
    getUserRoleInTeam(teamId: $teamId, email: $email) {
      email
      role
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
  const user = authUtils.getCurrentUser();
  const [selectedMember, setSelectedMember] = useState<{
    name: string;
    surname: string;
    role: string;
    email: string;
    dateOfBirth: string;
    picture: string;
    position: string;

  } | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);


  const { loading, error, data } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: { subteamId },
  });

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: idTeam, email: user?.email || "" },
    skip: !user,
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

  if (loading || roleLoading)
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

  if (error || roleError) return <Typography>Chyba</Typography>;

  const role = roleData?.getUserRoleInTeam.role || "";

  const filteredMembersToShow = searchInput
    ? filteredMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          member.surname.toLowerCase().includes(searchInput.toLowerCase())
      )
    : filteredMembers;

  const handleRowClick = (member: SubteamMember) => {
    setSelectedMember(member);
    setSelectedRole(member.role);
    setModalOpen(true);

    // Update the selected index based on the filtered list
    setSelectedIndex(calculateSelectedIndex());
  };

  const calculateSelectedIndex = () => {
    if (selectedMember) {
      return filteredMembers.findIndex(
        (member) =>
          member.email === selectedMember.email &&
          member.role === selectedMember.role
      );
    }
    return null;
  };

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
              <TableCell>
                <Typography></Typography>
              </TableCell>
              <TableCell>
                <Typography></Typography>
              </TableCell>
              <TableCell>
                <Typography></Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody ref={tableBodyRef}>
            {filteredMembersToShow.map(
              (member: SubteamMember, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {role === "1" && (
                      <Box
                        sx={{ height: "20px", width: "20px" }}
                        onClick={() => handleRowClick(member)}
                      >
                        <ModeEditIcon />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Avatar
                      sx={{ width: 50, height: 50 }}
                      alt={member.name[0] + member.surname[0]}
                      src={member.picture}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{ fontFamily: "Roboto", fontWeight: "450" }}
                    >
                      {member.surname} {member.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{member.dateOfBirth}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{getPositionText(member.position)}</Typography>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ContentRouster;
