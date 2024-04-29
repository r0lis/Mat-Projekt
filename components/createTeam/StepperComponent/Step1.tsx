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

const UPLOAD_IMAGE = gql`
  mutation UploadImageTeam($imageBase64: String!, $teamEmail: String!) {
    uploadImageTeam(imageBase64: $imageBase64, teamEmail: $teamEmail)
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
  const [uploadImage] = useMutation(UPLOAD_IMAGE);

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

      if(!selectedImage) {
        throw new Error("Vyberte prosím obrázek pro tým.");
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

      try {
        const imageBase64 = selectedImage;
  
        console.log("Base64 image:", imageBase64);
  
        // Call the GraphQL mutation with the image data
        await uploadImage({
          variables: {
            imageBase64,
            teamEmail: emailTeam,
          },
        });
  
        console.log("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
  
      onCompleteTeamCreation(emailTeam);
      console.log(emailTeam);
      setIsCreated(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (
      emailValue.trim() !== "" &&
      emailRegex.test(emailValue) &&
      emailValue !== currentUserEmail 
    ) {
      if (emails.includes(emailValue)) {
        setError2("Tento e-mail již existuje v seznamu.");
      } else {
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
      }
    } else {
      setError2("Prosím, zadejte platný e-mail, nebo email který v klubu ještě není, Váš email nezadávejte.");
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
    setImg(""); 
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
          Vytvoření klubu:
        </Typography>

        <Box sx={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}>
          {isCreated ? (
            <Alert severity="success">Klub byl úspěšně vytvořen!</Alert>
          ) : (
            <form>
              <div>
                <TextField
                  id="nameTeam"
                  label="Název klubu"
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
                  label="Klubový e-mail"
                  variant="outlined"
                  value={emailTeam}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  error={error3 !== null}
                  helperText={error3}
                />
              </div>

              <Box>
              <h3>Klubové logo</h3>

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

              <Box sx={{ marginBottom: "20px", width:"100%" }}>
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
                  Přidání členů klubu:
                </Typography>
              </Box>

              <Box
                style={{
                  display: "flex",
                  width: "100%",
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
                  sx={{ width: "100%" }}
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
                    Přidejte členy do klubu.
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
                  label="Jméno vlastníka klubu"
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
                  label="Příjmení vlastníka klubu"
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
                  label="Město klubu"
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
