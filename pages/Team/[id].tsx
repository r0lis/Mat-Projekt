import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@mui/material";
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

const items = [
  { label: "Přehled", image: Overview },
  { label: "Tréninky", image: Trainings },
  { label: "Kalendář", image: Calendar },
  { label: "Zápasy", image: Nominations },
  { label: "Soupisky", image: Rousters },
  { label: "Platby", image: Pay },
  { label: "Události", image: Events },
  { label: "Tým", image: TeamIcon },
  { label: "Členové", image: Members },
  { label: "Správa", image: Settings },
];

const GET_TEAM_DETAILS = gql`
  query GetTeamDetails($teamId: String!) {
    getTeamDetails(teamId: $teamId) {
      Name
    }
  }
`;

function Team() {
  const router = useRouter();
  const { id } = router.query;
  const [showOnlyIcon, setShowOnlyIcon] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeLink, setActiveLink] = useState("Přehled");

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

  const { loading, error, data } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: id },
  });

  if (loading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (error) return <p>Chyba: {error.message}</p>;

  const team = data.getTeamDetails;

  const handleLinkClick = (label: string) => {
    setActiveLink(label);
  };

  const handleHover = (isHovering: boolean) => {
    if (!showOnlyIcon) {
      setIsHovered(isHovering);
    }
  };

  return (
    <Box>
      {Boolean(team) && (
        <Box>
          <Nav showOnlyIcon={showOnlyIcon} setShowOnlyIcon={setShowOnlyIcon} />

          <Box
            className="sidebarContainer"
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            style={{
              display: "block",
              alignItems: "center",
              backgroundColor: "#F0F2F5",
              width: showOnlyIcon ? "4.5em" : "11em",
              maxWidth: "20em",
              height: "100%",
              position: "absolute",
              borderRight: `0.3em solid ${
                isHovered ? "rgba(160, 32, 240, 1)" : "rgba(160, 32, 240, 0.4)"
              }`,
              padding: "0",
              transition: "width 0.1s ease-in-out",
            }}
          >
            {items.map((item, index) => (
              <Box
                key={index}
                sx={{
                  padding: "10px",
                  left: "0px",
                  display: "flex",
                  alignItems: "center",
                  verticalAlign: "center",
                  backgroundColor:
                    activeLink === item.label ? "white" : "transparent",
                  borderRight:
                    activeLink === item.label
                      ? "0.3em solid rgba(160, 32, 240, 1)"
                      : "", // Zvýraznění aktivního odkazu
                  marginRight: activeLink === item.label ? "-0.3em" : "0px",
                  // Zvýraznění aktivního odkazu
                }}
              >
                <Box
                  onClick={() => handleLinkClick(item.label)}
                  sx={{ textDecoration: "none", display: "flex", padding: "0" }}
                >
                  <Image
                    src={item.image} // Použijte obrázek z prop item.image
                    alt={item.label}
                    width={30}
                    height={30}
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
                        transition: "opacity 0.1s ease",
                        cursor: "pointer",
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ marginLeft: showOnlyIcon ? "5em" : "12em" }}>
            {activeLink === "Přehled" && <OverviewComponent />}
            {activeLink === "Tréninky" && <TrainingsComponent />}
            {activeLink === "Kalendář" && <CalendarComponent />}
            {activeLink === "Soupisky" && <RoustersComponent />}
            {activeLink === "Zápasy" && <NominationsComponent />}
            {activeLink === "Platby" && <PayComponent />}
            {activeLink === "Události" && <EventsComponent />}
            {activeLink === "Tým" && <TeamComponent />}
            {activeLink === "Členové" && <MembersComponent id={id as string} />}
            {activeLink === "Správa" && <SettingsComponent />}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Team;
