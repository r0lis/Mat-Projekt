import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";
import Attendance from "./Component/Attendance";
import Members from "./Component/Members";
import Overview from "./Component/Overview";
import Wall from "./Component/Wall";
import News from "./Component/News";

const GET_SUBTEAM_DETAILS = gql`
  query GetSubteamDetails($subteamId: String!) {
    getSubteamDetails(subteamId: $subteamId) {
      Name
      subteamId
      teamId
      subteamMembers {
        email
        role
        position
      }
    }
  }
`;

const GET_COMPLETESUBTEAM_DETAILS = gql`
  query GetCompleteSubteamDetail($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      Name
      subteamId
      teamId
      subteamMembers {
        name
        surname
        picture
        email
        role
        position
      }
    }
  }
`;

const getPositionText = (position: string): string => {
  switch (position) {
    case "0":
      return "Není zvolena pozice";
    case "1":
      return "Správce";
    case "2":
      return "Hlavní trenér";
    case "3":
      return "Asistent trenéra";
    case "4":
      return "Hráč";
    default:
      return "";
  }
};

interface ContentProps {
  subteamId: string;
  idTeam: string;
}

interface SubteamMember {
  email: string;
  role: string;
  name: string;
  surname: string;
  picture: string;
  position: string;
}

const Content: React.FC<ContentProps> = ({ subteamId, idTeam }) => {
  const user = authUtils.getCurrentUser();
  const [selectedButton, setSelectedButton] = useState("overview");

  const { loading, error, data } = useQuery(GET_SUBTEAM_DETAILS, {
    variables: { subteamId },
    skip: !user,
  });

  const {
    loading: loadingComplete,
    error: errorComplete,
    data: dataComplete,
  } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: { subteamId },
    skip: !user,
  });

  if (loading || loadingComplete)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  if (error || errorComplete) return <Typography>Chyba</Typography>;

  const subteam = data.getSubteamDetails;
  const subteamComplete = dataComplete.getCompleteSubteamDetail;

  const filteredMembers = subteamComplete.subteamMembers.filter(
    (member: SubteamMember) =>
      member.position == "1" || member.position == "2" || member.position == "3"
  );

  const renderContent = () => {
    switch (selectedButton) {
      case "overview":
        return <Overview subteamId={subteamId as string} />;
      case "wall":
        return <Wall subteamId={subteamId as string} />;
      case "attendance":
        return <Attendance subteamId={subteamId as string} />;
      case "members":
        return <Members subteamId={subteamId as string} idTeam={idTeam} />;
      default:
        return null;
    }
  };

  const isSmallView = window.innerWidth >= 1200;
  const isMobile = window.innerWidth <= 600;

  return (
    <Box sx={{ display: isSmallView ? "flex" : "block", marginBottom: "2em" }}>
      <Box
        sx={{
          marginTop: "1em",
          fontSize: "Roboto",
          width: isSmallView ? "80%" : "100%",
        }}
      >
        <Box
          sx={{
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
            width: "100%",
            padding: "15px 0px 15px 0px",
            borderRadius: "15px 15px 0px 0px",
            display: "flex",
          }}
        >
          <Typography
            sx={{ marginLeft: "5%", fontSize: "1.8em", fontWeight: "600" }}
          >
            {subteam.Name}
          </Typography>
          <AddBoxIcon
            sx={{
              marginLeft: "auto",
              width: "1.5em",
              height: "1.5em",
              color: "#404040",
            }}
          />
          <MenuIcon
            sx={{
              marginLeft: "1em",
              width: "1.5em",
              height: "1.5em",
              marginRight: "5%",
              color: "#404040",
            }}
          />
        </Box>
        <Box
          sx={{
            borderTop: "2px solid black",
            backgroundColor: "#c2c3c4",
            borderRadius: "0px 0px 15px 15px",
            padding: "0.3em",

            boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          {isMobile ? (
            <Box sx={{ marginLeft: "auto", marginRight: "auto" }}>
              <Box>
                <Button
                  style={{
                    backgroundColor:
                      selectedButton === "overview" ? "white" : "#F0F2F5",
                    border:
                      selectedButton === "overview" ? "2px solid black" : "",
                    boxShadow:
                      selectedButton === "overview"
                        ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                        : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                    marginRight: "2em",
                    color: "black",
                    fontFamily: "Roboto",
                    marginLeft: "5%",
                    marginTop: "0.5em",
                    marginBottom: "0.5em",
                  }}
                  onClick={() => setSelectedButton("overview")}
                >
                  Přehled
                </Button>
                <Button
                  style={{
                    backgroundColor:
                      selectedButton === "wall" ? "white" : "#F0F2F5",
                    border: selectedButton === "wall" ? "2px solid black" : "",
                    boxShadow:
                      selectedButton === "wall"
                        ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                        : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                    marginRight: "2em",
                    color: "black",
                    fontFamily: "Roboto",
                    marginTop: "0.5em",
                    marginBottom: "0.5em",
                  }}
                  onClick={() => setSelectedButton("wall")}
                >
                  Nástěnka
                </Button>
              </Box>

              <Box sx={{ marginLeft: "5%" }}>
                <Button
                  style={{
                    backgroundColor:
                      selectedButton === "attendance" ? "white" : "#F0F2F5",
                    border:
                      selectedButton === "attendance" ? "2px solid black" : "",
                    boxShadow:
                      selectedButton === "attendance"
                        ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                        : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                    marginRight: "2em",
                    color: "black",
                    fontFamily: "Roboto",
                    marginTop: "0.5em",
                    marginBottom: "0.5em",
                  }}
                  onClick={() => setSelectedButton("attendance")}
                >
                  Doházka
                </Button>
                <Button
                  style={{
                    backgroundColor:
                      selectedButton === "members" ? "white" : "#F0F2F5",
                    border:
                      selectedButton === "members" ? "2px solid black" : "",
                    boxShadow:
                      selectedButton === "members"
                        ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                        : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                    color: "black",
                    fontFamily: "Roboto",
                    marginTop: "0.5em",
                    marginBottom: "0.5em",
                  }}
                  onClick={() => setSelectedButton("members")}
                >
                  Členové
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "overview" ? "white" : "#F0F2F5",
                  border:
                    selectedButton === "overview" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "overview"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginLeft: "5%",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("overview")}
              >
                Přehled
              </Button>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "wall" ? "white" : "#F0F2F5",
                  border: selectedButton === "wall" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "wall"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("wall")}
              >
                Nástěnka
              </Button>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "attendance" ? "white" : "#F0F2F5",
                  border:
                    selectedButton === "attendance" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "attendance"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("attendance")}
              >
                Doházka
              </Button>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "members" ? "white" : "#F0F2F5",
                  border: selectedButton === "members" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "members"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("members")}
              >
                Členové
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
            width: "100%",
            padding: "0px 0px 26px 0px",
            borderRadius: "15px",
            marginTop: "1em",
            minHeight: "100vh",
          }}
        >
          {renderContent()}
        </Box>
      </Box>
      {isSmallView ? (
        <>
          <Box
            sx={{
              width: isSmallView ? "23%" : "100%",
              marginLeft: "2em",
              marginTop: "1em",
              display: isSmallView ? "block" : "flex",
            }}
          >
            <Box
              sx={{
                backgroundImage: `
            linear-gradient(to bottom, #c2c3c4 60px, #ffffff 60px)
            `,
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
                borderRadius: "15px 15px 0px 0px",
                paddingBottom: "0.5em",
              }}
            >
              <Typography
                sx={{
                  fontSize: ["0.8rem", "1.1rem", "1.5rem"],
                  marginLeft: ["0.6rem", "1rem", "1rem"],
                  fontWeight: "600",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                }}
              >
                Aktuality
              </Typography>
            </Box>
            <Box
              sx={{
                borderRadius: "0px 0px 15px 15px",

                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
                height: "42.5%",
                overflowY: "auto",
                display: isSmallView ? "" : "block",
              }}
            >
              <Box sx={{}}>
                <Box sx={{ marginBottom: "1.2em" }}></Box>
                <Box sx={{ overflowY: "auto" }}>
                  <News subteamId={subteamId} />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                backgroundImage: `
            linear-gradient(to bottom, #c2c3c4 60px, #ffffff 60px)
            `,
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
                borderRadius: "15px 15px 0px 0px",
                paddingBottom: "0.5em",
                marginTop: isSmallView ? "10%" : "0%",

              }}
            >
              <Typography
                sx={{
                  fontSize: ["0.8rem", "1.1rem", "1.5rem"],
                  marginLeft: ["0.6rem", "1rem", "1rem"],
                  fontWeight: "600",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                }}
              >
                Realizační tým
              </Typography>
            </Box>
            <Box
              sx={{
                borderRadius: "0px 0px 15px 15px",
               
                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
                height: "42.5%",
                overflowY: "auto",

              }}
            >
              <Box sx={{ maxHeight: "22em", overflowY: "auto", paddingTop:"0.5em" }}>
                {filteredMembers.map((member: SubteamMember) => (
                  <Box
                    key={member.email}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1em",
                      marginLeft: "1em",
                    }}
                  >
                    <Avatar
                      sx={{ width: 50, height: 50, marginRight: "1em" }}
                      alt={member.name[0] + member.surname[0]}
                      src={member.picture}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: "600" }}>
                        {member.name} {member.surname}
                      </Typography>
                      <Typography sx={{ color: "#454545" }}>
                        {getPositionText(member.position)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex", // Set display to flex
            justifyContent: "space-between", // Add space between the two boxes
            width: "100%",
            marginTop: "1em",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              flex: 1, // Make the first box take up available space
              borderRadius: "15px",
              backgroundImage: `
        linear-gradient(to bottom, #c2c3c4 60px, #ffffff 60px)
      `,
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              height: "auto",
              display: isSmallView ? "" : "block",
            }}
          >
            <Box sx={{}}>
              <Typography
                sx={{
                  fontSize: ["0.8rem", "1.1rem", "1.5rem"],
                  marginLeft: "1rem",
                  fontWeight: "600",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                }}
              >
                Aktuality
              </Typography>
              <Box sx={{ overflowY: "auto", marginTop: "1.2em" }}>
                <News subteamId={subteamId} />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1, // Make the first box take up available space
              borderRadius: "15px",
              backgroundImage: `
        linear-gradient(to bottom, #c2c3c4 60px, #ffffff 60px)
      `,
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              height: "auto",

              display: isSmallView ? "" : "block",
              marginLeft: isMobile ? "0.5em" : "2em",
            }}
          >
            <Box sx={{}}>
              <Typography
                sx={{
                  fontSize: ["0.8rem", "1.1rem", "1.5rem"],
                  marginLeft: "1rem",
                  fontWeight: "600",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                  marginBottom: "2em",
                }}
              >
                Realizační tým
              </Typography>
              <Box sx={{ maxHeight: "22em", overflowY: "auto" }}>
                {filteredMembers.map((member: SubteamMember) => (
                  <Box
                    key={member.email}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1em",
                      marginLeft: "1em",
                    }}
                  >
                    <Avatar
                      sx={{ width: 50, height: 50, marginRight: "1em" }}
                      alt={member.name[0] + member.surname[0]}
                      src={member.picture}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: "600" }}>
                        {member.name} {member.surname}
                      </Typography>
                      <Typography sx={{ color: "#454545" }}>
                        {getPositionText(member.position)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Content;
