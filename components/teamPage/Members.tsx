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
} from "@mui/material";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

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
  Role: string;
}

type MembersProps = {
  id: string;
};

const MembersComponent: React.FC<MembersProps> = ({ id }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{
    Name: string;
    Surname: string;
    Role: string;
  } | null>(null);

  const handleRowClick = (member: {
    Name: string;
    Surname: string;
    Role: string;
  }) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
    setModalOpen(false);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    // Handle save logic here
    setEditMode(false);
  };

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
          Členové týmu
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
                  sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
                >
                  <TableCell>
                    <Box
                      sx={{ height: "20px", width: "20px" }}
                      onClick={() => handleRowClick(member)}
                    >
                      <ModeEditIcon />
                    </Box>
                  </TableCell>
                  <TableCell>
                    {member.Surname} {member.Name}
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: "Roboto" }}>
                      19.07.2005
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
                          Není zvoleno
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
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {selectedMember?.Name} {selectedMember?.Surname}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {selectedMember?.Role === "1" && "Management"}
            {selectedMember?.Role === "2" && "Trenér"}
            {selectedMember?.Role === "3" && "Hráč"}
            {(selectedMember?.Role === "0" ||
              selectedMember?.Role === "No Role Assigned") && (
              <Box sx={{ maxWidth: "15em" }}>
                <Alert sx={{ maxHeight: "3em" }} severity="warning">
                  Není zvoleno
                </Alert>
              </Box>
            )}
          </Typography>
          
          {editMode ? (
            <Button onClick={handleSaveClick}>Uložit</Button>
          ) : (
            <Button onClick={handleEditClick}>Upravit</Button>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MembersComponent;
