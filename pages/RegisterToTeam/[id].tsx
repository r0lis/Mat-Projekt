/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { authUtils } from "../../firebase/auth.utils";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { Box, Button, TextField, Typography, Link, Alert } from "@mui/material";
import photo from "../../public/assets/rosterbot.png";
import pictureBackground from "../../public/assets/uvodni.jpg";

const CREATE_USER_TO_TEAM_MUTATION = gql`
  mutation createUserToTeam(
    $Name: String!
    $Surname: String!
    $Email: String!
    $IdUser: String!
    $IdTeam: [String]!
  ) {
    createUserToTeam(
      input: {
        Name: $Name
        Surname: $Surname
        Email: $Email
        IdUser: $IdUser
        IdTeam: $IdTeam
      }
    ) {
      Name
      Surname
      IdUser
      IdTeam
      Email
      # Další údaje, které chcete získat
    }
  }
`;

const RegistrationPage: React.FC = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [verificationSuccess, setverificationSuccess] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const [createUser] = useMutation(CREATE_USER_TO_TEAM_MUTATION);

  const isEmailValid = email.includes("@");
  const isPasswordValid = password.length >= 6;

  const handleRegister = async () => {
    try {
      if (!isEmailValid || !isPasswordValid) {
        throw new Error("Neplatný e-mail nebo heslo.");
      }

      if (password !== confirmPassword) {
        throw new Error("Hesla se neshodují.");
      }

      await authUtils.register(email, password);

      const user = authUtils.getCurrentUser();

      if (user) {
        setRegistrationSuccess(true);
      } else {
        throw new Error("Chyba při vytváření uživatele.");
      }
    } catch (error: any) {
      setError(error.message);
      setRegistrationSuccess(false);
    }
  };

  const handleEmailVerification = async () => {
    try {
      await authUtils.sendEmailVerification();
      const user = authUtils.getCurrentUser();
      setverificationSuccess(true);

      if (user) {
        await user.reload();

        if (user.emailVerified) {
          const response = await createUser({
            variables: {
              Name: name,
              Surname: surname,
              Email: email,
              IdUser: "fefefef",
              IdTeam: [id as string],
            },
          });
          setverificationSuccess(true);

          router.push(`/`);
        } else {
          await authUtils.deleteUser();
          throw new Error("E-mailová adresa není ověřena.");
        }
      } else {
        throw new Error("Uživatel nebyl nalezen.");
      }
    } catch (error: any) {
      setError(error.message);
      await authUtils.deleteUser();
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F0F2F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)",
          borderRadius: "15px",
          margin: "0 1rem",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Box
            sx={{
              width: "90%",
              position: "relative",
              zIndex: "1", // Ensure content is above the background image
              borderRadius: "0 0 15px 15px",
            }}
          >
            <img
              src={pictureBackground.src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.85,
                borderRadius: "15px 0 0px 15px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: "2", // Set a higher z-index for content
              }}
            >
              <Box
                sx={{ marginLeft: "10%", marginRight: "10%", zIndex: "999" }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontFamily: "Roboto",
                    fontWeight: "700",
                    marginTop: "1em",
                  }}
                >
                  LOGO
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    margin: "1rem",
                    marginTop: "0.7em",
                    marginBottom: "auto",
                    fontSize: "4vw",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    color: "white",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  TEAM MANAGER
                </Typography>
              </Box>
              <Box
                sx={{
                  marginLeft: "10%",
                  marginRight: "10%",
                  zIndex: "999",
                  marginTop: "2em",
                  position: "relative",
                }}
              >
                <img src={photo.src} alt="logo" width="100%" height="auto" />
              </Box>
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                width: "75%", // Set the desired width for the box
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "2em",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    margin: "1rem",
                    marginTop: "1em",
                    fontFamily: "Roboto",
                    fontWeight: "500",
                  }}
                >
                  Registrace uživatele a přidání do týmu
                </Typography>
              </Box>

              <Box sx={{ widht: "10%" }}>
              {!registrationSuccess && (
                  <>
                    <TextField
                      type="text"
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      type="text"
                      label="Surname"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      type="email"
                      label="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      type="password"
                      label="Heslo"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      type="password"
                      label="Potvrzení hesla"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  </>
                )}
                <Box>
                  {error && (
                    <Alert
                    severity="error"
                    sx={{
                      width: "auto",
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "1rem",
                      textAlign: "center",
                      color: "white",
                    }} // Set background color to red
                    >
                       <Typography
                        variant="body1"
                        color="error"
                        sx={{ marginTop: "1rem" }}
                      >
                        {error}
                      </Typography>
                    </Alert>
                  )}
                  {registrationSuccess && (
                     <Alert
                     severity="success"
                     sx={{
                       width: "auto",
                       marginLeft: "auto",
                       marginRight: "auto",
                       marginTop: "1rem",
                       textAlign: "right",
                     }} // Set background color to orange
                   >
                     <Typography
                       variant="body1"
                       color="success"
                       sx={{ marginTop: "1rem" }}
                     >
                       Registrace úspěšná. Ověřte svůj e-mail, abyste mohli
                       pokračovat.
                     </Typography>
                     <Button
                       variant="contained"
                       color="primary"
                       onClick={handleEmailVerification}
                       sx={{ marginTop: "1rem" }}
                     >
                       Ověřit E-mail
                     </Button>
                   </Alert>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                      marginLeft: "auto",
                      marginRight: "auto",
                      maxWidth: "300px", // Adjust the width as needed
                    }}
                  >
                    {!registrationSuccess && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                        sx={{
                          marginTop: "1rem",
                          marginLeft: "auto",
                          marginRight: "auto",
                          display: "block",
                          backgroundColor: "#FFE0FE",
                          color: "black",
                          fontFamily: "Roboto",
                          fontWeight: "700",
                          border: "1px solid #ff96fc",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                          padding: "0.7em",
                          borderRadius: "4px",
                        }}
                      >
                        Registrovat
                      </Button>
                    )}
                   
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  marginTop: "1em",
                  marginBottom: "2em",
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: "700",
                    color: "#b71dde",
                  }}
                >
                  
                  <Link
                    href={`/RegisterToTeam/${id}`}
                    sx={{
                      marginRight: "1rem",
                      marginTop: "1rem",
                      color: "#b71dde",
                      textDecoration: "none",
                    }}
                  >
                    Zkusit znovu
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegistrationPage;
