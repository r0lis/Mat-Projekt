/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useRef, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
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
  Button,
  Modal,
  FormControl,
  MenuItem,
  Select,
  Alert,
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
        playPosition
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

const UPDATE_SUBTEAM_MEMBER = gql`
  mutation UpdatePositionSubteamMember(
    $subteamId: String!
    $email: String!
    $playPosition: String!
  ) {
    updatePositionSubteamMember(
      subteamId: $subteamId
      email: $email
      playPosition: $playPosition
    )
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
  playPosition: string;
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
    playPosition: string;
  } | null>(null);
  const [, setSelectedRole] = useState("");
  const [, setSelectedIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const currentUserEmail = user?.email || "";
  const [modalOpen, setModalOpen] = useState(false);
  const [updateSubteamMember] = useMutation(UPDATE_SUBTEAM_MEMBER);

  const { loading, error, data, refetch } = useQuery(
    GET_COMPLETESUBTEAM_DETAILS,
    {
      variables: { subteamId },
    }
  );

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

  const handleCloseModal = () => {
    setSelectedMember(null);
    setModalOpen(false);
    setEditMode(false);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const calculateAge = (dateOfBirth: string) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  async function handleUpdateMember(): Promise<void> {
    try {
      console.log("selectedMember", selectedMember);
      // Ensure selectedMember exists and has a valid email and position
      if (
        selectedMember &&
        selectedMember.email &&
        selectedMember.playPosition
      ) {
        // Call the updateSubteamMember mutation
        await updateSubteamMember({
          variables: {
            subteamId: subteamId,
            email: selectedMember.email,
            playPosition: selectedMember.playPosition,
          },
        });

        // Optionally, you can reset the state or perform other actions after a successful update
        setEditMode(false);
        refetch();
        // ... any other actions you need
      } else {
        console.error("Invalid selected member data");
      }
    } catch (error) {
      console.error("Error updating subteam member:", error);
    }
  }

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
          <TableHead></TableHead>
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
                    <Typography sx={{ fontFamily: "Roboto" }}>
                      {member.dateOfBirth &&
                        new Date(member.dateOfBirth).toLocaleDateString(
                          "cs-CZ",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}{" "}
                      / {calculateAge(member?.dateOfBirth || "")} let
                    </Typography>
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
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            width: 400,
            backgroundImage: editMode
              ? `
            linear-gradient(to bottom, #808080 0, #909090 100px, #ffffff 100px, #ffffff calc(100% - 140px), #909090 calc(100% - 140px), #909090 100%)
          `
              : selectedMember && selectedMember.email == currentUserEmail
              ? `
            linear-gradient(to bottom, #808080 0, #909090 100px, #ffffff 100px, #ffffff calc(100% - 110px), #909090 calc(100% - 110px), #909090 100%)
          `
              : `
          linear-gradient(to bottom, #808080 0, #909090 100px, #ffffff 100px, #ffffff calc(100% - 100px), #909090 calc(100% - 100px), #909090 100%)
        `,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                fontFamily: "Roboto",
                fontWeight: "500",
                opacity: "0.6",
                marginLeft: "1em",
                top: "-10px",
                position: "relative",
              }}
            >
              člen
            </Box>
          </Box>
          <Box
            sx={{
              padding: "0em 0em 0em 1em",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{ marginBottom: "1em", top: "-10px", position: "relative" }}
            >
              <Typography id="modal-title" variant="h6" component="h2">
                {selectedMember?.name} {selectedMember?.surname}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                marginLeft: "0.5em",
                top: "-30px",
                right: "1em",
              }}
              alt="Remy Sharp"
              src={selectedMember?.picture}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ padding: "0em 2em 0em 2em" }}>
              <Typography
                id="modal-description"
                sx={{
                  marginTop: "1em",
                  fontFamily: "Roboto",
                  fontSize: "1em",
                  marginBottom: "1em",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                Věk:
              </Typography>
              <Typography
                id="modal-description"
                sx={{
                  marginTop: "1em",
                  fontFamily: "Roboto",
                  fontSize: "1em",
                  marginBottom: "1em",
                  whiteSpace: "nowrap",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                Datum narození:
              </Typography>

              <Typography
                id="modal-description"
                sx={{
                  marginTop: "1em",
                  fontFamily: "Roboto",
                  fontSize: "1em",
                  marginBottom: "1em",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                Email:
              </Typography>
              <Typography
                id="modal-description"
                sx={{
                  marginTop: "1em",
                  fontFamily: "Roboto",
                  fontSize: "1em",
                  marginBottom: "1em",
                  whiteSpace: "nowrap",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                Zdravotní prohlídka:
              </Typography>
              <Typography
                id="modal-description"
                sx={{
                  marginTop: selectedMember?.playPosition == null ?  "1.8em": "1em",
                  fontFamily: "Roboto",
                  fontSize: "1em",
                  marginBottom: "1em",
                  whiteSpace: "nowrap",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                Herní pozice:
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginRight: "2em",
              }}
            >
              <Typography
                id="modal-description"
                sx={{
                  marginTop: "1em",
                  marginBottom: "1em",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                {calculateAge(selectedMember?.dateOfBirth || "")} let
              </Typography>

              <Typography
                id="modal-description"
                sx={{ marginBottom: "1em", color: "black", fontWeight: "500" }}
              >
                {selectedMember?.dateOfBirth &&
                  new Date(selectedMember.dateOfBirth).toLocaleDateString(
                    "cs-CZ",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
              </Typography>
              <Typography
                id="modal-description"
                sx={{
                  marginBottom: "1em",
                  color: "black",
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedMember?.email}
              </Typography>

              <Typography
                id="modal-description"
                sx={{
                  marginBottom: "1em",
                  whiteSpace: "nowrap",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                do 2. 3. 2023
              </Typography>

              {editMode && selectedMember ? (
                <Box sx={{}}>
                  <FormControl fullWidth>
                    <Select
                      value={selectedMember.playPosition}
                      onChange={(e) => {
                        setSelectedMember((prevMember) => ({
                          ...(prevMember as SubteamMember), // Assert that prevMember is of type Member
                          playPosition: e.target.value as string,
                        }));
                        console.log("selectedMember", selectedMember);
                      }}
                    >
                      <MenuItem value="1">Správce</MenuItem>
                      <MenuItem value="2">Hlavní trenér</MenuItem>
                      <MenuItem value="3">Asistent trenéra</MenuItem>
                      <MenuItem value="4">Hráč</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              ) : (
                <Box sx={{}}>
                  <Typography
                    id="modal-description"
                    sx={{
                      marginBottom: "1em",
                      whiteSpace: "nowrap",
                      color: "black",
                      fontWeight: "500",
                    }}
                  >
                    {selectedMember?.playPosition ? (
                      getPositionText(selectedMember.playPosition)
                    ) : (
                      <Alert severity="warning">
                        Není zvoleno
                      </Alert>
                    )}
                  </Typography>
                  
                </Box>
              )}
            </Box>
          </Box>

          {editMode ? (
            <Box sx={{ paddingLeft: "1em" }}>
              <Button
                sx={{
                  backgroundColor: "lightgray",
                  color: "black",
                  marginTop: "4em",
                  padding: "1em",
                  height: "2.5em",
                  marginLeft: "-0.5em",
                  width: "100%",
                }}
                onClick={handleUpdateMember}
              >
                
                Uložit
              </Button>
              <Button
                sx={{
                  backgroundColor: "lightgray",
                  color: "black",
                  marginTop: "0.5em",
                  padding: "1em",
                  height: "2.5em",
                  marginLeft: "-0.5em",
                  width: "100%",
                }}
                onClick={() => setEditMode(false)}
              >
                Zavřít
              </Button>
            </Box>
          ) : (
            <Box sx={{ paddingLeft: "1em" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              ></Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between" }}
              ></Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    borderBottom: "2px solid gray", // Change the color as needed
                    position: "absolute",
                    top:
                      selectedMember?.role === "0" ||
                      selectedMember?.role === "No Role Assigned"
                        ? "81%"
                        : selectedMember &&
                          selectedMember.email === currentUserEmail
                        ? "68%"
                        : "79%",
                    transform: "translateY(-50%)",
                    marginLeft: "-3em",
                    zIndex: -1,
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: "500",
                    opacity: "0.6",
                    marginLeft: "-0.5em",
                    top: "-10px",
                    position: "relative",
                    marginTop: "2em",
                  }}
                >
                  Management
                </Box>
              </Box>

              <Button
                sx={{
                  backgroundColor: "lightgray",
                  color: "black",
                  padding: "1em",
                  height: "2em",
                  marginLeft: "-0.5em",
                  marginTop: "0.5em",
                  width: "100%",
                }}
                onClick={handleEditClick}
              >
                Upravit
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ContentRouster;
