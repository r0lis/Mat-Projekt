/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
} from "@mui/material";
import { useQuery, gql, useMutation } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

const GET_COMPLETESUBTEAM_DETAILS = gql`
  query GetCompleteSubteamDetail($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      Name
      subteamId
      teamId
      subteamMembers {
        name
        surname
        email
        role
        position
      }
    }
  }
`;

const GET_MISSING_SUBTEAM_MEMBERS = gql`
  query GetMissingSubteamMembers($subteamId: String!) {
    getMissingSubteamMembers(subteamId: $subteamId) {
      email
      role
      name
      surname
    }
  }
`;

const UPDATE_SUBTEAM_MEMBERS = gql`
  mutation UpdateSubteamMembers(
    $subteamId: String!
    $updatedMembers: [UpdatedSubteamMemberInput!]!
  ) {
    updateSubteamMembers(subteamId: $subteamId, updatedMembers: $updatedMembers)
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
  mutation UpdateSubteamMember($subteamId: String!, $email: String!, $position: String!) {
    updateSubteamMember(subteamId: $subteamId, email: $email, position: $position)
  }
`;

type MembersProps = {
  subteamId: string;
  idTeam: string;
};

type Member = {
  name: string;
  surname: string;
  email: string;
  role: string;
  position: string;
};

type SubteamMember = {
  email: string;
  role: string;
  name: string;
  surname: string;
};

const getRoleText = (role: string): string => {
  switch (role) {
    case "0":
      return "Není zvolena práva";
    case "No Role Assigned":
      return "Není zvolena práva";
    case "1":
      return "Management";
    case "2":
      return "Trenér";
    case "3":
      return "Hráč";
    default:
      return "";
  }
};
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

const Members: React.FC<MembersProps> = (subteamId) => {
  const user = authUtils.getCurrentUser();
  const id = subteamId.subteamId;
  const [updateSubteamMembers] = useMutation(UPDATE_SUBTEAM_MEMBERS);
  const [addMember, setAddMember] = useState(false);
  const [editMember, setEditMember] = useState(false);
  const [addMembers, setAddMembers] = useState<
    { email: string; role: string; position: string }[]
  >([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const userEmail = user?.email;
  const [updateSubteamMember] = useMutation(UPDATE_SUBTEAM_MEMBER);

  const handleCheckboxChange = (
    email: string,
    role: string,
    position: string
  ) => {
    const memberIndex = addMembers.findIndex(
      (member) => member.email === email
    );

    if (role === "1") {
      // If Role is "1", do nothing, already handled in useEffect
    } else {
      if (memberIndex !== -1) {
        setAddMembers((prevMembers) => [
          ...prevMembers.slice(0, memberIndex),
          ...prevMembers.slice(memberIndex + 1),
        ]);
      } else {
        setAddMembers((prevMembers) => [
          ...prevMembers,
          { email, role: String(role), position },
        ]);
      }
    }
  };

  const { loading, error, data, refetch } = useQuery(
    GET_COMPLETESUBTEAM_DETAILS,
    {
      variables: { subteamId: id },
      skip: !user,
    }
  );

  const {
    loading: missingMembersLoading,
    error: missingMembersError,
    data: missingMembersData,
    refetch: missingMembersRefetch,
  } = useQuery(GET_MISSING_SUBTEAM_MEMBERS, {
    variables: { subteamId: id },
    skip: !user,
  });

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: subteamId.idTeam, email: userEmail },
    skip: !user,
  });

  if (loading || missingMembersLoading || roleLoading)
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
  if (error || missingMembersError || roleError)
    return <Typography>Chyba</Typography>;
  const subteam = data.getCompleteSubteamDetail;
  const missingMembers = missingMembersData.getMissingSubteamMembers;

  const handlePositionChange = (
    e: SelectChangeEvent<string>,
    email: string
  ) => {
    const newPosition = e.target.value;
    setAddMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.email === email ? { ...member, position: newPosition } : member
      )
    );
  };

  const handleConfirm = async () => {
    try {
      await updateSubteamMembers({
        variables: {
          subteamId: id,
          updatedMembers: addMembers,
        },
      });

      setAddMembers([]);
      setAddMember(false);
      refetch();
      await missingMembersRefetch();
    } catch (error) {
      console.error("Error updating subteam members:", error);
    }
  };

  const handleEditClick = (member: Member) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const role = roleData.getUserRoleInTeam.role;

  async function handleUpdateMember(): Promise<void> {
    try {
      // Ensure selectedMember exists and has a valid email and position
      if (selectedMember && selectedMember.email && selectedMember.position) {
        await updateSubteamMember({
          variables: {
            subteamId: id,
            email: selectedMember.email,
            position: selectedMember.position,
          },
        });

        setEditModalOpen(false);
        refetch();
      } else {
        console.error("Invalid selected member data");
      }
    } catch (error) {
      console.error("Error updating subteam member:", error);
    }
  }

  return (
    <Box sx={{paddingTop:"1.5em"}}>
      {addMember ? (
        <Box>
          <Box sx={{ marginLeft: "10%" }}>
            <Typography variant="h5">Přidání člena do týmu</Typography>
          </Box>
          <Box sx={{ marginTop: "1em", marginLeft: "auto", display: "block" }}>
            {missingMembers && missingMembers.length > 0 ? (
              <Box>
                <TableContainer
                  component={Paper}
                  sx={{
                    marginTop: "1em",
                    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: "10px",
                    border: "2px solid gray",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ borderBottom: "2px solid black " }}>
                        <TableCell>Jméno</TableCell>
                        <TableCell>Příjmení</TableCell>
                        <TableCell>E-mail</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Přidat</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {missingMembers.map((member: SubteamMember) => (
                        <TableRow
                          sx={{ borderTop: "2px solid gray" }}
                          key={member.email}
                        >
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.surname}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            {getRoleText(member.role.toString())}
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              onChange={() =>
                                handleCheckboxChange(
                                  member.email,
                                  member.role,
                                  "0"
                                )
                              }
                              checked={
                                member.role === "1" ||
                                addMembers.some((m) => m.email === member.email)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    marginTop: "2em",
                    marginBottom: "2em",
                    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {addMembers.length === 0 ? (
                    <Alert severity="warning">Přidejte členy do týmu.</Alert>
                  ) : (
                    <TableContainer
                      sx={{ borderRadius: "10px", border: "2px solid gray" }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Člen</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Práva</TableCell>
                            <TableCell>Pozice</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {addMembers.map((member) => (
                            <TableRow
                              sx={{ borderTop: "2px solid gray" }}
                              key={member.email}
                            >
                              <TableCell>{member.email}</TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>
                                {" "}
                                {getRoleText(member.role.toString())}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={member.position || "0"} // Default to "0" if position is not set
                                  onChange={(e) =>
                                    handlePositionChange(e, member.email)
                                  }
                                >
                                  <MenuItem value="0">Vyberte</MenuItem>
                                  <MenuItem value="1">Správce</MenuItem>
                                  <MenuItem value="2">Hlavní trenér</MenuItem>
                                  <MenuItem value="3">
                                    Asistent trenéra
                                  </MenuItem>
                                  <MenuItem value="4">Hráč</MenuItem>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{marginLeft:"10%", marginRight:"10%", marginBottom:"1em"}}>
              <Alert severity="success">Všichni členové jsou přidáni.</Alert>
              </Box>
            )}
          </Box>
          <Box sx={{ marginLeft: "10%" }}>
            <Button
              sx={{
                backgroundColor: "#027ef2",
                marginRight: "2em",
                ":hover": {
                  backgroundColor: "gray",
                },
              }}
              onClick={handleConfirm}
            >
              <Typography sx={{ fontWeight: "600", color: "white" }}>
                Potvrdit
              </Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: "#027ef2",
                marginRight: "2em",
                ":hover": {
                  backgroundColor: "gray",
                },
                color: "white",
              }}
              onClick={() => setAddMember(false)}
            >
              <Typography sx={{ fontWeight: "600" }}>Zrušit</Typography>
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              marginLeft: "10%",
              display: "flex",
              marginRight: "10%",
              marginBottom: "1em",
            }}
          >
            <Typography sx={{ fontWeight: "600" }} variant="h5">
              Členové týmu
            </Typography>

            {role === "1" && (
              <>
                <Button
                  sx={{
                    backgroundColor: "#027ef2",
                    ":hover": {
                      backgroundColor: "gray",
                    },
                    color: "white",
                    marginLeft: "auto",
                  }}
                  onClick={() => setAddMember(true)}
                >
                  Přidat člena
                </Button>
                {editMember == false && (
                  <Button
                    sx={{
                      backgroundColor: "#027ef2",
                      ":hover": {
                        backgroundColor: "gray",
                      },
                      color: "white",
                      marginLeft: "1em",
                    }}
                    onClick={() => setEditMember(true)}
                  >
                    Upravit člena
                  </Button>
                )}
                {editMember == true && (
                  <Button
                    sx={{
                      backgroundColor: "#027ef2",
                      ":hover": {
                        backgroundColor: "gray",
                      },
                      color: "white",
                      marginLeft: "1em",
                    }}
                    onClick={() => setEditMember(false)}
                  >
                    Zrušit
                  </Button>
                )}
              </>
            )}
          </Box>
          <TableContainer
            sx={{
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)",
              maxHeight: "100vh",
              overflowY: "auto",
            }}
            component={Paper}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Člen</TableCell>
                  <TableCell>E-mail</TableCell>
                  {(role == 1 &&<TableCell>Práva</TableCell>)}
                  <TableCell>Pozice</TableCell>
                  {editMember && <TableCell>Úprava</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {subteam?.subteamMembers.map((member: Member) => (
                  <TableRow
                    sx={{ borderTop: "2px solid gray" }}
                    key={member.email}
                  >
                    <TableCell>
                      {member.name} {member.surname}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    {(role == 1 &&<TableCell>{getRoleText(member.role.toString())}</TableCell>)}
                    <TableCell>{getPositionText(member.position)}</TableCell>
                    <TableCell>
                      {editMember && (
                        <Button
                          sx={{
                            backgroundColor: "#027ef2",
                            ":hover": {
                              backgroundColor: "gray",
                            },
                            color: "white",
                          }}
                          onClick={() => handleEditClick(member)}
                        >
                          Upravit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Dialog sx={{height:"auto"}} open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={{ padding: "0 2em 0em 2em", fontFamily: "Roboto" }}>
          <DialogTitle>
            Člen
            {selectedMember && (
              <Typography
                sx={{ color: "black", fontWeight: "600" }}
                variant="h5"
              >
                {selectedMember.name} {selectedMember.surname}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            {selectedMember && (
              <form>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography sx={{marginTop:"-1em"}} variant="subtitle1">Email:</Typography>
                    <Typography variant="subtitle1">Práva:</Typography>
                    <Typography sx={{marginTop:"3em"}} variant="subtitle1">Pozice:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography
                      sx={{ whiteSpace: "nowrap" }}
                      variant="subtitle1"
                    >
                      {selectedMember.email}
                    </Typography>
                    <Typography sx={{paddingBottom:"2em"}} variant="subtitle1">
                      {getRoleText(selectedMember.role)}
                    </Typography>
                    <FormControl  fullWidth>
                      <Select
                        value={selectedMember.position}
                        onChange={(e) => {
                          setSelectedMember((prevMember) => ({
                            ...(prevMember as Member), // Assert that prevMember is of type Member
                            position: e.target.value as string,
                          }));
                        }}
                      >
                        <MenuItem value="1">Správce</MenuItem>
                        <MenuItem value="2">Hlavní trenér</MenuItem>
                        <MenuItem value="3">Asistent trenéra</MenuItem>
                        <MenuItem value="4">Hráč</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>Zrušit</Button>
            <Button onClick={handleUpdateMember}>Potvrdit</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Members;
