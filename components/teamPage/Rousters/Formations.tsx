import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

const GET_COMPLETESUBTEAM_DETAILS = gql`
  query GetCompleteSubteamDetail($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      subteamMembers {
        email
        name
        surname
        playPosition
        position
      }
    }
  }
`;

const getPlayPositionText = (position: string): string => {
  switch (position) {
    case null:
      return "Není zvolena pozice";
    case "1":
      return "Centr";
    case "2":
      return "Levý křídlo";
    case "3":
      return "Pravý křídlo";
    case "4":
      return "Levý obránce";
    case "5":
      return "Pravý obránce";
    case "6":
      return "Brankář";
    default:
      return "";
  }
};

type SubteamMember = {
  email: string;
  name: string;
  surname: string;
  playPosition: string;
  position: string;
};

type Cards = {
  [key: string]: SubteamMember | null;
};

const Formations: React.FC<{ subteamId: string }> = ({ subteamId }) => {
  const { loading, error, data } = useQuery(GET_COMPLETESUBTEAM_DETAILS, {
    variables: { subteamId },
  });

  const [selectedPlayer, setSelectedPlayer] = useState<SubteamMember | null>(
    null
  );
  const [cards, setCards] = useState<Cards>({
    lefU: null,
    Cent: null,
    rigU: null,
    lefD: null,
    rigD: null,
  });

  if (loading)
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

  if (error) return <Typography>Error</Typography>;

  const subteamMembers: SubteamMember[] =
    data.getCompleteSubteamDetail.subteamMembers;

  const filteredMembers = subteamMembers.filter(
    (member) => member.position === "4"
  );

  const handleCardClick = (position: string) => {
    if (selectedPlayer && !cards[position]) {
      setCards((prevCards) => ({
        ...prevCards,
        [position]: selectedPlayer,
      }));
      setSelectedPlayer(null);
      // Remove selected player from filteredMembers
      const updatedMembers = filteredMembers.filter(
        (member) => member.email !== selectedPlayer.email
      );
      filteredMembers.splice(0, filteredMembers.length, ...updatedMembers);
    }
  };

  const handleRemovePlayer = (position: string) => {
    const removedPlayer = cards[position];
    setCards((prevCards) => ({
      ...prevCards,
      [position]: null,
    }));
    if (removedPlayer) {
      // Add removed player back to filteredMembers
      filteredMembers.push(removedPlayer);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Subteam Members */}
      <Box sx={{ width: "50%" }}>
        <Typography variant="h5">Členové týmu</Typography>

        <Box
          sx={{
            maxHeight: "450px",
            overflowY: "auto",
            border: "1px solid lightgray",
            borderRadius: "4px",
            padding: "8px",
          }}
        >
          {filteredMembers.map((member: SubteamMember) => (
            <Box
              key={member.email}
              onClick={() => setSelectedPlayer(member)}
              sx={{
                userSelect: "none",
                padding: "8px",
                margin: "8px 0",
                backgroundColor:
                  selectedPlayer === member ? "#e0e0e0" : "white",
                border: "1px solid lightgray",
                borderRadius: "4px",
              }}
            >
              <Typography>{`${member.name} ${
                member.surname
              } ${getPlayPositionText(member.playPosition)}`}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Cards */}
      <Box>
        <Typography variant="h5">Karty</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            {["lefU", "Cent", "rigU"].map((position) => (
              <Card
                key={position}
                sx={{ minWidth: 180, minHeight: 130, cursor: "pointer" }}
                onClick={() => handleCardClick(position)}
              >
                <CardContent>
                  <Typography variant="h6">
                    {position === "lefU"
                      ? "Levý útočník"
                      : position === "Cent"
                      ? "Centr"
                      : position === "rigU"
                      ? "Pravý útočník"
                      : ""}
                  </Typography>
                  {/* Zde budou zobrazeni členové týmu */}
                  {cards[position] && (
                    <Box
                      sx={{
                        display: "block",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                       <Box sx={{display:"block"}}>
                      <Typography>
                        {`${cards[position]?.name} ${cards[position]?.surname}`}
                      </Typography>
                      </Box>
                      <Box sx={{display:"block"}}>
                      <Typography
                        onClick={() => handleRemovePlayer(position)}
                        sx={{ cursor: "pointer" }}
                      >
                        Odstranit
                      </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {["lefD", "rigD"].map((position) => (
              <Card
                key={position}
                sx={{ minWidth: 180, minHeight: 130, cursor: "pointer" }}
                onClick={() => handleCardClick(position)}
              >
                <CardContent>
                  <Typography variant="h6">
                    {position === "lefD"
                      ? "Levý obránce"
                      : position === "rigD"
                      ? "Pravý obránce"
                      : ""}
                  </Typography>
                  {cards[position] && (
                    <Box
                      sx={{
                        display: "block",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                       <Box sx={{display:"block"}}>
                      <Typography>
                        {`${cards[position]?.name} ${cards[position]?.surname}`}
                      </Typography>
                      </Box>
                      <Box sx={{display:"block"}}>
                      <Typography
                        onClick={() => handleRemovePlayer(position)}
                        sx={{ cursor: "pointer" }}
                      >
                        Odstranit
                      </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Formations;
