/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Switch, Typography } from "@mui/material";
import Overview from "../../public/assets/Overview.png";
import Trainings from "../../public/assets/training.png";
import Calendar from "../../public/assets/Kalendar.png";
import Rousters from "../../public/assets/network.png";
import Nominations from "../../public/assets/Nomination.png";
import Pay from "../../public/assets/pay.png";
import Events from "../../public/assets/Event.png";
import Members from "../../public/assets/Members.png";
import Settings from "../../public/assets/Settings.png";
import Image from "next/image";
import OverviewComponent from "@/components/teamPage/Overview";
import TrainingsComponent from "@/components/teamPage/Training";
import CalendarComponent from "@/components/teamPage/Calendar";
import RoustersComponent from "@/components/teamPage/Rousters";
import NominationsComponent from "@/components/teamPage/Nominations";
import PayComponent from "@/components/teamPage/Paying";
import EventsComponent from "@/components/teamPage/Events";
import MembersComponent from "@/components/teamPage/Members";
import SettingsComponent from "@/components/teamPage/Settings";
import TeamIcon from "@/public/assets/people.png";
import TeamComponent from "@/components/teamPage/Team";
import Nav from "../../components/teamPage/NavBar/Nav";
import { authUtils } from "@/firebase/auth.utils";
import RoleError from "@/components/teamPage/error/RoleError";
import LoginError from "@/components/teamPage/error/LoginError";
import MembershipError from "@/components/teamPage/error/MembershipError";

const items = [
  { label: "Přehled", image: Overview },
  { label: "Kalendář", image: Calendar },
  { label: "Události", image: Events },
  { label: "Tréninky", image: Trainings },
  { label: "Zápasy", image: Nominations },
  { label: "Soupisky", image: Rousters },
  { label: "Tým", image: TeamIcon },
  { label: "Členové", image: Members },
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

    window.addEventListener("resize", handleResize);
    handleResizeThrottled();

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

  const filteredItems =
    role == 1
      ? [
          ...items,
          { label: "Platby", image: Pay },
          { label: "Správa", image: Settings },
        ]
      : items;

  const handleLinkClick = (label: string) => {
    setActiveLink(label);
  };

  const handleHover = (isHovering: boolean) => {
    if (!showOnlyIcon) {
      setIsHovered(isHovering);
    }
  };

  return (
    <Box sx={{ display: "block", width: "100%", height: "100%" }}>
      {Boolean(team) && (
        <Box>
          <Nav showOnlyIcon={showOnlyIcon} setShowOnlyIcon={setShowOnlyIcon} />

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
                // Set a delay of 500 milliseconds (adjust as needed)
                setTimeout(() => {
                  setShowOnlyIcon(true);
                }, 10);
              }

              handleHover(false);
            }}
            sx={{
              display: "block",
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
                        : "", // Zvýraznění aktivního odkazu
                    marginRight: activeLink === item.label ? "-0.2em" : "0px",
                    // Zvýraznění aktivního odkazu
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
                        {item.label}
                      </span>
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
                    Auto open
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
              marginLeft: showOnlyIcon ? "5em" : "12em",
              marginTop: "5em",
              height: "auto",
            }}
          >
            {activeLink === "Přehled" && <OverviewComponent />}
            {activeLink === "Tréninky" && <TrainingsComponent />}
            {activeLink === "Kalendář" && <CalendarComponent />}
            {activeLink === "Soupisky" && <RoustersComponent />}
            {activeLink === "Zápasy" && <NominationsComponent />}
            {activeLink === "Události" && <EventsComponent />}
            {activeLink === "Tým" && <TeamComponent id={id as string} />}
            {activeLink === "Členové" && <MembersComponent id={id as string} />}
            {activeLink === "Platby" && <PayComponent />}
            {activeLink === "Správa" && <SettingsComponent />}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Team;
