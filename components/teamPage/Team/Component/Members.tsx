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

type MembersProps = {
  subteamId: string;
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

const Members: React.FC<MembersProps> = (subteamId) => {
  const user = authUtils.getCurrentUser();
  const id = subteamId.subteamId;
  const [updateSubteamMembers] = useMutation(UPDATE_SUBTEAM_MEMBERS);
  const [addMember, setAddMember] = useState(false);
  const [addMembers, setAddMembers] = useState<
    { email: string; role: string; position: string }[]
  >([]);

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

  const { loading, error, data } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: { subteamId: id },
    skip: !user,
  });

  const {
    loading: missingMembersLoading,
    error: missingMembersError,
    data: missingMembersData,
  } = useQuery(GET_MISSING_SUBTEAM_MEMBERS, {
    variables: { subteamId: id },
    skip: !user,
  });

  if (loading || missingMembersLoading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (error || missingMembersError) return <Typography>kurva</Typography>;
  console.log(missingMembersError);
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
    } catch (error) {
      console.error("Error updating subteam members:", error);
    }
  };

  return (
    <Box>
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
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>E-mail</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Přidat</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {missingMembers.map((member: SubteamMember) => (
                        <TableRow key={member.email}>
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
                    <TableContainer>
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
                            <TableRow key={member.email}>
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
            <Button sx={{ backgroundColor: "#027ef2", marginRight:"2em" }} onClick={handleConfirm}>
            <Typography sx={{ fontWeight: "600", color:"white"  }}>
              Potvrdit
              </Typography>
            </Button>
            <Button
              sx={{ backgroundColor: "#027ef2", color:"white"  }}
              onClick={() => setAddMember(false)}
            >
              <Typography sx={{ fontWeight: "600",  }}>
              Zrušit
              </Typography>
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Button onClick={() => setAddMember(true)}>Přidat člena</Button>
          <Typography variant="h5">Members</Typography>
          {subteam?.subteamMembers.map((member: Member) => (
            <Typography key={member.email}>
              {member.name} {member.surname} {member.email} - {member.role}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Members;
