/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Link,
  Menu,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "../../../firebase/auth.utils";
import LogoTeam from "@/public/assets/logotym.png";
import demoUser from "@/public/assets/demoUser.png";
import { useRouter } from "next/router";

const GET_USER_INFO = gql`
  query GetUserInfo($email: String!) {
    getUserByNameAndSurname(email: $email) {
      Name
      Surname
      Id
    }
  }
`;

const GET_TEAM_DETAILS = gql`
  query GetTeamDetails($teamId: String!) {
    getTeamDetails(teamId: $teamId) {
      Name
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
interface NavProps {
  showOnlyIcon: boolean;
  setShowOnlyIcon: React.Dispatch<React.SetStateAction<boolean>>;
}

const Nav: React.FC<NavProps> = ({ showOnlyIcon, setShowOnlyIcon }) => {
  const router = useRouter();
  const { id } = router.query;
  const user = authUtils.getCurrentUser();
  const [, setMenuOpen] = useState(false);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [, setMenuOpen2] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: id, email: user?.email || "" },
    skip: !user,
  });

  const { loading, error, data } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: id },
  });

  const {
    loading: userInfoLoading,
    error: userInfoError,
    data: userInfoData,
  } = useQuery(GET_USER_INFO, {
    variables: { email: user?.email || "" },
    skip: !user,
  });

  if (loading || roleLoading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (error) return <p>Chyba: {error.message}</p>;
  if (roleError) return <p>Chyba: {roleError.message}</p>;

  const team = data.getTeamDetails;
  const teamName = team ? team.Name : "";
  const name = userInfoData?.getUserByNameAndSurname.Name || "";
  const surname = userInfoData?.getUserByNameAndSurname.Surname || "";
  const userId = userInfoData?.getUserByNameAndSurname.Id || "";
  const role = roleData?.getUserRoleInTeam.role || "";

  const toggleContentVisibility = () => {
    setShowOnlyIcon(!showOnlyIcon);
  };

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
    <Box>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#A020F0",
          display: "flex",
          justifyContent: "space-between",
          height: "4.2em",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open sidebar"
            onClick={toggleContentVisibility}
          >
            <Box sx={{ marginTop: "10px" }}>
              <MenuIcon sx={{ color: "white" }} />
            </Box>
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "8%",
            }}
          >
            <img
              src={LogoTeam.src}
              alt="Team Logo"
              style={{
                width: "3em",
                height: "3em",
                marginRight: "30px",
                marginTop: "2px",
              }}
            />
            <Box sx={{ display: "inline-block" }}>
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.6em",
                  marginLeft: "%",
                  marginTop: "3px",
                }}
              >
                {teamName}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: { xs: "auto", md: "auto" },
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              padding: "0.2em",
              paddingRight: "1em",
              paddingLeft: "1em",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.4vw",
                marginTop: "3px",
              }}
            >
              {role === "1" && "Management"}
              {role === "2" && "Trenér"}
              {role === "3" && "Hráč"}
            </Typography>
          </Box>

          <IconButton
            color="inherit"
            aria-label="open sidebar"
            sx={{ display: "flex", marginLeft: "3%", fontSize: "24px" }}
          >
            <Box sx={{ display: "flex", marginTop: "10px" }}>
              <Link href={`/`}>
                <ChatIcon sx={{ color: "white" }} />
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
                <Box sx={{ display: "flex", marginTop: "3px" }}>
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
                display: {
                  xs: "block",
                  marginTop: "1em",
                  marginLeft: "2em",
                },
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
                          <Link href={`/User/${userId}`}>
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
                marginLeft: { xs: "0", md: "2.5em" },
                marginTop: "3px",
              }}
            >
              <Avatar alt="Remy Sharp" src={demoUser.src} />
            </Box>
            <Menu
              id="menu-appbar2"
              anchorEl={anchorEl2}
              open={Boolean(anchorEl2)}
              onClose={handleCloseMenu}
              sx={{
                display: {
                  xs: "block",
                  marginTop: "1em",
                  marginLeft: "2em",
                },
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
                          <Link href={`/User/${userId}`}>
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
                        buttonStyle2,
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
                        buttonStyle2,
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
                marginTop: "3px",
              }}
            >
              {name} {surname}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Nav;
