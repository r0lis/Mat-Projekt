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
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "../../../firebase/auth.utils";
import { useRouter } from "next/router";
import logo from "../../../public/assets/logo1.png";

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

const GET_TEAM_DETAILS = gql`
  query GetTeamDetails($teamId: String!) {
    getTeamDetails(teamId: $teamId) {
      Name
      Logo
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
  menuOpen: boolean;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const Nav: React.FC<NavProps> = ({
  showOnlyIcon,
  setShowOnlyIcon,
  menuOpen,
  setMenu,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const user = authUtils.getCurrentUser();
  const [, setMenuOpen] = useState(false);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);

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
  if (error) return <p>Chyba: {error.message}</p>;
  if (roleError) return <p>Chyba: {roleError.message}</p>;

  const team = data.getTeamDetails;
  const teamName = team ? team.Name : "";
  const teamLogo = team ? team.Logo : "";
  const name = userInfoData?.getUserByNameAndSurname.Name || "";
  const surname = userInfoData?.getUserByNameAndSurname.Surname || "";
  const userId = userInfoData?.getUserByNameAndSurname.Id || "";
  const role = roleData?.getUserRoleInTeam.role || "";
  const userPicture = userInfoData?.getUserByNameAndSurname.Picture || "";
  const initials = name[0] + surname[0];

  const toggleContentVisibility = () => {
    setShowOnlyIcon(!showOnlyIcon);
  };
  const toggleContentVisibilityMobile = () => {
    setMenu(!menuOpen);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    try {
      router.push("/");
      await authUtils.logout();
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

  const isSmallView = window.innerWidth >= 850;
  const isSmallView2 = window.innerWidth >= 550;
  const isMobile = window.innerWidth < 600;

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#A020F0",
          display: "flex",
          justifyContent: "space-between",
          height: "4.2em",
          alignItems: "hotizontal",
        }}
      >
        <Toolbar>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open sidebar"
              onClick={toggleContentVisibilityMobile}
            >
              <Box sx={{ marginTop: isMobile ? "14px" : "11px" }}>
                <MenuIcon sx={{ color: "white" }} />
              </Box>
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open sidebar"
              onClick={toggleContentVisibility}
            >
              <Box sx={{ marginTop: "11px" }}>
                <MenuIcon sx={{ color: "white" }} />
              </Box>
            </IconButton>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: isSmallView ? "8%" : "2%",
            }}
          >
            <Avatar
              src={teamLogo}
              alt="Team Logo"
              style={{
                width: "2.8em",
                height: "2.8em",
                marginRight: "30px",
                marginTop: isMobile ? "5px" : "3px",
              }}
            />
            <Box sx={{ display: isSmallView2 ? "flex" : "none" }}>
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.6em",
                  marginLeft: "%",
                  marginTop: isMobile ? "9px" : "4px",
                  whiteSpace: "nowrap",
                }}
              >
                {teamName}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: isSmallView ? "flex" : "none",
              alignItems: "center",
              marginLeft: { xs: "auto", md: "auto" },
              marginRight: "1%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              marginTop: isMobile ? "9px" : "3px",
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
            sx={{
              marginLeft: isSmallView ? "" : "auto",
              marginRight: isSmallView ? "" : "",
            }}
          >
            <Box
              sx={{ display: "flex", marginTop: isMobile ? "15px" : "10px" }}
            >
              <Link href={`/`}>
                <HomeIcon
                  sx={{ color: "white", marginTop: isMobile ? "15´´px" : "" }}
                />
              </Link>
            </Box>
          </IconButton>

          <Box
            sx={{
              marginLeft: isSmallView ? "" : "5%",
              marginRight: isSmallView ? "" : "5%",
            }}
          >
            <Box
              onClick={handleOpenMenu}
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: { xs: "0", md: "2.5em" },
                marginTop: isMobile ? "6px" : "3px",
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
                src={userPicture} // Set src to user's picture URL if it exists
              />
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

                        <Box
                          sx={{
                            alignItems: "center",
                            textAlign: "center",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            "&:hover img": {
                              transform: "scale(1.1)",
                              transition: "transform 0.3s ease",
                            },
                          }}
                        >
                          <img
                            src={logo.src}
                            alt="logo"
                            style={{
                              width: "15em",
                              top: "0.5em",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            borderBottom: "7px solid #b71dde ",
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
                          <Button
                            onClick={handleLogout}
                            sx={{
                              backgroundColor: "#FFE0FE",
                              marginBottom: "1em",
                              marginTop: "1em",
                              width: "11em",
                              "&:hover": {
                                backgroundColor: "#b71dde",
                              },
                              border: "1px solid #ff96fc",
                            }}
                          >
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
                        backgroundColor: "#FFE0FE",
                        marginBottom: "1em",
                        marginTop: "1em",
                        width: "11em",
                        "&:hover": {
                          backgroundColor: "#b71dde",
                        },
                        border: "1px solid #ff96fc",
                      }}
                    >
                      <Link href="/LoginPage">
                        <Button
                          sx={{
                            backgroundColor: "#FFE0FE",
                            marginBottom: "1em",
                            marginTop: "1em",
                            width: "11em",
                            "&:hover": {
                              backgroundColor: "#b71dde",
                            },
                            border: "1px solid #ff96fc",
                          }}
                        >
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
                        backgroundColor: "#FFE0FE",
                        marginTop: "1em",
                        width: "11em",
                        "&:hover": {
                          backgroundColor: "#b71dde",
                        },
                        border: "1px solid #ff96fc",
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

          <Box
            sx={{
              display: isSmallView ? "flex" : "none",
              alignItems: "center",
              marginLeft: "1%",
              marginRight: isSmallView ? "1%" : "",
            }}
          >
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
