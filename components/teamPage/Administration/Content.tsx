/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { gql, useQuery } from "@apollo/client";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Edit from "./Edit";
import Halls from "./Halls";
import Info from "./Info";
import { authUtils } from "@/firebase/auth.utils";
import Contacts from "./Contacts";

const GET_TEAM_DETAILS = gql`
  query GetTeam($teamId: String!) {
    getTeam(teamId: $teamId) {
      AdminEmail
      Email
      Logo
      Name
      OwnerName
      OwnerSurname
      Place
      TimeCreated
      teamId
    }
  }
`;

const GET_TEAM_HALLS = gql`
  query GetTeamHalls($teamId: String!) {
    getHallsByTeamId(teamId: $teamId) {
      name
      location
      hallId
    }
  }
`;

const GET_TEAM_TRENING_HALLS = gql`
  query GetTeamTreningHalls($teamId: String!) {
    getTreningHallsByTeamId(teamId: $teamId) {
      name
      location
      treningHallId
    }
  }
`;

const GET_TEAM_GYMS = gql`
  query GetTeamGyms($teamId: String!) {
    getGymsByTeamId(teamId: $teamId) {
      name
      location
      gymId
    }
  }
`;

const GET_TEAM_IMG = gql`
  query GetTeamImg($teamId: String!) {
    getTeamImg(teamId: $teamId)
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



type Props = {
  id: string;
};

type Hall = {
  name: string;
  location: string;
  hallId: string;
};

type TreningHall = {
  name: string;
  location: string;
  treningHallId: string;
};

type Gym = {
  name: string;
  location: string;
  gymId: string;
};

const Content: React.FC<Props> = (teamId) => {
  const [selectedButton, setSelectedButton] = useState("info");
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const user = authUtils.getCurrentUser();
 

  const renderContent = () => {
    switch (selectedButton) {
      case "info":
        return <Info id={teamId.id} />;
      case "hall":
        return <Halls id={teamId.id} />;
      case "contacts":
        return <Contacts id={teamId.id } />;
      case "edit":
        return <Edit id={teamId.id} />;
      default:
        return null;
    }
  };

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: teamId.id, email: user?.email || "" },
    skip: !user,
  });

  const {
    loading: loadingDetails,
    error: errorDetails,
    data: dataDetails,
  } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: teamId.id },
  });

  const {
    loading,
    error,
    data: dataImg,
  } = useQuery(GET_TEAM_IMG, {
    variables: { teamId: teamId.id },
  });

  const {
    loading: loadingHalls,
    error: errorHalls,
    data: dataHalls,
  } = useQuery(GET_TEAM_HALLS, {
    variables: { teamId: teamId.id },
  });

  const {
    loading: loadingTrainingHalls,
    error: errorTrainingHalls,
    data: dataTreningHalls,
  } = useQuery(GET_TEAM_TRENING_HALLS, {
    variables: { teamId: teamId.id },
  });

  const {
    loading: loadingGyms,
    error: errorGyms,
    data: dataGyms,
  } = useQuery(GET_TEAM_GYMS, {
    variables: { teamId: teamId.id },
  });
  const halls: Hall[] | undefined = dataHalls?.getHallsByTeamId;
  const treningHalls: TreningHall[] | undefined =
    dataTreningHalls?.getTreningHallsByTeamId;
  const gyms: Gym[] | undefined = dataGyms?.getGymsByTeamId;

  useEffect(() => {
    if (!halls || !treningHalls || !gyms || halls.length === 0 || treningHalls.length === 0 || gyms.length === 0) {
      setShowWarning(true);
      setWarningMessage("Některá sportovní centra nejsou přidány. Přidejte prosím.");
    } else {
      setShowWarning(false);
      setWarningMessage("");
    }
  }, [dataHalls, dataTreningHalls, dataGyms]);

  if (loading || loadingDetails || loadingHalls || loadingTrainingHalls || loadingGyms || roleLoading)
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
  if (error || errorDetails || errorGyms || errorHalls || errorTrainingHalls|| roleError) return <Typography>Chyba</Typography>;

  const teamDetails = dataDetails.getTeam;
  const teamImage = dataImg.getTeamImg;
  const isMediumWindow = window.innerWidth < 800;
  const role = roleData?.getUserRoleInTeam?.role || "";
  const isMobile = window.innerWidth < 600;

  return (
    <Box
      sx={{
        width: isMobile? "90%" : "80%",
        boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.3)",
        borderRadius: "10px",
        padding: "3%",
        marginTop: "1em",
        marginLeft: isMobile? "0": "6%",
        marginBottom: "2em",
        marginRight: "5%",
      }}
    >
      <Box>
        <Box sx={{ display: "flex" }}>
          <Box>
            <Typography
              sx={{
                fontFamily: "Roboto",
                fontWeight: "600",
                fontSize: "2rem",
              }}
            >
              {teamDetails.Name}
            </Typography>
          </Box>
          <Box sx={{ marginLeft: "auto", marginRight: "5%" }}>
            <Avatar
              sx={{
                height: "6em",
                width: "6em",
                boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.3)",
              }}
              src={teamImage}
              alt="Team Image"
            />
          </Box>
        </Box>
        {showWarning && (
        <Box sx={{ marginBottom: "1em" }}>
          <Alert severity="warning">{warningMessage}</Alert>
        </Box>
      )}
        {isMediumWindow ? (
          <Box
            sx={{
              display: "block",
              backgroundColor: "#c2c3c4",
              marginTop: "1.5em",
              paddingLeft: "2%",
              paddingRight: "2%",
              borderRadius: "10px",
              marginBottom: "0.5em",
            }}
          >
            <Box sx={{ display: "flex" }}>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "info" ? "white" : "#F0F2F5",
                  border: selectedButton === "info" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "info"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  minWidth: "8em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("info")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Informace
                </Typography>
              </Button>
            </Box>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "hall" ? "white" : "#F0F2F5",
                  border: selectedButton === "hall" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "hall"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  minWidth: "8em",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("hall")}
              >
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sportovní centra
                </Typography>
              </Button>
            </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "contacts" ? "white" : "#F0F2F5",
                  border:
                    selectedButton === "contacts" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "contacts"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                  minWidth: "8em",
                }}
                onClick={() => setSelectedButton("contacts")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Kontakty
                </Typography>
              </Button>
            </Box>
            {role == 1 && (
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "edit" ? "white" : "#F0F2F5",
                  border: selectedButton === "edit" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "edit"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                  minWidth: "8em",
                }}
                onClick={() => setSelectedButton("edit")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Upravit
                </Typography>
              </Button>
            </Box>
            )}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#c2c3c4",
              marginTop: "1.5em",
              paddingLeft: "2%",
              paddingRight: "2%",
              borderRadius: "10px",
              marginBottom: "0.5em",
            }}
          >
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "info" ? "white" : "#F0F2F5",
                  border: selectedButton === "info" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "info"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("info")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Informace
                </Typography>
              </Button>
            </Box>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "hall" ? "white" : "#F0F2F5",
                  border: selectedButton === "hall" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "hall"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginLeft: "5%",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("hall")}
              >
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sportovní centra
                </Typography>
              </Button>
            </Box>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "contacts" ? "white" : "#F0F2F5",
                  border:
                    selectedButton === "contacts" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "contacts"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginLeft: "5%",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("contacts")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Kontakty
                </Typography>
              </Button>
            </Box>
            {role == 1 && (
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "edit" ? "white" : "#F0F2F5",
                  border: selectedButton === "edit" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "edit"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginLeft: "5%",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("edit")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Upravit
                </Typography>
              </Button>
            </Box>
            )}
          </Box>
        )}

        <Box
          sx={{
            borderBottom: "3px solid gray",
            width: "100%",
            position: "relative",
            marginTop: "0.5em",
          }}
        ></Box>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Content;
