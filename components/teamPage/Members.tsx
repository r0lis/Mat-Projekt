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
  TextField,
  Autocomplete,
  Grid,
  Card,
  CardMedia,
  Input,
  InputLabel,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { SelectChangeEvent } from "@mui/material";
import { authUtils } from "@/firebase/auth.utils";
import { useRef } from "react";

const GET_TEAM_MEMBERS_DETAILS = gql`
  query GetTeamMembersDetails($teamId: String!) {
    getTeamMembersDetails(teamId: $teamId) {
      Name
      Surname
      Role
      Email
      Picture
      DateOfBirth
      Subteams {
        Name
        subteamId
      }
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

const DELETE_MEMBER = gql`
  mutation DeleteMember($teamId: String!, $memberEmail: String!) {
    deleteMember(teamId: $teamId, memberEmail: $memberEmail)
  }
`;

interface Member {
  Name: string;
  Surname: string;
  Role: string;
  Email: string;
  Picture: string;
  DateOfBirth: string;
  Subteams: { Name: string; subteamId: string }[];
}

type MembersProps = {
  id: string;
};

const MembersComponent: React.FC<MembersProps> = ({ id }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalOpenPlayer, setModalOpenPlayer] = useState(false);
  const currentUserEmail = authUtils.getCurrentUser()?.email || "";
  const [selectedMember, setSelectedMember] = useState<{
    Name: string;
    Surname: string;
    Role: string;
    Email: string;
    DateOfBirth: string;
    Picture: string;
    Subteams: { Name: string; subteamId: string }[];
  } | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [updateMemberRole] = useMutation(UPDATE_MEMBER_ROLE);
  const [deleteMember] = useMutation(DELETE_MEMBER);
  const user = authUtils.getCurrentUser();
  const [modalOpenPlayerImage, setModalOpenPlayerImage] = useState(false);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedSelectedMember, setExpandedSelectedMember] = useState<
    string | null
  >(null);

  const { loading, error, data, refetch } = useQuery<{
    getTeamMembersDetails: Member[];
  }>(GET_TEAM_MEMBERS_DETAILS, {
    variables: { teamId: id },
  });

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: id, email: user?.email || "" },
    skip: !user,
  });

  const members = data?.getTeamMembersDetails || [];

  useEffect(() => {
    if (tableBodyRef.current && selectedIndex !== null) {
      const rowElement = tableBodyRef.current.children[
        selectedIndex
      ] as HTMLDivElement;
      if (rowElement) {
        rowElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredMembers(members);
    } else {
      const searchRegex = new RegExp(searchInput.trim(), "i");
      const filtered = members.filter(
        (member) =>
          searchRegex.test(member.Name) || searchRegex.test(member.Surname)
      );
      setFilteredMembers(filtered);
    }

    setSelectedIndex(calculateSelectedIndex());
  }, [searchInput, members, selectedMember]);

  const handleRowClick = (member: Member) => {
    setSelectedMember(member);
    setSelectedRole(member.Role);
    setModalOpen(true);

    // Update the selected index based on the filtered list
    setSelectedIndex(calculateSelectedIndex());
  };

  const calculateSelectedIndex = () => {
    if (selectedMember) {
      return filteredMembers.findIndex(
        (member) =>
          member.Email === selectedMember.Email &&
          member.Role === selectedMember.Role
      );
    }
    return null;
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
  const allMembers = data?.getTeamMembersDetails || [];

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
      }
    }
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setSelectedRole(event.target.value);
  };

  const handleDeleteClick = async () => {
    if (selectedMember && selectedMember.Email !== currentUserEmail) {
      try {
        await deleteMember({
          variables: {
            teamId: id || "",
            memberEmail: selectedMember.Email,
          },
        });

        await setModalOpen(false);
        await refetch();
      } catch (error: any) {
        console.error("Error deleting member:", error.message);
      }
    }
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

  const handleOpenModalPlayer = () => {
    setModalOpenPlayer(true);
  };

  const handleCloseModalPlayer = () => {
    setModalOpenPlayer(false);
  };

  const HandleUploadUserMedicalDoc = async () => {
    try {
      if (!selectedImage) {
        throw new Error("Vyberte prosím obrázek pro tým.");
      }

      const imageBase64 = selectedImage;
      console.log(imageBase64);
    } catch (error: any) {
      console.error("Error uploading user medical doc:", error.message);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setSelectedImage(null);
  };

  const handleImageClick = () => {
    if (selectedImage) {
      setModalOpenPlayerImage(true);
    }
  };

  const handleCloseModalPlayerImage = () => {
    setModalOpenPlayerImage(false);
  };

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
        {role == 1 && (
          <Typography
            sx={{ fontFamily: "Roboto", fontWeight: "500", marginTop: "0.5em" }}
            variant="h5"
          >
            Členové klubu
          </Typography>
        )}

        {role === "1" && (
          <Link href={`/Team/AddMember/${id}/`}>
            <Button variant="contained">Přidat člena</Button>
          </Link>
        )}
      </Box>
      {role == 1 && (
        <Box
          sx={{
            marginLeft: "5%",
            marginRight: "5%",
            marginTop: "2em",
          }}
        >
          <Autocomplete
            options={allMembers}
            getOptionLabel={(option) => {
              if (searchInput.length < 2) return "";
              return `${option.Name} ${option.Surname}`;
            }}
            isOptionEqualToValue={(option, value) =>
              option.Name.toLowerCase() === value.Name.toLowerCase() &&
              option.Surname.toLowerCase() === value.Surname.toLowerCase()
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Hledat podle jména a příjmení"
                variant="outlined"
                value={searchInput}
                sx={{ marginBottom: searchInput.length < 1 ? "0em" : "2em" }}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            )}
          />
        </Box>
      )}
      {role == 1 || role == 2 ? (
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
                    Týmy
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontFamily: "Roboto", fontWeight: "800" }}>
                    Štítky
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody ref={tableBodyRef}>
              {filteredMembers.map(
                (member: Member, index: React.Key | null | undefined) =>
                  (role === "1" || member.Email === currentUserEmail) && (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          member.Email === currentUserEmail && role === "1"
                            ? "#e6e6e6"
                            : "inherit",
                      }}
                    >
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
                          alt={member.Name[0] + member.Surname[0]}
                          src={member.Picture}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{ fontFamily: "Roboto", fontWeight: "450" }}
                        >
                          {member.Surname} {member.Name}
                        </Typography>
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
                            )}{" "}
                          / {calculateAge(member?.DateOfBirth || "")} let
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {member.Role === "1" && "Management"}
                        {member.Role === "2" && "Trenér"}
                        {member.Role === "3" && "Hráč"}
                        {(member.Role === "0" ||
                          member.Role === "No Role Assigned") && (
                          <Box sx={{ maxWidth: "15em" }}>
                            <Alert sx={{ maxHeight: "3em" }} severity="error">
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
                      <TableCell>
                        {member.Subteams.length === 0 ? (
                          <Alert sx={{ maxWidth: "6em" }} severity="warning">
                            Žádný
                          </Alert>
                        ) : (
                          <>
                            {member.Subteams.slice(0, 1).map((subteam) => (
                              <Typography
                                key={subteam.subteamId}
                                sx={{ fontFamily: "Roboto" }}
                              >
                                {subteam.Name}
                              </Typography>
                            ))}
                            {member.Subteams.length > 1 && (
                              <>
                                <Collapse in={expandedMember === member.Email}>
                                  {member.Subteams.slice(1).map((subteam) => (
                                    <Typography
                                      key={subteam.subteamId}
                                      sx={{ fontFamily: "Roboto" }}
                                    >
                                      {subteam.Name}
                                    </Typography>
                                  ))}
                                </Collapse>
                                <Button
                                  onClick={() =>
                                    setExpandedMember(
                                      expandedMember === member.Email
                                        ? null
                                        : member.Email
                                    )
                                  }
                                  color="primary"
                                  sx={{
                                    fontFamily: "Roboto",
                                    marginLeft: "-1em",
                                  }}
                                >
                                  {expandedMember === member.Email
                                    ? "Méně"
                                    : "Více"}
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </TableCell>
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
      ) : (
        <Box sx={{ marginTop: "0.5em" }}>
          {filteredMembers.map(
            (member: Member) =>
              (role === "1" || member.Email === currentUserEmail) && (
                <Box>
                  <Box
                    sx={{
                      boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.4)",
                      width: "80%",
                      borderRadius: "15px 15px 0px 0px",
                      marginLeft: "9%",
                      marginRight: "11%",
                      backgroundColor: "#909090",
                      borderBottom: "2px solid gray",
                      padding: "0.5em",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "Roboto",
                          fontWeight: "500",
                          marginLeft: "5%",
                          color: "#404040",
                        }}
                      >
                        členská sekce
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        paddingTop: "0.5em",
                        paddingBottom: "0.2em",
                      }}
                    >
                      <Box>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            left: 60,
                            right: "",
                          }}
                          alt="Remy Sharp"
                          src={member.Picture}
                        />
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: "Roboto",
                            fontWeight: "500",
                            marginLeft: 10,
                            marginTop: "0.35em",
                            fontSize: "1.5em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {member.Name} {member.Surname}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.4)",
                      width: "80%",
                      borderRadius: "0px 0px 15px 15px",
                      marginLeft: "9%",
                      marginRight: "11%",
                      padding: "0.5em",
                      paddingBottom:
                        expandedSelectedMember === member.Email
                          ? "2em"
                          : "0.5em",
                      marginBottom:
                        expandedSelectedMember === member.Email
                          ? "2em"
                          : "0.5em",
                    }}
                  >
                    <Grid container spacing={2} sx={{ marginLeft: "3%" }}>
                      <Grid item xs={3}>
                        <Box sx={{ padding: "0.5em" }}>
                          <Typography
                            sx={{
                              marginLeft: "3%",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            Věk:
                          </Typography>
                          <Typography
                            sx={{
                              marginLeft: "3%",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            Datum narození:{" "}
                          </Typography>
                          <Typography
                            sx={{
                              marginLeft: "3%",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            Email :
                          </Typography>
                          <Typography
                            sx={{
                              marginLeft: "3%",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            Zdravotní prohlídka:
                          </Typography>
                          <Typography
                            sx={{
                              marginLeft: "3%",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            Práva:
                          </Typography>
                          <Typography
                            sx={{
                              marginLeft: "3%",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            Týmy:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ padding: "0.5em" }}>
                          <Typography
                            sx={{ color: "black", fontWeight: "500" }}
                          >
                            {calculateAge(member?.DateOfBirth || "")} let
                          </Typography>
                          <Typography
                            sx={{ color: "black", fontWeight: "500" }}
                          >
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
                          <Typography
                            sx={{ color: "black", fontWeight: "500" }}
                          >
                            {member.Email}
                          </Typography>
                          <Typography
                            sx={{ color: "black", fontWeight: "500" }}
                          >
                            do 2. 3. 2023
                          </Typography>
                          <Typography
                            sx={{ color: "black", fontWeight: "500" }}
                          >
                            {member.Role === "1" && "Management"}
                            {member.Role === "2" && "Trenér"}
                            {member.Role === "3" && "Hráč"}
                            {(member.Role === "0" ||
                              member.Role === "No Role Assigned") && (
                              <Box sx={{ maxWidth: "15em" }}>
                                <Alert
                                  sx={{ maxHeight: "2.6em" }}
                                  severity="error"
                                >
                                  <Typography
                                    sx={{ fontSize: "1em", fontWeight: "600" }}
                                  >
                                    Zvolte !
                                  </Typography>
                                </Alert>
                              </Box>
                            )}
                          </Typography>
                          {member.Subteams.slice(0, 1).map((subteam) => (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography
                                key={subteam.subteamId}
                                sx={{
                                  fontFamily: "Roboto",
                                  color: "black",
                                  fontWeight: "500",
                                }}
                              >
                                {subteam.Name}
                              </Typography>
                              {member.Subteams.length > 1 && (
                                <Button
                                  onClick={() =>
                                    setExpandedSelectedMember(
                                      expandedSelectedMember === member.Email
                                        ? null
                                        : member.Email
                                    )
                                  }
                                  color="primary"
                                  sx={{
                                    fontFamily: "Roboto",
                                    marginLeft: "auto",
                                    marginRight: "30%",
                                    color: "black",
                                    fontWeight: "500",
                                    height: "1.5em",
                                  }}
                                >
                                  {expandedSelectedMember === member.Email
                                    ? "Méně"
                                    : "Více"}
                                </Button>
                              )}
                            </Box>
                          ))}
                          {member.Subteams.length > 1 && (
                            <Collapse
                              sx={{
                                position: "absolute",
                                zIndex: "999",
                                backgroundColor: "white",
                                width: "40%",
                              }}
                              in={expandedSelectedMember === member.Email}
                            >
                              {member.Subteams.slice(1).map((subteam) => (
                                <Typography
                                  key={subteam.subteamId}
                                  sx={{
                                    fontFamily: "Roboto",
                                    color: "black",
                                    fontWeight: "500",
                                  }}
                                >
                                  {subteam.Name}
                                </Typography>
                              ))}
                            </Collapse>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        display: "flex",
                        marginLeft: "5%",
                        marginRight: "5%",
                        borderBottom: "2px solid gray",
                        marginTop:
                          expandedSelectedMember === member.Email
                            ? "2em"
                            : "0.1em",
                      }}
                    ></Box>
                    <Box sx={{ paddingBottom: "0.5em" }}>
                      <Button
                        sx={{
                          backgroundColor: "lightgray",
                          color: "black",
                          marginTop: "1em",
                          padding: "1em",
                          height: "2.5em",
                          marginLeft: "5%",
                          width: "90%",
                          ":hover": {
                            border: "1px solid black",
                            backgroundColor: "#989898",
                          },
                        }}
                        onClick={handleOpenModalPlayer}
                      >
                        Nahrát Zdravotní prohlídku
                      </Button>
                      <Button
                        sx={{
                          backgroundColor: "lightgray",
                          color: "black",
                          marginTop: "1em",
                          padding: "1em",
                          height: "2.5em",
                          marginLeft: "5%",

                          width: "90%",
                          ":hover": {
                            border: "1px solid black",
                            backgroundColor: "#989898",
                          },
                        }}
                      >
                        Opustit klub
                      </Button>
                    </Box>
                  </Box>
                  <Modal
                    open={modalOpenPlayer}
                    onClose={handleCloseModalPlayer}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 500,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        borderRadius: "8px",
                        boxShadow: 24,
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#959595",
                          paddingTop: "0.5em",
                          paddingBottom: "0.5em",
                          paddingLeft: "2em",
                          paddingRight: "2em",
                          borderRadius: "6px 6px 0px 0px",
                        }}
                      >
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          Zdravotní prohlídka
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          paddingTop: "0.5em",
                          paddingBottom: "2em",
                          paddingLeft: "2em",
                          paddingRight: "2em",
                        }}
                      >
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          Sem vložte obsah modálního okna pro nahrání zdravotní
                          prohlídky.
                        </Typography>
                        <InputLabel htmlFor="imageInput">
                          <Input
                            id="imageInput"
                            type="file"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                            inputProps={{ accept: "image/*" }}
                          />
                        </InputLabel>
                        {!selectedImage && (
                          <Box sx={{ marginTop: "0.4em", marginBottom: "1em" }}>
                            <label htmlFor="imageInput">
                              <Button variant="contained" component="span">
                                Vybrat obrázek
                              </Button>
                            </label>
                          </Box>
                        )}

                        {selectedImage && (
                          <Box
                            sx={{
                              padding: "10px",
                              marginTop: "0px",
                              borderRadius: "15px",
                              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                              marginBottom: "20px",
                            }}
                          >
                            <Box
                              style={{
                                marginTop: "10px",
                                marginBottom: "10px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Card
                                sx={{
                                  width: 100,
                                  height: 100,
                                  marginRight: "10px",
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  alt="Selected Image"
                                  height="100"
                                  image={selectedImage}
                                />
                              </Card>
                              <Box>
                                <Box>
                                  <Button
                                    sx={{
                                      width: "100%",
                                      marginBottom: "0.5em",
                                    }}
                                    variant="outlined"
                                    onClick={handleImageClick}
                                  >
                                    Zobrazit
                                  </Button>
                                </Box>
                                <Box>
                                  <Button
                                    sx={{
                                      width: "100%",
                                      marginBottom: "0.5em",
                                    }}
                                    variant="outlined"
                                    onClick={HandleUploadUserMedicalDoc}
                                  >
                                    Uložit
                                  </Button>
                                </Box>
                                <Box>
                                  <Button
                                    sx={{ width: "100%" }}
                                    variant="outlined"
                                    onClick={handleImageDelete}
                                  >
                                    Smazat obrázek
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Modal>
                  <Modal
  open={modalOpenPlayerImage}
  onClose={handleCloseModalPlayerImage}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 700,
      height: 700,
      bgcolor: "background.paper",
      border: "2px solid #000",
      borderRadius: "8px",
      boxShadow: 24,
    }}
  >
    <Box
      sx={{
        backgroundColor: "#959595",
        paddingTop: "0.5em",
        paddingBottom: "0.5em",
        paddingLeft: "2em",
        paddingRight: "2em",
        borderRadius: "6px 6px 0px 0px",
      }}
    >
      <Typography
        id="modal-modal-title"
        variant="h6"
        component="h2"
      >
        Náhled obrázku
      </Typography>
    </Box>
    <Box
      sx={{
        paddingTop: "0.5em",
        paddingBottom: "2em",
        marginLeft: "10%", 
        marginRight: "10%",
        width: "80%", 
        height: "80%", 
        overflowY: "auto",
      }}
    >
      {selectedImage && (
        <img
          src={selectedImage}
          alt="Selected Image"
          style={{ width: "100%", height: "auto" }} 
        />
      )}
    </Box>
  </Box>
</Modal>
                </Box>
              )
          )}
        </Box>
      )}

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
            linear-gradient(to bottom, #808080 0, #909090 100px, #ffffff 100px, #ffffff calc(100% - 100px), #909090 calc(100% - 100px), #909090 100%)
          `
              : selectedMember && selectedMember.Email == currentUserEmail
              ? `
            linear-gradient(to bottom, #808080 0, #909090 100px, #ffffff 100px, #ffffff calc(100% - 110px), #909090 calc(100% - 110px), #909090 100%)
          `
              : `
          linear-gradient(to bottom, #808080 0, #909090 100px, #ffffff 100px, #ffffff calc(100% - 140px), #909090 calc(100% - 140px), #909090 100%)
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
                {selectedMember?.Name} {selectedMember?.Surname}
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
              src={selectedMember?.Picture}
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
                  whiteSpace: "nowrap",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                Hlavní tým:
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
                  marginTop: editMode
                    ? "2.5em"
                    : selectedRole === "No Role Assigned"
                    ? "1.5em"
                    : "1em",
                  fontFamily: "Roboto",
                  fontSize: "1em",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                Práva:
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
                {calculateAge(selectedMember?.DateOfBirth || "")} let
              </Typography>

              <Typography
                id="modal-description"
                sx={{ marginBottom: "1em", color: "black", fontWeight: "500" }}
              >
                {selectedMember?.DateOfBirth &&
                  new Date(selectedMember.DateOfBirth).toLocaleDateString(
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
                }}
              >
                {selectedMember?.Subteams &&
                selectedMember.Subteams.length === 0 ? (
                  <Typography
                    sx={{
                      fontFamily: "Roboto",
                      color: "black",
                      fontWeight: "500",
                    }}
                  >
                    Žádný
                  </Typography>
                ) : (
                  selectedMember?.Subteams && (
                    <>
                      {selectedMember.Subteams.slice(0, 1).map((subteam) => (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            key={subteam.subteamId}
                            sx={{
                              fontFamily: "Roboto",
                              color: "black",
                              fontWeight: "500",
                            }}
                          >
                            {subteam.Name}
                          </Typography>
                          {selectedMember.Subteams.length > 1 && (
                            <Button
                              onClick={() =>
                                setExpandedSelectedMember(
                                  expandedSelectedMember ===
                                    selectedMember.Email
                                    ? null
                                    : selectedMember.Email
                                )
                              }
                              color="primary"
                              sx={{
                                fontFamily: "Roboto",
                                marginLeft: "auto",
                                height: "1.5em",
                              }}
                            >
                              {expandedSelectedMember === selectedMember.Email
                                ? "Méně"
                                : "Více"}
                            </Button>
                          )}
                        </Box>
                      ))}
                      {selectedMember.Subteams.length > 1 && (
                        <Collapse
                          sx={{
                            position: "absolute",
                            zIndex: "999",
                            backgroundColor: "white",
                            width: "40%",
                          }}
                          in={expandedSelectedMember === selectedMember.Email}
                        >
                          {selectedMember.Subteams.slice(1).map((subteam) => (
                            <Typography
                              key={subteam.subteamId}
                              sx={{
                                fontFamily: "Roboto",
                                color: "black",
                                fontWeight: "500",
                              }}
                            >
                              {subteam.Name}
                            </Typography>
                          ))}
                        </Collapse>
                      )}
                    </>
                  )
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
                {selectedMember?.Email}
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

              {editMode ? (
                <Box sx={{}}>
                  <React.Fragment>
                    <Select
                      sx={{ width: "auto", margin: "0.5em 2em 0.5em 0em" }}
                      value={selectedRole}
                      onChange={handleRoleChange}
                    >
                      <MenuItem value="No Role Assigned" disabled>
                        <Typography sx={{ color: "black", fontWeight: "500" }}>
                          Vyberte!
                        </Typography>
                      </MenuItem>
                      <MenuItem value="1">
                        {" "}
                        <Typography sx={{ color: "black", fontWeight: "500" }}>
                          Management
                        </Typography>
                      </MenuItem>
                      <MenuItem value="2">
                        {" "}
                        <Typography sx={{ color: "black", fontWeight: "500" }}>
                          Trenér
                        </Typography>
                      </MenuItem>
                      <MenuItem value="3">
                        {" "}
                        <Typography sx={{ color: "black", fontWeight: "500" }}>
                          Hráč
                        </Typography>
                      </MenuItem>
                    </Select>
                  </React.Fragment>
                </Box>
              ) : (
                <Box sx={{ marginBottom: "1em" }}>
                  <Typography id="modal-description" sx={{ color: "black" }}>
                    {selectedMember?.Role === "1" && (
                      <Typography sx={{ color: "black", fontWeight: "500" }}>
                        Management
                      </Typography>
                    )}
                    {selectedMember?.Role === "2" && (
                      <Typography sx={{ color: "black", fontWeight: "500" }}>
                        Trenér
                      </Typography>
                    )}
                    {selectedMember?.Role === "3" && (
                      <Typography sx={{ color: "black", fontWeight: "500" }}>
                        Hráč
                      </Typography>
                    )}
                    {(selectedMember?.Role === "0" ||
                      selectedMember?.Role === "No Role Assigned") && (
                      <Box sx={{ maxWidth: "15em", marginBottom: "1em" }}>
                        <Alert sx={{ maxHeight: "2.6em" }} severity="error">
                          <Typography
                            sx={{ fontSize: "1em", fontWeight: "600" }}
                          >
                            Zvolte !
                          </Typography>
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
              <Box
                sx={{
                  fontFamily: "Roboto",
                  fontWeight: "500",
                  opacity: "0.6",

                  top: "-10px",
                  position: "relative",
                  marginTop: "1em",
                }}
              >
                štítky
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    padding: "3px",
                    borderRadius: "8px",
                    width: "6em",
                  }}
                >
                  <Typography sx={{ fontFamily: "Roboto", fontWeight: "500" }}>
                    útočník
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    padding: "3px",
                    borderRadius: "8px",
                    width: "6em",
                  }}
                >
                  <Typography sx={{ fontFamily: "Roboto", fontWeight: "500" }}>
                    A-Tým
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    padding: "3px",
                    borderRadius: "8px",
                    width: "6em",
                  }}
                >
                  <Typography sx={{ fontFamily: "Roboto", fontWeight: "500" }}>
                    Levá strana
                  </Typography>
                </Box>
              </Box>
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
                onClick={handleSaveClick}
              >
                Uložit
              </Button>
            </Box>
          ) : (
            <Box sx={{ paddingLeft: "1em" }}>
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
                      selectedMember?.Role === "0" ||
                      selectedMember?.Role === "No Role Assigned"
                        ? "55%"
                        : selectedMember &&
                          selectedMember.Email === currentUserEmail
                        ? "56%"
                        : "53%",
                    transform: "translateY(-50%)",
                    marginLeft: "-3em",
                    zIndex: -1,
                  }}
                />
                <Box
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: "500",
                    opacity: "0.6",
                    marginLeft: "-0.5em",
                    top: "-10px",
                    position: "relative",
                    marginTop: "1em",
                  }}
                >
                  štítky
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    padding: "3px",
                    borderRadius: "8px",
                    width: "6em",
                  }}
                >
                  <Typography sx={{ fontFamily: "Roboto", fontWeight: "500" }}>
                    útočník
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    padding: "3px",
                    borderRadius: "8px",
                    width: "6em",
                  }}
                >
                  <Typography sx={{ fontFamily: "Roboto", fontWeight: "500" }}>
                    A-Tým
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "1px solid black",
                    textAlign: "center",
                    padding: "3px",
                    borderRadius: "8px",
                    width: "6em",
                  }}
                >
                  <Typography sx={{ fontFamily: "Roboto", fontWeight: "500" }}>
                    Levá strana
                  </Typography>
                </Box>
              </Box>

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
                      selectedMember?.Role === "0" ||
                      selectedMember?.Role === "No Role Assigned"
                        ? "81%"
                        : selectedMember &&
                          selectedMember.Email === currentUserEmail
                        ? "69%"
                        : "80%",
                    transform: "translateY(-50%)",
                    marginLeft: "-3em",
                    zIndex: -1,
                  }}
                />
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
                  Kontaktní adresa
                </Box>
              </Box>
              <Box sx={{ marginLeft: "1em" }}>
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "500" }}>
                  Skořenice 30 <br />
                  56501 Choceň
                </Typography>
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
              {selectedMember && selectedMember.Email !== currentUserEmail && (
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
                  onClick={handleDeleteClick}
                >
                  Smazat
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default MembersComponent;
