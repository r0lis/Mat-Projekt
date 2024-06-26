/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from "react";
import { authUtils } from "../../firebase/auth.utils";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import logo from "../../public/assets/logo3.png";

import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  LinearProgress,
  Link,
  CircularProgress,
} from "@mui/material";
import photo from "../../public/assets/rosterbot.png";
import pictureBackground from "../../public/assets/uvodni.jpg";

const CHECK_USER_MEMBERSHIP = gql`
  query CheckUserMembershipInvite(
    $teamId: String!
    $currentUserEmail: String!
  ) {
    checkUserMembershipInvite(
      teamId: $teamId
      currentUserEmail: $currentUserEmail
    )
  }
`;

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
  const { id, email: initialEmail } = router.query;
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [progress, setProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Předvyplnění e-mailu, pokud je k dispozici v URL
    if (initialEmail) {
      setEmail(initialEmail as string);
    }
  }, [initialEmail]);

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

  const {
    loading: loadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery(CHECK_USER_MEMBERSHIP, {
    variables: { teamId: router.query.id, currentUserEmail: initialEmail },
  });

  if (loadingUser)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  if (errorUser) {
    console.error("Error checking user membership:", errorUser);
    return <p>Error checking user membership</p>;
  }

  const isUserMember = dataUser.checkUserMembershipInvite;
  if (isUserMember == false) {
    return (
      <Box>
        <Alert severity="error">
          Tato akce neni dostupná
          <br />
          <Link href="/">
            <Button sx={{ backgroundColor: "red" }}>
              <Typography sx={{ color: "#fff" }}>Zpět</Typography>
            </Button>
          </Link>
        </Alert>
      </Box>
    );
  }

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

  const isSmallView = window.innerWidth <= 800;

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
              display: isSmallView ? "none" : "",
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
                sx={{
                  marginLeft: "10%",
                  marginRight: "10%",
                  zIndex: "999",
                  marginTop: "1.5em",
                }}
              >
                <img src={logo.src} alt="logo" width="20%" height="auto" />

                <Typography
                  variant="h4"
                  sx={{
                    margin: "1rem",
                    marginTop: "0em",
                    marginBottom: "",
                    fontSize: "4vw",
                    fontFamily: "Roboto",
                    marginLeft: "10%",
                    fontWeight: "bold",
                    color: "white",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  Aplikace pro klubovou správu
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
          <Box sx={{ width: isSmallView? "100%" : "60%" }}>
          {isSmallView && (
              <Box
                sx={{
                  backgroundColor: "#b71dde",
                  height: "5em",
                  borderRadius: "15px 15px 0 0",
                }}
              >
                <Box sx={{ marginLeft: "2em", paddingTop: "0.8em" }}>
                  <img src={logo.src} alt="logo" width="150" height="auto" />
                </Box>
              </Box>
            )}
            <Box
              sx={{
                width: "75%", // Set the desired width for the box
                mx: "auto",
                paddingBottom:  isSmallView? "1em" : ""
              }}
            >
              <Box
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "100%",
                  marginTop: isSmallView? "" :  "5em",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    margin: "1rem",
                    marginTop: isSmallView? "" : "1em",
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
                      disabled={!!initialEmail}
                    />
                    <Box sx={{ display: "flex" }}>
                      <TextField
                        type={showPassword ? "text" : "password"}
                        label="Heslo"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                       <Box sx={{marginTop:"auto", marginBottom:"auto"}}>
                  <Button
                    variant="contained"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{
                      marginRight: "auto",
                      marginLeft:"0.5em",
                      display: "block",
                      backgroundColor: "#FFE0FE",
                      color: "black",
                      fontFamily: "Roboto",
                      fontWeight: "700",
                      border: "1px solid #ff96fc",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                      padding: "0.3em",
                      borderRadius: "4px",
                      "&:hover": { backgroundColor: "#b71dde" },
                    }}
                  >
                    {showPassword ? (
                      "Skrýt"
                    ) : (
                     "Zobrazit"
                    )}
                  </Button>
                  </Box>
                    </Box>
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
                        sx={{ marginTop: "1rem", marginBottom: "1rem" }}
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
                          ":hover": {
                            backgroundColor: "#b71dde",
                          },
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
                      <Box
                        sx={{
                          marginBottom: "1em",
                          marginTop: "1em",
                          textAlign: "center",
                        }}
                      >
                        <Alert severity="info">
                          <Typography>Jste přesměrován do klubu.</Typography>
                        </Alert>
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
