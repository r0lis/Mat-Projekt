/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Switch, Typography } from "@mui/material";
import Trainings from "../../public/assets/training.png";
import Calendar from "../../public/assets/Kalendar.png";
import Rousters from "../../public/assets/network.png";
import Nominations from "../../public/assets/Nomination.png";
import Members from "../../public/assets/Members.png";
import Settings from "../../public/assets/Settings.png";
import Image from "next/image";
import TrainingsComponent from "@/components/teamPage/Trenining";
import CalendarComponent from "@/components/teamPage/Calendar";
import RoustersComponent from "@/components/teamPage/Rousters";
import NominationsComponent from "@/components/teamPage/Matchs";
import MembersComponent from "@/components/teamPage/Members";
import SettingsComponent from "@/components/teamPage/Settings";
import TeamIcon from "@/public/assets/people.png";
import TeamComponent from "@/components/teamPage/Team";
import Nav from "../../components/teamPage/NavBar/Nav";
import { authUtils } from "@/firebase/auth.utils";
import RoleError from "@/components/teamPage/error/RoleError";
import LoginError from "@/components/teamPage/error/LoginError";
import MembershipError from "@/components/teamPage/error/MembershipError";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const items = [
  { label: "Kalendar", caption: "Kalendář", image: Calendar },
  { label: "Trainings", caption: "Tréninky", image: Trainings },
  { label: "Matchs", caption: "Zápasy", image: Nominations },
  { label: "Rouster", caption: "Soupisky", image: Rousters },
  { label: "Team", caption: "Tým", image: TeamIcon },
];

const GET_TEAM_DETAILS = gql`
  query GetTeamDetails($teamId: String!) {
    getTeamDetails(teamId: $teamId) {
      Name
    }
  }
`;

const CHECK_USER_MEMBERSHIP = gql`
  query CheckUserMembership($teamId: String!, $currentUserEmail: String!) {
    checkUserMembership(teamId: $teamId, currentUserEmail: $currentUserEmail)
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

const Team: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [showOnlyIcon, setShowOnlyIcon] = useState(true);
  const [menuOpen, setMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeLink, setActiveLink] = useState("Přehled");
  const [autoOpen, setAutoOpen] = useState(true);
  const currentUserEmail = authUtils.getCurrentUser()?.email || "";
  const user = authUtils.getCurrentUser();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleResizeThrottled = () => {
      if (windowWidth < 1000) {
        setShowOnlyIcon(true);
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      setActiveLink(hash || "Members"); // Default to "Přehled" if no hash is present
    };

    window.addEventListener("resize", handleResize);
    handleResizeThrottled();
    handleHashChange();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  const {
    loading: loadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery(CHECK_USER_MEMBERSHIP, {
    variables: { teamId: id, currentUserEmail },
  });

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

  if (loadingUser || roleLoading || loading)
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
  if (errorUser || roleError || error) {
    console.error("Error checking user membership:", errorUser);
    return <p>Error</p>;
  }

  const team = data.getTeamDetails;
  const isUserMember = dataUser.checkUserMembership;

  if (!currentUserEmail) {
    return (
      <Box>
        <LoginError />
      </Box>
    );
  }
  if (!isUserMember) {
    return (
      <Box>
        <MembershipError />
      </Box>
    );
  }

  const role = roleData?.getUserRoleInTeam?.role || "";

  if (role == 0) {
    return (
      <Box>
        <RoleError />
      </Box>
    );
  }

  const filteredItems = [
    ...items,
    {
      label: "Members",
      caption: role == 1 ? "Členové" : "Člen",
      image: Members,
    },

    {
      label: "Settings",
      caption: role == 1 ? "Správa" : "Klub",
      image: Settings,
    },
  ];
  const handleLinkClick = (label: string) => {
    setActiveLink(label);
    const newUrl = `${window.location.pathname!}#${label}`;
    window.history.pushState(null, "", newUrl);
  };

  const handleHover = (isHovering: boolean) => {
    if (!showOnlyIcon) {
      setIsHovered(isHovering);
    }
  };

  const isMobile = windowWidth < 600;

  return (
    <Box sx={{ display: "block", width: "100%", height: "100%" }}>
      {Boolean(team) && (
        <Box>
          <Nav
            showOnlyIcon={showOnlyIcon}
            setShowOnlyIcon={setShowOnlyIcon}
            menuOpen={menuOpen}
            setMenu={setMenu}
          />

          <Box
            className="sidebarContainer"
            onMouseEnter={() => {
              {
                if (autoOpen) {
                  setTimeout(() => {
                    setShowOnlyIcon(false);
                  }, 10);
                }
              }

              handleHover(true);
            }}
            onMouseLeave={() => {
              if (autoOpen) {
                setTimeout(() => {
                  setShowOnlyIcon(true);
                }, 10);
              }

              handleHover(false);
            }}
            sx={{
              display: menuOpen ? "block" : isMobile ? "none" : "block",
              alignItems: "center",
              backgroundColor: "#F0F2F5",
              width: showOnlyIcon ? "3.5em" : "11em",
              height: window.innerHeight < 570 ? "100%" : "100%",
              top: "0",
              position: "fixed", // Set position to fixed
              borderRight: `0.2em solid ${
                isHovered ? "rgba(160, 32, 240, 1)" : "rgba(160, 32, 240, 0.4)"
              }`,
              padding: "0",
              transition: "width 0.1s ease-in-out",
            }}
          >
            <Box sx={{ marginTop: "4.2em" }}>
              {filteredItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: "5px",
                    paddingBottom: "10px",
                    paddingTop: "10px",
                    left: "0px",
                    display: "flex",
                    alignItems: "center",
                    verticalAlign: "center",
                    backgroundColor:
                      activeLink === item.label ? "white" : "transparent",
                    borderRight:
                      activeLink === item.label
                        ? "0.2em solid rgba(160, 32, 240, 1)"
                        : "",
                    marginRight: activeLink === item.label ? "-0.2em" : "0px",
                    ":hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)", // Změna barvy pozadí při hoveru
                      cursor: "pointer", // Změna kurzoru na ukazovátko při hoveru
                    },
                  }}
                >
                  <Box
                    onClick={() => handleLinkClick(item.label)}
                    sx={{
                      textDecoration: "none",
                      display: "flex",
                      padding: "0",
                      width: "100%",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.label}
                      width={28}
                      height={28}
                      style={{ marginRight: "10px", marginLeft: "10px" }}
                    />
                    {showOnlyIcon ? null : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <span
                            style={{
                              fontSize: "1.1em",
                              color: "black",
                              verticalAlign: "center",
                              marginTop: "5px",
                              marginLeft: "10px",
                              marginRight: "10px",
                              opacity: showOnlyIcon ? 0 : 1,
                              transition: "opacity 0.2s ease 0.2s",
                              cursor: "pointer",
                            }}
                          >
                            {item.caption}
                          </span>
                        </Box>
                        {activeLink === item.label && (
                          <Box>
                            <ArrowForwardIosIcon sx={{ marginLeft: "auto" }} />
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}

              {showOnlyIcon ? null : (
                <span
                  style={{
                    fontSize: "1.1em",
                    color: "black",
                    verticalAlign: "center",
                    marginTop: "5px",
                    marginLeft: "10px",
                    marginRight: "10px",
                    opacity: showOnlyIcon ? 0 : 1,
                    transition: "opacity 0.2s ease 0.2s",
                    cursor: "pointer",
                    display: isMobile ? "none" : "inline-block",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Roboto",
                      fontWeight: "800",
                      marginLeft: "1em",
                      opacity: showOnlyIcon ? 0 : 1,
                      transition: "opacity 0.2s ease 0.2s",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Auto menu
                  </Typography>
                  <Box
                    sx={{
                      marginLeft: "1em",
                      marginRight: "auto",
                      display: "block",
                      opacity: showOnlyIcon ? 0 : 1,
                      transition: "opacity 0.2s ease 0.2s",
                    }}
                  >
                    <Switch
                      sx={{}}
                      checked={autoOpen}
                      onChange={() => setAutoOpen(!autoOpen)}
                    />
                  </Box>
                </span>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              marginLeft: menuOpen
                ? showOnlyIcon
                  ? "5em"
                  : "12em"
                : isMobile
                ? "1em"
                : showOnlyIcon
                ? "5em"
                : "12em",
              marginTop: "5em",
              height: "auto",
            }}
          >
            {activeLink === "Trainings" && (
              <TrainingsComponent teamId={id as string} />
            )}
            {activeLink === "Kalendar" && (
              <CalendarComponent teamId={id as string} />
            )}
            {activeLink === "Rouster" && (
              <RoustersComponent id={id as string} />
            )}
            {activeLink === "Matchs" && (
              <NominationsComponent teamId={id as string} />
            )}
            {activeLink === "Team" && <TeamComponent id={id as string} />}
            {activeLink === "Members" && <MembersComponent id={id as string} />}
            {activeLink === "Settings" && <SettingsComponent />}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Team;
