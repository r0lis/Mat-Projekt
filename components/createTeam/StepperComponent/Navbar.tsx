/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import {
  Typography,
  CircularProgress,
  Avatar,
  Button,
  Menu,
  Toolbar,
} from "@mui/material"; // Importujte CircularProgress z MUI
import HomeIcon from "@mui/icons-material/Home";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { authUtils } from "../../../firebase/auth.utils";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const GET_USER_INFO = gql`
  query GetUserInfo($email: String!) {
    getUserByNameAndSurname(email: $email) {
      Name
      Surname
      Id
      DateOfBirth
      Picture
    }
  }
`;

const Navbar: React.FC = () => {
  const router = useRouter();

  const user = authUtils.getCurrentUser();
  const [, setMenuOpen] = useState(false);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [, setMenuOpen2] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    loading: userInfoLoading,
    error: userInfoError,
    data: userInfoData,
  } = useQuery(GET_USER_INFO, {
    variables: { email: user?.email || "" },
    skip: !user,
  });

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const name = userInfoData?.getUserByNameAndSurname.Name || "";
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const surname = userInfoData?.getUserByNameAndSurname.Surname || "";
  const id = userInfoData?.getUserByNameAndSurname.Id || "";
  const userPicture = userInfoData?.getUserByNameAndSurname.Picture || "";
  const initials = name[0] + surname[0];

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setAnchorEl2(null);
  };

  const handleOpenMenu2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu2 = () => {
    setMenuOpen2(false);
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authUtils.logout();
      window.location.reload();
    } catch (error) {
      console.error("Chyba při odhlašování: ", error);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  const buttonStyle = {
    backgroundColor: "#FFE0FE",
    width: "11em",
    "&:hover": {
      backgroundColor: "#b71dde",
    },
    border: "1px solid #ff96fc",
  };

  const buttonStyle2 = {
    backgroundColor: "#FFE0FE",
    marginBottom: "1em",
    marginTop: "1em",
    width: "11em",
    "&:hover": {
      backgroundColor: "#b71dde",
    },
    border: "1px solid #ff96fc",
  };

  return (
    <div>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#A020F0",
          display: "flex",
          justifyContent: "space-between",
          height: "4.5em",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open sidebar"
            onClick={handleBackClick}
          >
            <Box sx={{ marginTop: "18px" }}>
              <ArrowBackIcon sx={{ color: "white" }} />
            </Box>
          </IconButton>

          <Box sx={{ marginLeft: "7%", marginRight: "7%", marginTop: "6px" }}>
            <Typography
              sx={{
                color: "white",
                textAlign: "center",
                fontSize: { xs: "1.0em", md: "2em" },
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Vytvořte klub
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: { xs: "auto", md: "auto" },
            }}
          >
           
          </Box>

          <IconButton
            color="inherit"
            aria-label="open sidebar"
            sx={{ display: "flex", marginLeft: "3%", fontSize: "24px" }}
          >
            <Box sx={{ display: "flex", marginTop: "14px" }}>
              <Link href={`/`}>
                <HomeIcon sx={{ color: "white" }} />
              </Link>
            </Box>
          </IconButton>

          <Box>
            <Box onClick={handleOpenMenu2}>
              <IconButton
                color="inherit"
                aria-label="open sidebar"
                sx={{
                  display: "flex",
                  marginLeft: { xs: "0.1%", md: "0.5%" },
                  fontSize: "24px",
                }}
              >
                <Box sx={{ display: "flex", marginTop: "8px" }}>
                  <CircleNotificationsIcon sx={{ color: "white" }} />
                </Box>
              </IconButton>
            </Box>
            <Menu
              id="menu-appbar2"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu2}
              sx={{
                display: { xs: "block", marginTop: "1em", marginLeft: "2em" },
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Box sx={{ width: "20rem", height: "auto" }}>
                {user ? (
                  <>
                    <Box>
                      <>
                        <Box>
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "4%",
                              marginBottom: "4%",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "black",
                                fontSize: "1.3em",
                                fontWeight: "bold",
                                marginBottom: "0.5em",
                                textAlign: "center",
                              }}
                            >
                              {userInfoLoading ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <CircularProgress color="primary" size={30} />
                                </Box>
                              ) : userInfoError ? (
                                "Chyba"
                              ) : (
                                userInfoData?.getUserByNameAndSurname.Name +
                                " " +
                                userInfoData?.getUserByNameAndSurname.Surname
                              )}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            borderBottom: "7px solid #b71dde ",
                            marginBottom: "1em",
                          }}
                        ></Box>

                        <Box sx={{ marginLeft: "7%", marginRight: "7%" }}>
                          <Typography
                            sx={{
                              color: "black",
                              textAlign: "center",
                              fontSize: "1.2em",
                              fontWeight: "bold",
                              textDecoration: "none",
                            }}
                          >
                            notifikace
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            borderBottom: "7px solid #b71dde ",
                            marginTop: "1em",
                            marginBottom: "1em",
                          }}
                        ></Box>

                        <Box
                          sx={{
                            alignItems: "center",
                            textAlign: "center",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <Link href={`/User/${id}`}>
                            <Button className="buttonStyle">
                              <Typography
                                sx={{
                                  color: "black",
                                  fontWeight: "bold",
                                  fontSize: "1 vw",
                                  lineHeight: "20px",
                                  padding: "5px",
                                }}
                              >
                                Správa účtu
                              </Typography>
                            </Button>
                          </Link>
                          <Button onClick={handleLogout} style={buttonStyle2}>
                            <Typography
                              sx={{
                                color: "black",
                                fontWeight: "bold",
                                fontSize: "1 vw",
                                lineHeight: "20px",
                                padding: "5px",
                              }}
                            >
                              Odhlásit se
                            </Typography>
                          </Button>
                        </Box>
                      </>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        alignItems: "center",
                        textAlign: "center",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        marginBottom: "2em",
                        marginTop: "2em",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "1.7vw",
                          lineHeight: "20px",
                        }}
                      >
                        LOGO
                      </Typography>
                    </Box>
                    <Box sx={{ borderBottom: "7px solid #b71dde " }}></Box>

                    <Box
                      sx={{
                        alignItems: "center",
                        textAlign: "center",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Link href="/LoginPage">
                        <Button sx={buttonStyle2}>
                          <Typography
                            sx={{
                              color: "black",
                              fontWeight: "bold",
                              fontSize: "1 vw",
                              lineHeight: "20px",
                              padding: "5px",
                            }}
                          >
                            Přihlásit se
                          </Typography>
                        </Button>
                      </Link>
                    </Box>
                    <Box
                      sx={{
                        alignItems: "center",
                        textAlign: "center",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "1em",
                        justifyContent: "center",
                      }}
                    >
                      <Link href="/UserRegistration">
                        <Button sx={buttonStyle}>
                          <Typography
                            sx={{
                              color: "black",
                              fontWeight: "bold",
                              fontSize: "1 vw",
                              lineHeight: "20px",
                              padding: "5px",
                            }}
                          >
                            Vytvořit účet
                          </Typography>
                        </Button>
                      </Link>
                    </Box>
                  </>
                )}
              </Box>
            </Menu>
          </Box>

          <Box>
            <Box
              onClick={handleOpenMenu}
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: { xs: "0.1%", md: "2.5em" },
                marginTop: "8px",
              }}
            >
              <Avatar
                sx={{
                  height: "2.5em",
                  width: "2.5em",
                  marginLeft: "auto",
                  marginRight: "1em",
                }}
                alt={initials}
                src={userPicture}
              />
            </Box>
            <Menu
              id="menu-appbar2"
              anchorEl={anchorEl2}
              open={Boolean(anchorEl2)}
              onClose={handleCloseMenu}
              sx={{
                display: { xs: "block", marginTop: "1em", marginLeft: "2em" },
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Box sx={{ width: "20rem", height: "auto" }}>
                {user ? (
                  <>
                    <Box>
                      <>
                        <Box>
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "4%",
                              marginBottom: "4%",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "black",
                                fontSize: "1.3em",
                                fontWeight: "bold",
                                marginBottom: "0.5em",
                                textAlign: "center",
                              }}
                            >
                              {userInfoLoading
                                ? "Načítání..."
                                : userInfoError
                                ? "Chyba"
                                : userInfoData?.getUserByNameAndSurname.Name +
                                  " " +
                                  userInfoData?.getUserByNameAndSurname.Surname}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            borderBottom: "7px solid #b71dde ",
                            marginBottom: "1em",
                          }}
                        ></Box>

                        <Box sx={{ marginLeft: "7%", marginRight: "7%" }}>
                          <Typography
                            sx={{
                              color: "black",
                              textAlign: "center",
                              fontSize: "1.2em",
                              fontWeight: "bold",
                              textDecoration: "none",
                            }}
                          >
                            demo
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            borderBottom: "7px solid #b71dde ",
                            marginTop: "1em",
                            marginBottom: "1em",
                          }}
                        ></Box>

                        <Box
                          sx={{
                            alignItems: "center",
                            textAlign: "center",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <Link href={`/User/${id}`}>
                            <Button className="buttonStyle">
                              <Typography
                                sx={{
                                  color: "black",
                                  fontWeight: "bold",
                                  fontSize: "1 vw",
                                  lineHeight: "20px",
                                  padding: "5px",
                                }}
                              >
                                Správa účtu
                              </Typography>
                            </Button>
                          </Link>
                          <Button onClick={handleLogout} style={buttonStyle2}>
                            <Typography
                              sx={{
                                color: "black",
                                fontWeight: "bold",
                                fontSize: "1 vw",
                                lineHeight: "20px",
                                padding: "5px",
                              }}
                            >
                              Odhlásit se
                            </Typography>
                          </Button>
                        </Box>
                      </>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        alignItems: "center",
                        textAlign: "center",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        marginBottom: "2em",
                        marginTop: "2em",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "1.7vw",
                          lineHeight: "20px",
                        }}
                      >
                        LOGO
                      </Typography>
                    </Box>
                    <Box sx={{ borderBottom: "7px solid #b71dde " }}></Box>

                    <Box
                      sx={{
                        alignItems: "center",
                        textAlign: "center",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Link href="/LoginPage">
                        <Button sx={buttonStyle2}>
                          <Typography
                            sx={{
                              color: "black",
                              fontWeight: "bold",
                              fontSize: "1 vw",
                              lineHeight: "20px",
                              padding: "5px",
                            }}
                          >
                            Přihlásit se
                          </Typography>
                        </Button>
                      </Link>
                    </Box>
                    <Box
                      sx={{
                        alignItems: "center",
                        textAlign: "center",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "1em",
                        justifyContent: "center",
                      }}
                    >
                      <Link href="/UserRegistration">
                        <Button sx={buttonStyle}>
                          <Typography
                            sx={{
                              color: "black",
                              fontWeight: "bold",
                              fontSize: "1 vw",
                              lineHeight: "20px",
                              padding: "5px",
                            }}
                          >
                            Vytvořit účet
                          </Typography>
                        </Button>
                      </Link>
                    </Box>
                  </>
                )}
              </Box>
            </Menu>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", marginLeft: "1%" }}>
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.4vw",
                marginLeft: "%",
                marginTop: "8px",
              }}
            >
              {name} {surname}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
