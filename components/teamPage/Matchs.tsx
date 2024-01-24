/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import AddMatch from "./Match/Add";
import { authUtils } from "@/firebase/auth.utils";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import Content from "./Match/Content";
import PlanMatch from "./Match/PlanMatch";
import PastMatch from "./Match/PastMatch";

const GET_USER_ROLE_IN_TEAM = gql`
  query GetUserRoleInTeam($teamId: String!, $email: String!) {
    getUserRoleInTeam(teamId: $teamId, email: $email) {
      email
      role
    }
  }
`;

const GET_HALL_BY_TEAM_AND_HALL_ID = gql`
  query GetHallsByTeamId($teamId: String!) {
    getHallsByTeamId(teamId: $teamId) {
      hallId
      name
      location
    }
  }
`;

type Props = {
  teamId: string;
};

const Matchs: React.FC<Props> = (id) => {
  const user = authUtils.getCurrentUser();
  const [addMatch, setAddMatch] = useState(false);

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

  const closeAddMatch = () => {
    setAddMatch(false);
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
            Zápasy
          </Typography>
          {(role === "1" || role === "2") &&
            dataHalls &&
            dataHalls.getHallsByTeamId &&
            dataHalls.getHallsByTeamId.length > 0 && (
              <>
                <Button
                  variant="contained"
                  onClick={() => setAddMatch(!addMatch)}
                  sx={{
                    marginLeft: "auto",
                    display: addMatch ? "none" : "block",
                  }}
                >
                  Přidat
                </Button>
                <MenuIcon
                  sx={{
                    marginLeft: addMatch ? "auto" : "1em",
                    width: "1.5em",
                    height: "1.5em",
                    marginRight: "5%",
                    color: "#404040",
                  }}
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
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          {addMatch ? (
            <Box>
              <AddMatch teamId={id.teamId} closeAddMatch={closeAddMatch} />
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
              Nadcházející zápasy
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: "0px 0px 15px 15px",
              maxHeight: "42.5%",
              overflowY: "auto",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              height: "49%",
              display: isSmallView ? "" : "block",
            }}
          >
            <Box sx={{}}>
              <Box
                sx={{
                  maxHeight: "21.5em",
                  overflowY: "auto",
                  marginTop: "0.5em",
                }}
              >
                <PlanMatch teamId={id.teamId} />
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
              Poslední zápasy
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: "0px 0px 15px 15px",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              maxHeight: "42.5%",
              height: "49%",
              overflowY: "auto",
            }}
          >
           
            <Box
              sx={{  overflowY: "auto", marginTop:"0.5em" }}
            >
              <PastMatch teamId={id.teamId} />
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
            maxHeight: "100vh",
            overflowY: "auto",
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
                  fontSize: ["0.8rem", "1.1rem", "1.5rem"],
                  marginLeft: "1rem",
                  fontWeight: "600",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                }}
              >
                Nadcházející zápasy
              </Typography>
              <Box
                sx={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                  marginTop: "1.5em",
                }}
              >
                <PlanMatch teamId={id.teamId} />
              </Box>
            </Box>
          </Box>

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
              marginLeft: isMobile ? "0.5em" : "2em",
            }}
          >
            <Box sx={{ maxHeight: "50vh" }}>
              <Typography
                sx={{
                  fontSize: ["0.8rem", "1.1rem", "1.5rem"],
                  marginLeft: "1rem",
                  fontWeight: "600",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                }}
              >
                Poslední zápasy
              </Typography>
              <Box
                sx={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                  marginTop: "1.5em",
                }}
              >
                <PastMatch teamId={id.teamId} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Matchs;
