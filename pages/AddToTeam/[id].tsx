/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from "react";
import { authUtils } from "../../firebase/auth.utils";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  LinearProgress,
} from "@mui/material";
import photo from "../../public/assets/rosterbot.png";
import pictureBackground from "../../public/assets/uvodni.jpg";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $id: String!) {
    addUserToTeam(email: $email, teamId: $id) # replace "your-team-id" with the actual teamId
  }
`;

const AddToTeam: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, setIsLoggedIn] = useState(false);
  const [loginSuccess, setLoginSuccessSuccess] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loginSuccess) {
      let value = 0;
      const increment = 100 / 10; // Increment by 10% every second

      // Increment progress every second until it reaches 100
      timer = setInterval(() => {
        value += increment;
        setProgress(Math.min(value, 100));

        if (value >= 100) {
          clearInterval(timer);
          if (id) {
            router.push(`/Team/${id}`);
          }
        }
      }, 500);
    }

    return () => {
      // Clear the interval if the component unmounts or if login is unsuccessful
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [loginSuccess, id, router]);

  const handleLogin = async () => {
    try {
      await authUtils.login(email, password);

      setIsLoggedIn(true);
      setLoginSuccessSuccess(true);
      setError(null);
      await loginMutation({ variables: { email, id } });
    } catch (error) {
      console.error("Chyba při přihlašování:", error);
      setError("Přihlášení selhalo. Zkontrolujte e-mail a heslo.");
      setIsLoggedIn(false);
      setLoginSuccessSuccess(false);
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
                  width: "100%ss",
                  marginTop: "5em",
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
                  {!loginSuccess && "Pro přidání do týmu se prosím přihlašte."}
                  {loginSuccess && "Jste přídán do týmu."}
                </Typography>
              </Box>

              <Box sx={{ widht: "10%" }}>
                {!loginSuccess && (
                  <>
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
                  {loginSuccess && (
                    <Alert
                      severity="success"
                      sx={{
                        
                        marginTop: "1rem",
                        textAlign: "center",
                      }} // Set background color to orange
                    >
                      <Typography
                        variant="body1"
                        color="success"
                        sx={{ marginTop: "1rem", marginBottom:'1rem' }}
                      >
                        Přihlášení se zdařilo.
                      </Typography>
                    </Alert>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                      marginLeft: "auto",
                      marginRight: "auto",
                      minWidth: "400px", // Adjust the width as needed
                    }}
                  >
                    {!loginSuccess && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                        sx={{
                          marginTop: "1rem",
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
                        Přihlásit se
                      </Button>
                    )}
                  </Box>
                  {loginSuccess && (
                    <Box
                      sx={{
                        width: "100%",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      <Box sx={{ marginBottom: "1em", marginTop: "1em", textAlign:'center' }}>
                        <Alert severity="info"><Typography>Jste přesměrován do týmu.</Typography></Alert>
                      </Box>
                      <LinearProgress variant="determinate" value={progress} />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddToTeam;
