/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Alert, Box, Button, IconButton, Typography } from "@mui/material";
import { gql, useMutation, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";


const CREATE_TEAM_MUTATION = gql`
  mutation CreateTeam(
    $Name: String!
    $AdminEmail: String!
    $teamId: String!
    $MembersEmails: [String]!
    $Email: String!
    $Logo: String!
    $OwnerName: String!
    $OwnerSurname: String!
    $Place: String!
  ) {
    createTeam(
      input: {
        Name: $Name
        teamId: $teamId
        AdminEmail: $AdminEmail
        MembersEmails: $MembersEmails
        Email: $Email
        Logo: $Logo
        OwnerName: $OwnerName
        OwnerSurname: $OwnerSurname
        Place: $Place
      }
    ) {
      Name
      teamId
      AdminEmail
      MembersEmails
      Email
      Logo
      OwnerName
      OwnerSurname
      Place
    }
  }
`;

const CHECK_TEAM_EMAIL_EXISTENCE_QUERY = gql`
  query CheckTeamEmailExistence($email: String!) {
    checkTeamEmailExistence(email: $email)
  }
`;

type Step1Props = {
  onCompleteTeamCreation: (teamEmail: string) => void;
};

const Step1: React.FC<Step1Props> = ({ onCompleteTeamCreation }) => {
  const [nameTeam, setName] = useState("");
  const [emailTeam, setEmail] = useState("");
  const [img, setImg] = useState("");
  const [nameOwner, setNameOwner] = useState("");
  const [surnameOwner, setSurnameOwner] = useState("");
  const [place, setPlace] = useState("");
  const [error, setError] = useState(null);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailValue, setEmailValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [error3] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [createTeam] = useMutation(CREATE_TEAM_MUTATION);

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const currentUserEmail = authUtils.getCurrentUser()?.email || "";

  const { data: emailExistenceData } = useQuery(
    CHECK_TEAM_EMAIL_EXISTENCE_QUERY,
    {
      variables: { email: emailTeam },
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      skip: !emailTeam, // Skip query if emailTeam is empty
    }
  );

  const handleCreateTeam = async () => {
    try {
      if (!nameTeam || !currentUserEmail) {
        throw new Error("Název týmu a e-mail admina jsou povinné.");
      }

      if (emailExistenceData && emailExistenceData.checkTeamEmailExistence) {
        throw new Error("Tým s tímto e-mailem již existuje.");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTeam)) {
        throw new Error("Prosím, zadejte platný e-mail pro tým.");
      }

      if (!/^[A-Z].{1,}$/u.test(nameTeam)) {
        throw new Error(
          "Název týmu musí začínat velkým písmenem a být delší než 1 znak."
        );
      }

      if (emails.length < 2) {
        throw new Error("Tým musí mít alespoň 2 uživatele.");
      }

      if (!/^[A-Z].{1,}$/u.test(place)) {
        throw new Error(
          "Město týmu musí začínat velkým písmenem a být delší než 1 znak."
        );
      }

      if (
        !/^[A-Z].{2,}$/u.test(nameOwner) ||
        !/^[A-Z].{2,}$/u.test(surnameOwner)
      ) {
        throw new Error(
          "Jméno a příjmení vlastníka týmu musí začínat velkým písmenem a být delší než 2 znaky."
        );
      }

      const allMembers = [currentUserEmail, ...emails];

      const response = await createTeam({
        variables: {
          Name: nameTeam,
          AdminEmail: currentUserEmail,
          teamId: "fefe",
          MembersEmails: allMembers,
          Email: emailTeam,
          Logo: img,
          OwnerName: nameOwner,
          OwnerSurname: surnameOwner,
          Place: place,
        },
      });

      console.log("Tým byl úspěšně vytvořen", response);

      //router.push('/').then(() => window.location.reload());
      onCompleteTeamCreation(emailTeam);
      console.log(emailTeam);
      setIsCreated(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue.trim() !== "" && emailRegex.test(emailValue)) {
      if (editIndex !== null) {
        const updatedEmails = [...emails];
        updatedEmails[editIndex] = emailValue;
        setEmails(updatedEmails);
        setEditIndex(null);
      } else {
        setEmails([...emails, emailValue]);
      }
      setEmailValue("");
      setError2(null);
    } else {
      setError2("Please enter a valid email.");
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
    setImg(""); // Optional: Clear the image URL from the state
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEmailValue(emails[index]);
  };

  const handleDelete = (index: number) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
    setEditIndex(null);
  };

  return (
    <Box sx={{ margin: "0 auto", marginTop: 4 }}>
      <Box
        sx={{
          backgroundColor: "white",
          width: "65%",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "5%",
          marginTop: "6em",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          sx={{ textAlign: "center", fontFamily: "Roboto", fontWeight: "600" }}
          variant="h4"
          gutterBottom
        >
          Vytvoření týmu:
        </Typography>

        <Box sx={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
          {isCreated ? (
            <Alert severity="success">Tým byl úspěšně vytvořen!</Alert>
          ) : (
            <form>
              <div>
                <TextField
                  id="nameTeam"
                  label="Název týmu"
                  variant="outlined"
                  value={nameTeam}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </div>

              <div>
                <TextField
                  id="email"
                  label="Týmový e-mail"
                  variant="outlined"
                  value={emailTeam}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  error={error3 !== null}
                  helperText={error3}
                />
              </div>

              <div>
                <TextField
                  id="image"
                  label="Týmové logo"
                  variant="outlined"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </div>

              <Box>
              <h3>Týmové logo</h3>

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
                        sx={{ width: 100, height: 100, marginRight: "10px" }}
                      >
                        <CardMedia
                          component="img"
                          alt="Selected Image"
                          height="100"
                          image={selectedImage}
                        />
                      </Card>
                      <Button variant="outlined" onClick={handleImageDelete}>
                        Smazat obrázek
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>

              <Box sx={{ marginBottom: "20px" }}>
                <Typography
                  sx={{
                    textAlign: "center",
                    fontFamily: "Roboto",
                    fontWeight: "600",
                    marginTop: "20px",
                  }}
                  variant="h5"
                  gutterBottom
                >
                  Přidání členů týmu:
                </Typography>
              </Box>

              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <TextField
                  type="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  placeholder="Zadejte e-mail"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={addEmail}
                  style={{ marginLeft: "10px" }}
                >
                  {editIndex !== null ? "Upravit" : "Přidat"}
                </Button>
              </Box>
              <div style={{ marginBottom: "10px" }}>
                {error2 && <Alert severity="error">{error2}</Alert>}
              </div>

              <Box
                sx={{
                  border: "1px solid lighgray",
                  borderRadius: "15px",
                  padding: "15px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                  marginTop: "20px",
                }}
              >
                <h3>Seznam uživatelů které jste přidali:</h3>

                {emails.length === 0 ? (
                  <Alert sx={{ marginBottom: "10px" }} severity="warning">
                    Přidejte členy do týmu.
                  </Alert>
                ) : (
                  <>
                    <TableContainer
                      component={Paper}
                      sx={{ border: "1px solid #ddd" }}
                    >
                      <Table>
                        <TableBody>
                          {emails.map((email, index) => (
                            <TableRow
                              key={index}
                             
                            >
                              <TableCell
                                sx={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                }}
                              >
                                {email}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                }}
                              >
                                <IconButton
                                
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() => handleEdit(index)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleDelete(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell >
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Box>

              <div>
                <TextField
                  id="name"
                  label="Jméno vlastníka týmu"
                  variant="outlined"
                  value={nameOwner}
                  onChange={(e) => setNameOwner(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </div>

              <div>
                <TextField
                  id="surname"
                  label="Příjmení vlastníka týmu"
                  variant="outlined"
                  value={surnameOwner}
                  onChange={(e) => setSurnameOwner(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </div>

              <div>
                <TextField
                  id="place"
                  label="Město týmu"
                  variant="outlined"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </div>

              {error && <Alert severity="error">{error}</Alert>}
              <Button
                variant="contained"
                onClick={handleCreateTeam}
                sx={{ marginTop: 2 }}
              >
                Potvrdit
              </Button>
            </form>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Step1;
