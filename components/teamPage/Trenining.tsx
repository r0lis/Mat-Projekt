/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import AddTrening from "./Trenings/Add";
import { useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";
import { gql } from "@apollo/client";
import Content from "./Trenings/Content";
import PlanTraining from "./Trenings/PlanTraining";
import PastTraining from "./Trenings/PastTraining";
import AllTrainings from "./Trenings/AllTrainings";

const GET_USER_ROLE_IN_TEAM = gql`
  query GetUserRoleInTeam($teamId: String!, $email: String!) {
    getUserRoleInTeam(teamId: $teamId, email: $email) {
      email
      role
    }
  }
`;

const GET_HALL_BY_TEAM_AND_HALL_ID = gql`
  query getTreningHallsByTeamId($teamId: String!) {
    getTreningHallsByTeamId(teamId: $teamId) {
      treningHallId
      name
      location
    }
  }
`;

type Props = {
  teamId: string;
};

const TreniningComponent: React.FC<Props> = (id) => {
  const user = authUtils.getCurrentUser();
  const [addTrenining, setAddTrenining] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: id.teamId, email: user?.email || "" },
    skip: !user,
  });

  const {
    loading,
    error,
    data: dataHalls,
  } = useQuery(GET_HALL_BY_TEAM_AND_HALL_ID, {
    variables: { teamId: id.teamId },
  });

  if (roleLoading || loading)
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
  if (roleError || error) return <Typography>Chyba</Typography>;

  const role = roleData?.getUserRoleInTeam.role || "";

  const isSmallView = window.innerWidth >= 1200;
  const isMobile = window.innerWidth <= 600;

  const closeAddTraining = () => {
    setAddTrenining(false);
  };
  const handleMenuClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box
      sx={{
        display: isSmallView ? "flex" : "block",
        marginBottom: "2em",
        marginRight: "2%",
      }}
    >
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
            Tréninky
          </Typography>
          {(role === "1" || role === "2") &&
            dataHalls &&
            dataHalls.getTreningHallsByTeamId &&
            dataHalls.getTreningHallsByTeamId.length > 0 && (
              <>
                <Button
                  variant="contained"
                  onClick={() => setAddTrenining(!addTrenining)}
                  sx={{
                    marginLeft: "auto",
                    display: addTrenining ? "none" : "block",
                  }}
                >
                  Přidat
                </Button>
                <MenuIcon
                  sx={{
                    marginLeft: addTrenining ? "auto" : "1em",
                    width: "1.5em",
                    height: "1.5em",
                    marginRight: "5%",
                    color: "#404040",
                  }}
                  onClick={handleMenuClick}
                />
              </>
            )}
        </Box>
        <Box
          sx={{
            borderTop: "2px solid black",
            backgroundColor: "#c2c3c4",
            borderRadius: "0px 0px 15px 15px",
            padding: "0.3em",
            boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.3)",
          }}
        ></Box>
        <Box
          sx={{
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
            width: "100%",
            padding: "26px 0px 26px 0px",
            borderRadius: "15px",
            marginTop: "1em",
            minHeight: "100vh",
            overflowY: "auto",
            maxHeight: "100vh",
          }}
        >
          {addTrenining ? (
            <Box>
              <AddTrening
                teamId={id.teamId}
                closeAddTraining={closeAddTraining}
              />
            </Box>
          ) : (
            <Box>
              <Content teamId={id.teamId} />
            </Box>
          )}
        </Box>
      </Box>
      {isSmallView ? (
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
              Nadcházející tréninky
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: "0px 0px 15px 15px",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              maxHeight: "42.5%",
              height: "48%",
              overflowY: "auto",
              display: isSmallView ? "" : "block",
            }}
          >
            <Box sx={{}}>
              <Box sx={{ overflowY: "auto", paddingTop: "0.5em" }}>
                <PlanTraining teamId={id.teamId} />
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
              marginTop: isSmallView ? "8%" : "0%",
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
              Poslední tréninky
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: "0px 0px 15px 15px",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              height: "48%",
              maxHeight: "42.5%",
              overflowY: "auto",
            }}
          >
            <Box sx={{ overflowY: "auto", paddingTop: "0.5em" }}>
              <PastTraining teamId={id.teamId} />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "1em",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              flex: 1,
              borderRadius: "15px",
              backgroundImage: `
        linear-gradient(to bottom, #c2c3c4 60px, #ffffff 60px)
      `,
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              height: "auto",
              display: isSmallView ? "" : "block",
            }}
          >
            <Box sx={{ maxHeight: "50vh" }}>
              <Typography
                sx={{
                  fontSize: ["1.em", "1.1rem", "1.5rem"],
                  marginLeft: "1rem",
                  marginBottom: "2em",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                }}
              >
                Nadcházející zápasy
              </Typography>
              <Box
                sx={{ maxHeight: "80vh", overflowY: "auto", marginTop: "1em" }}
              >
                <PlanTraining teamId={id.teamId} />
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
            <Box sx={{ maxHeight: "50vh" }}>
              <Typography
                sx={{
                  fontSize: ["1.em", "1.1rem", "1.5rem"],
                  marginLeft: "1rem",
                  fontWeight: "600",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                  marginBottom: "2em",
                }}
              >
                Poslední zápasy
              </Typography>
              <Box
                sx={{ maxHeight: "80vh", overflowY: "auto", marginTop: "1em" }}
              >
                <PastTraining teamId={id.teamId} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Typography variant="h6">Všechny zápasy</Typography>
        </DialogTitle>
        <DialogContent>
          <AllTrainings teamId={id.teamId}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Zavřít
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TreniningComponent;
