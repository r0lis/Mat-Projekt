import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
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

const UPDATE_FORMATION = gql`
  mutation UpdateFormation($subteamId: String!, $cards: CardsInput!) {
    updateFormation(subteamId: $subteamId, cards: $cards)
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
  __typename: string;
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

  const [formationName, setFormationName] = useState("");
  const [cards, setCards] = useState<Cards>({
    lefU: null,
    Cent: null,
    rigU: null,
    lefD: null,
    rigD: null,
  });

  const [updateFormation] = useMutation(UPDATE_FORMATION);

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
    data.getCompleteSubteamDetail.subteamMembers.filter(
      (member: SubteamMember) => member.position === "4"
    );
    

  const filteredMembers = subteamMembers.filter(
    (member) => !Object.values(cards).includes(member)
  );

  const handleFormationNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormationName(event.target.value);
  };

  const handleCardClick = (position: string) => {
    if (selectedPlayer && !Object.values(cards).includes(selectedPlayer)) {
      setCards((prevCards) => ({
        ...prevCards,
        [position]: selectedPlayer,
      }));
      setSelectedPlayer(null);
    }
  };

  const handleRemovePlayer = (position: string) => {
    setCards((prevCards) => ({
      ...prevCards,
      [position]: null,
    }));
  };

  const handleSave = async () => {
    try {
      console.log(cards);
      const cleanedCards = Object.fromEntries(
        Object.entries(cards).map(([key, value]) => {
          if (value) {
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { __typename, ...cleanedValue } = value;
            return [key, cleanedValue];
          } else {
            return [key, null];
          }
        })
      );
  
      await updateFormation({
        variables: {
          subteamId,
          formationName,
          cards: cleanedCards,
        },
      });
  
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Subteam Members */}
      <Box sx={{ width: "50%" }}>
        <Typography
          sx={{ marginBottom: "0.5em", marginTop: "0.5em" }}
          variant="h5"
        >
          Členové týmu
        </Typography>

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
      <Box
        sx={{
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Typography
          sx={{ marginBottom: "0.5em", marginTop: "0.5em" }}
          variant="h5"
        >
          Formace
        </Typography>
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
                sx={{
                  minWidth: 180,
                  minHeight: 150,
                  cursor: "pointer",
                  marginLeft: "1em",
                  marginRight: "1em",
                }}
                onClick={() => handleCardClick(position)}
              >
                <CardContent>
                  <Typography sx={{ marginBottom: "0.5em" }} variant="h6">
                    {position === "lefU"
                      ? "Levý útočník"
                      : position === "Cent"
                      ? "Centr"
                      : position === "rigU"
                      ? "Pravý útočník"
                      : ""}
                  </Typography>
                  {cards[position] ? (
                    <Box
                      sx={{
                        display: "block",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "block" }}>
                        <Typography
                          sx={{
                            marginBottom: "0.4em",
                            fontSize: "1.2em",
                            fontWeight: "500",
                          }}
                        >
                          {`${cards[position]?.name} ${cards[position]?.surname}`}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "block" }}>
                        <Button
                          onClick={() => handleRemovePlayer(position)}
                          variant="contained"
                          color="error"
                          sx={{ width: "100%", height: "30px" }}
                        >
                          Odstranit
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="error">
                      Doplňte
                    </Typography>
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
                sx={{
                  minWidth: 180,
                  minHeight: 150,
                  cursor: "pointer",
                  marginLeft: "1em",
                  marginRight: "1em",
                }}
                onClick={() => handleCardClick(position)}
              >
                <CardContent>
                  <Typography sx={{ marginBottom: "0.5em" }} variant="h6">
                    {position === "lefD"
                      ? "Levý obránce"
                      : position === "rigD"
                      ? "Pravý obránce"
                      : ""}
                  </Typography>
                  {cards[position] ? (
                    <Box
                      sx={{
                        display: "block",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "block" }}>
                        <Typography
                          sx={{
                            marginBottom: "0.4em",
                            fontSize: "1.2em",
                            fontWeight: "500",
                          }}
                        >
                          {`${cards[position]?.name} ${cards[position]?.surname}`}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "block" }}>
                        <Button
                          onClick={() => handleRemovePlayer(position)}
                          variant="contained"
                          color="error"
                          sx={{ width: "100%", height: "30px" }}
                        >
                          Odstranit
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="error">
                      Doplňte
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
          <TextField
            label="Název formace"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formationName}
            onChange={handleFormationNameChange}
          />
          {Object.values(cards).every((card) => card !== null) &&
          formationName.length >= 2 ? (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Uložit
            </Button>
          ) : (
            <Alert severity="error">
              Vyplňte všechny pozice a zadejte název formace (alespoň 2 znaky)
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Formations;