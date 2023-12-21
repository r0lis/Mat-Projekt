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

const Members: React.FC<MembersProps> = (subteamId ) => {
  const user = authUtils.getCurrentUser();
  const id = subteamId.subteamId;
  const [updateSubteamMembers] = useMutation(UPDATE_SUBTEAM_MEMBERS);
  const [addMember, setAddMember] = useState(false);
  const [addMembers, setAddMembers] = useState<
    { email: string; role: string; position: string }[]
  >([]);
  const userEmail = user?.email;


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
      // If Role is not "1", toggle the member in addMembers array
      if (memberIndex !== -1) {
        setAddMembers((prevMembers) => [
          ...prevMembers.slice(0, memberIndex),
          ...prevMembers.slice(memberIndex + 1),
        ]);
      } else {
        // Convert role to string before updating state
        setAddMembers((prevMembers) => [
          ...prevMembers,
          { email, role: String(role), position },
        ]);
      }
    }
  };

  const { loading, error, data, refetch } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: { subteamId: id },
    skip: !user,
  });

  const {
    loading: missingMembersLoading,
    error: missingMembersError,
    data: missingMembersData,
    refetch: missingMembersRefetch,
    
  } = useQuery(GET_MISSING_SUBTEAM_MEMBERS, {
    variables: { subteamId: id },
    skip: !user,
  });

  const { loading: roleLoading, error: roleError, data: roleData } = useQuery(
    GET_USER_ROLE_IN_TEAM,
    {
      variables: { teamId: subteamId.idTeam, email: userEmail },
      skip: !user,
    }
  );

  if (loading || missingMembersLoading || roleLoading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "40%" }}
      />
    );
  if (error || missingMembersError || roleError) return <Typography>kurva</Typography>;
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

      // Optionally, you can reset the state or perform other actions after successful update
      setAddMembers([]);
      setAddMember(false);
      refetch();
      await missingMembersRefetch();
    } catch (error) {
      console.error("Error updating subteam members:", error);
    }
  };
  const role = roleData.getUserRoleInTeam.role;
  

  return (
    <Box>
      {addMember ? (
        <Box>
          <Box sx={{ marginLeft: "10%" }}>
            <Typography variant="h5">Přidání člena do týmu</Typography>
          </Box>
          <Box sx={{ marginTop: "1em", marginLeft: "auto", display: "block",  "@media (max-width: 900px)": {
                flexDirection: "column", // Přidáno pro změnu směru na sloupcový layout
              }, }}>
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
                    borderRadius:"10px",
                    border:"2px solid gray"
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{borderBottom:"2px solid black "}}>
                        <TableCell>E-mail</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Přidat</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {missingMembers.map((member: SubteamMember) => (
                         <TableRow sx={{borderTop:"2px solid gray"}} key={member.email}>
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
                    <TableContainer sx={{borderRadius:"10px",
                    border:"2px solid gray"}}>
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
                            <TableRow sx={{borderTop:"2px solid gray"}} key={member.email}>
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
              <Typography>Všichni členové jsou přidáni.</Typography>
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
            </Button>)}
          </Box>
          <TableContainer
            sx={{
              width: "80%",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)",
            }}
            component={Paper}
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
                {subteam?.subteamMembers.map((member: Member) => (
                  <TableRow
                    sx={{ borderTop: "2px solid gray" }}
                    key={member.email}
                  >
                    <TableCell>
                      {member.name} {member.surname}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{getRoleText(member.role.toString())}</TableCell>
                    <TableCell>{getPositionText(member.position)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Members;
