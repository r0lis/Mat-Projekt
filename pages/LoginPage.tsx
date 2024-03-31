/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import { authUtils } from "../firebase/auth.utils";
import { useRouter } from "next/router";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import photo from "../public/assets/rosterbot.png";
import pictureBackground from "../public/assets/uvodni.jpg";
import logo from "../public/assets/logo3.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      await authUtils.login(email, password);

      setIsLoggedIn(true);
      setError(null);

      router.push("/");
    } catch (error) {
      console.error("Chyba při přihlašování:", error);
      setError("Přihlášení selhalo. Zkontrolujte e-mail a heslo.");
      setIsLoggedIn(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await authUtils.forgotPassword(email);
      setError("E-mail pro obnovu hesla byl úspěšně odeslán.");
    } catch (error) {
      setError(
        "Nepodařilo se odeslat e-mail pro obnovu hesla. Zkontrolujte, zda je zadaná e-mailová adresa správná."
      );
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
              position: "relative",
              display: isSmallView ? "none" : "",
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
                  marginLeft: "5%",
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
                  marginTop: "0.5em",
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
                
              }}
            >
              <Box
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: isSmallView? "1em" : "2em",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    margin: "1rem",
                    marginTop: isSmallView? "0em" : "1em",
                    fontFamily: "Roboto",
                    fontWeight: "500",
                  }}
                >
                  Přihlášení
                </Typography>
              </Box>

              <Box>
                <TextField
                  type="email"
                  label="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <Box sx={{ display: "flex" }}>
                  <TextField
                    type={showPassword ? "text" : "password"}
                    label="Heslo"
                    value={password}
                    onSubmit={handleLogin}
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

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
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
                    "&:hover": { backgroundColor: "#b71dde" },
                  }}
                >
                  Přihlásit
                </Button>
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
                      marginBottom: "0.2rem",
                    }}
                  >
                    <Box>
                      <Link
                        href="/UserRegistration"
                        sx={{
                          marginRight: "1rem",
                          marginTop: "1rem",
                          color: "#b71dde",
                          textDecoration: "none",
                          position: "relative",
                          "&::before": {
                            content: "''",
                            position: "absolute",
                            width: "100%",
                            height: "4px",
                            borderRadius: "4px",
                            backgroundColor: "#b71dde",
                            bottom: "-4px", // Adjust position to place it below the text
                            left: "0",
                            transformOrigin: "right",
                            transform: "scaleX(0)",
                            transition: "transform 0.3s ease-in-out",
                          },
                          "&:hover::before": {
                            transformOrigin: "left",
                            transform: "scaleX(1)",
                          },
                        }}
                      >
                        Registrovat
                      </Link>
                    </Box>
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "Roboto",
                      fontWeight: "700",
                      color: "#b71dde",
                      marginBottom: "0.2rem",
                    }}
                  >
                    <Box>
                      <Link
                        onClick={handleForgotPassword}
                        sx={{
                          marginRight: "1rem",
                          marginTop: "1.5rem",
                          color: "#b71dde",
                          textDecoration: "none",
                          cursor: "pointer",
                          position: "relative",
                          "&::before": {
                            content: "''",
                            position: "absolute",
                            width: "100%",
                            height: "4px",
                            borderRadius: "4px",
                            backgroundColor: "#b71dde",
                            bottom: "-4px", // Adjust position to place it below the text
                            left: "0",
                            transformOrigin: "right",
                            transform: "scaleX(0)",
                            transition: "transform 0.3s ease-in-out",
                          },
                          "&:hover::before": {
                            transformOrigin: "left",
                            transform: "scaleX(1)",
                          },
                        }}
                      >
                        Zapomenuté heslo
                      </Link>
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Roboto",
                      fontWeight: "700",
                      color: "#b71dde",
                    }}
                  >
                    <Box>
                      <Link
                        href="/"
                        sx={{
                          marginTop: "1rem",
                          color: "#b71dde",
                          textDecoration: "none",
                          position: "relative",
                          "&::before": {
                            content: "''",
                            position: "absolute",
                            width: "100%",
                            height: "4px",
                            borderRadius: "4px",
                            backgroundColor: "#b71dde",
                            bottom: "-4px", // Adjust position to place it below the text
                            left: "0",
                            transformOrigin: "right",
                            transform: "scaleX(0)",
                            transition: "transform 0.3s ease-in-out",
                          },
                          "&:hover::before": {
                            transformOrigin: "left",
                            transform: "scaleX(1)",
                          },
                        }}
                      >
                        Zpět
                      </Link>
                    </Box>
                  </Typography>
                </Box>

                {error && (
                  <Typography
                    variant="body1"
                    color="error"
                    sx={{ marginTop: "1rem" }}
                  >
                    {error}
                  </Typography>
                )}
                {isLoggedIn && (
                  <Typography
                    variant="body1"
                    color="success"
                    sx={{ marginTop: "1rem" }}
                  >
                    Přihlášení úspěšné.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
