/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import LoginIcon from "../../public/assets/user.png";
import LoginIcon2 from "../../public/assets/user2.png";
import { authUtils } from "../../firebase/auth.utils";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import TeamLogoImg from "../../public/assets/logotym.png";
import { Avatar, CircularProgress } from "@mui/material";

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

const GET_TEAM_NAMES = gql`
  query GetTeamNames($email: String!) {
    getUserTeamsByEmail(email: $email) {
      teamId
      Name
      Logo
    }
  }
`;

type Team = {
  teamId: string;
  Name: string;
  Logo: string;
};

const pages = ["Obsah", "Ukázky", "Použití", "Kontakt"];

const Navbar: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [, setMenuOpen] = useState(false);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const user = authUtils.getCurrentUser();

  const {
    loading: userInfoLoading,
    error: userInfoError,
    data: userInfoData,
  } = useQuery(GET_USER_INFO, {
    variables: { email: user?.email || "" },
    skip: !user,
  });

  const {
    loading: userIdLoading,
    error: userIdError,
    data: userTeamsData,
  } = useQuery(GET_TEAM_NAMES, {
    variables: { email: user?.email || "" },
  });

  const name = userInfoData?.getUserByNameAndSurname.Name || "";
  const surname = userInfoData?.getUserByNameAndSurname.Surname || "";
  const id = userInfoData?.getUserByNameAndSurname.Id || "";
  const userPicture = userInfoData?.getUserByNameAndSurname.Picture || "";
  const initials = name[0] + surname[0];
  const test = true;
  console.log(initials);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    try {
      await authUtils.logout();
      window.location.reload();
    } catch (error) {
      console.error("Chyba při odhlašování: ", error);
    }
  };

  const hoverStyle = {
    backgroundColor: "lightgray",
    "&:hover": {
      backgroundColor: "lightblue",
    },
  };

  const buttonStyle = {
    backgroundColor: "#FFE0FE",
    width: "11em",
    "&:hover": {
      backgroundColor: "#b71dde",
    },
    border: "1px solid #ff96fc",
    whiteSpace: "nowrap",
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
    <AppBar
      sx={{ backgroundColor: "#DA1AAD", height: "4.5em" }}
      position="static"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div className="logoAndButtonStyle">
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                fontFamily: "monospace",
                fontWeight: "bold",
                letterSpacing: ".3rem",
                color: "white",
                textDecoration: "none",
                marginTop: "0.5em",
              }}
            >
              LOGO
            </Typography>
          </div>

          <Box
            sx={{
              position: "relative",
              left: "25%",
              marginRight: "25%",
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  marginRight: "2.5em",
                  color: "white",
                  display: "block",
                  fontWeight: "bold",
                  fontSize: "1.1vw",
                  position: "relative",
                  lineHeight: "20px",
                }}
              >
                {page}
                <span
                  className="bottom-border"
                  style={{
                    position: "absolute",
                    bottom: "-3px",
                    left: "0",
                    right: "0",
                    height: "5px",
                    borderRadius: "5px 5px 5px 5px",
                    backgroundColor: "whiteSmoke",
                  }}
                ></span>
              </Button>
            ))}
          </Box>

          <Box
            sx={{
              position: "relative",
              marginLeft: ["25%", "40%", "20%"],
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <div>
            <Box
              sx={{
                height: "6%",
                width: "6%",
                position: "relative",
                marginTop: "0.4em",
              }}
              onClick={handleOpenMenu}
            >
              <Avatar
                sx={{
                  height: "2.7em",
                  width: "2.7em",
                  marginLeft: "auto",
                  marginRight: ["0.5rem", "1.5rem", "1rem"],
                }}
                alt={initials}
                src={user ? userPicture : LoginIcon.src} // Set src to user's picture URL if it exists
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
                            {userIdLoading ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <CircularProgress color="primary" size={30} />
                              </Box>
                            ) : userIdError ? (
                              "Chyba"
                            ) : userTeamsData &&
                              userTeamsData.getUserTeamsByEmail &&
                              userTeamsData.getUserTeamsByEmail.length > 0 ? (
                              userTeamsData.getUserTeamsByEmail.map(
                                (team: Team, index: number) => (
                                  <Box
                                    sx={{
                                      marginBottom: "1em",
                                      padding: "3%",
                                      borderRadius: "10px",
                                      ...hoverStyle,
                                      border: "1px solid gray",
                                    }}
                                  >
                                    <Link
                                      key={index}
                                      href={`/Team/${team.teamId}`}
                                      style={{
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Avatar
                                        alt="Team Logo"
                                        src={team.Logo}
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          marginRight: "1em",
                                        }}
                                      />
                                      <div style={{ color: "black" }}>
                                        {team.Name}
                                      </div>
                                    </Link>
                                  </Box>
                                )
                              )
                            ) : (
                              "Nemáte žádný tým"
                            )}
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
                                Správa účtu
                              </Typography>
                            </Button>
                          </Link>
                          <Button onClick={handleLogout} sx={buttonStyle2}>
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
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Link href="/UserRegistration">
                        <Button sx={buttonStyle}>
                          <Typography
                            sx={{
                              color: "black",
                              whiteSpace: "nowrap",
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
          </div>

          <Box sx={{ marginRight: "5%", marginLeft: "3%", marginTop: "0.5em" }}>
            <Link style={{ textDecoration: "none" }} href="/CreateTeam">
              <Button
                className="CreateTeamButton"
                sx={{
                  backgroundColor: "#b71dde",
                  borderRadius: "7px",
                  boxShadow: "0 0 10px rgba(51, 0, 45, 0.8)",
                  border: "1px solid #b71dde",
                }}
                variant="contained"
              >
                <Typography
                  className="CreateTeamButtonText"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: ["0.8rem", "0.8rem", "1.2rem"],
                    lineHeight: "15px",
                    fontFamily: "Roboto",
                  }}
                >
                  VYTVOŘIT KLUB
                </Typography>
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
