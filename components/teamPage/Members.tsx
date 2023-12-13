/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Modal,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Alert,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { SelectChangeEvent } from "@mui/material";
import demoUser from "@/public/assets/demoUser.png";
import { authUtils } from "@/firebase/auth.utils";

const GET_TEAM_MEMBERS_DETAILS = gql`
  query GetTeamMembersDetails($teamId: String!) {
    getTeamMembersDetails(teamId: $teamId) {
      Name
      Surname
      Role
      Email
      DateOfBirth
    }
  }
`;

const UPDATE_MEMBER_ROLE = gql`
  mutation UpdateMemberRole($email: String!, $role: String!, $teamId: String!) {
    updateMemberRole(email: $email, role: $role, teamId: $teamId) {
      Name
      Surname
      Role
      Email
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

interface Member {
  Name: string;
  Surname: string;
  Role: string;
  Email: string;
  DateOfBirth: string;
}

type MembersProps = {
  id: string;
};

const MembersComponent: React.FC<MembersProps> = ({ id }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const currentUserEmail = authUtils.getCurrentUser()?.email || "";
  const [selectedMember, setSelectedMember] = useState<{
    Name: string;
    Surname: string;
    Role: string;
    Email: string;
    DateOfBirth: string;
  } | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [updateMemberRole] = useMutation(UPDATE_MEMBER_ROLE);
  const user = authUtils.getCurrentUser();

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: id, email: user?.email || "" },
    skip: !user,
  });

  if (roleError) return <p>Chyba: {roleError.message}</p>;

  const handleRowClick = (member: Member) => {
    setSelectedMember(member);
    setSelectedRole(member.Role);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
    setModalOpen(false);
    setEditMode(false);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    setEditMode(false);

    if (selectedMember) {
      try {
        await updateMemberRole({
          variables: {
            email: selectedMember.Email,
            role: selectedRole,
            teamId: id || "", // Pass the current team ID
          },
        });

        await setModalOpen(false);
        await refetch();
      } catch (error: any) {
        console.error("Error updating member role:", error.message);
        // Handle error if needed
      }
    }
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setSelectedRole(event.target.value);
  };

  const { loading, error, data, refetch } = useQuery<{
    getTeamMembersDetails: Member[];
  }>(GET_TEAM_MEMBERS_DETAILS, {
    variables: { teamId: id },
  });

  if (loading || roleLoading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (error) return <p>Error: {error.message}</p>;

  const members = data?.getTeamMembersDetails || [];
  const role = roleData?.getUserRoleInTeam.role || "";

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        <Typography
          sx={{ fontFamily: "Roboto", fontWeight: "500" }}
          variant="h4"
        >
          Členové klubu
        </Typography>
        <Link href={`/Team/AddMember/${id}/`}>
          <Button variant="contained">Přidat člena</Button>
        </Link>
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
          <TableHead sx={{ borderBottom: "1px solid #ddd" }}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "800" }}>
                  Jméno
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "800" }}>
                  Datum narození
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "800" }}>
                  Práva
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "800" }}>
                  Zdravotní prohlídka
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "800" }}>
                  Hlavní tým
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "800" }}>
                  Štítky
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map(
              (member: Member, index: React.Key | null | undefined) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor:
                      member.Email === currentUserEmail ? "#e6e6e6" : "inherit",
                  }}
                >
                  <TableCell>
                    {(role === "1") && (
                         <Box
                         sx={{ height: "20px", width: "20px" }}
                         onClick={() => handleRowClick(member)}
                       >
                         <ModeEditIcon />
                       </Box>
                    )}
                   
                  </TableCell>
                  <TableCell>
                    {member.Surname} {member.Name}
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Roboto" }}>
                      {member.DateOfBirth &&
                        new Date(member.DateOfBirth).toLocaleDateString(
                          "cs-CZ",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {member.Role === "1" && "Management"}
                    {member.Role === "2" && "Trenér"}
                    {member.Role === "3" && "Hráč"}
                    {(member.Role === "0" ||
                      member.Role === "No Role Assigned") && (
                      <Box sx={{ maxWidth: "15em" }}>
                        <Alert sx={{ maxHeight: "3em" }} severity="warning">
                          <Typography
                            sx={{ fontFamily: "Roboto", fontSize: "1vw" }}
                          >
                            Není zvoleno
                          </Typography>
                        </Alert>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Roboto" }}>
                      do 24.11.2023
                    </Typography>
                  </TableCell>
                  <TableCell>Muži A</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        border: "1px solid black",
                        textAlign: "center",
                        padding: "3px",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        sx={{ fontFamily: "Roboto", fontWeight: "500" }}
                      >
                        útočník
                      </Typography>
                    </Box>
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
            backgroundImage:
              "linear-gradient(to bottom, #808080 100px, #ffffff 80px)", // Šedý gradient po prvních 80 pixelů a poté bílá
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
                {selectedMember?.Name} {selectedMember?.Surname}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                marginLeft: "0.5em",
                top: "-24px",
                right: "1em",
              }}
              alt="Remy Sharp"
              src={demoUser.src}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* Right Column */}
            <Box sx={{ padding: "0em 2em 0em 2em" }}>
              <Typography
                id="modal-description"
                sx={{
                  marginTop: "1em",
                  fontFamily: "Roboto",
                  fontSize: "1em",
                  marginBottom: "1em",
                }}
              >
                Email
              </Typography>
              <Typography
                id="modal-description"
                sx={{
                  marginTop: editMode
                    ? "2.5em"
                    : selectedRole === "No Role Assigned"
                    ? "1.5em"
                    : "1em",

                  fontFamily: "Roboto",
                  fontSize: "1em",
                }}
              >
                Práva
              </Typography>
            </Box>

            {/* Left Column */}
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
                sx={{ marginTop: "1em", marginBottom: "1em" }}
              >
                {selectedMember?.Email}
              </Typography>

              {editMode ? (
                <Box sx={{}}>
                  <React.Fragment>
                    <Select
                      sx={{ width: "15em", margin: "0.5em 2em 0.5em 0em" }}
                      value={selectedRole}
                      onChange={handleRoleChange}
                    >
                      <MenuItem value="No Role Assigned" disabled>
                        Vyberte!
                      </MenuItem>
                      <MenuItem value="1">Management</MenuItem>
                      <MenuItem value="2">Trenér</MenuItem>
                      <MenuItem value="3">Hráč</MenuItem>
                    </Select>

                    {selectedRole == "No Role Assigned" && (
                      <Box sx={{ maxWidth: "15em", marginBottom: "1em" }}>
                        <Alert sx={{ maxHeight: "3em" }} severity="warning">
                          Není zvoleno
                        </Alert>
                      </Box>
                    )}
                  </React.Fragment>
                </Box>
              ) : (
                <Box sx={{ marginBottom: "1em" }}>
                  <Typography id="modal-description" sx={{}}>
                    {selectedMember?.Role === "1" && "Management"}
                    {selectedMember?.Role === "2" && "Trenér"}
                    {selectedMember?.Role === "3" && "Hráč"}
                    {(selectedMember?.Role === "0" ||
                      selectedMember?.Role === "No Role Assigned") && (
                      <Box sx={{ maxWidth: "15em" }}>
                        <Alert sx={{ maxHeight: "2.6em" }} severity="warning">
                          Není zvoleno
                        </Alert>
                      </Box>
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
                  padding: "1em",
                }}
                onClick={handleSaveClick}
              >
                Uložit
              </Button>
            </Box>
          ) : (
            <Box sx={{ paddingLeft: "1em" }}>
              <Button
                sx={{
                  backgroundColor: "lightgray",
                  color: "black",
                  padding: "1em",
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

export default MembersComponent;
