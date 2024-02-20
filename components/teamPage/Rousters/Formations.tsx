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
      Formations {
        cards {
          Cent {
            email
            name
            surname
            playPosition
            position
          }
          lefD {
            email
            name
            surname
            playPosition
            position
          }
          lefU {
            email
            name
            surname
            playPosition
            position
          }
          rigD {
            email
            name
            surname
            playPosition
            position
          }
          rigU {
            email
            name
            surname
            playPosition
            position
          }
        }
        formationName
        formationId
      }
    }
  }
`;

const UPDATE_FORMATION = gql`
  mutation UpdateFormation(
    $subteamId: String!
    $formationName: String!
    $cards: CardsInput!
  ) {
    updateFormation(
      subteamId: $subteamId
      formationName: $formationName
      cards: $cards
    )
  }
`;

const DELETE_FORMATION = gql`
  mutation DeleteFormation($subteamId: String!, $formationId: String!) {
    deleteFormation(subteamId: $subteamId, formationId: $formationId)
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

type Formation = {
  cards: {
    lefU: SubteamMember | null;
    Cent: SubteamMember | null;
    rigU: SubteamMember | null;
    lefD: SubteamMember | null;
    rigD: SubteamMember | null;
  };
  formationName: string;
  formationId: string;
};

type Cards = {
  [key: string]: SubteamMember | null;
};

const Formations: React.FC<{ subteamId: string }> = ({ subteamId }) => {
  const { loading, error, data, refetch } = useQuery(
    GET_COMPLETESUBTEAM_DETAILS,
    {
      variables: { subteamId },
    }
  );

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
  const [deleteFormation] = useMutation(DELETE_FORMATION);

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

  if (error) return <Typography>chyba</Typography>;
  console.log(error);

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
      refetch();
      setCards({
        lefU: null,
        Cent: null,
        rigU: null,
        lefD: null,
        rigD: null,
      });

      setFormationName("");

      // Show success alert
      alert("Formace byla úspěšně uložena.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFormation = async (formationId: string) => {
    try {
      await deleteFormation({
        variables: {
          subteamId,
          formationId,
        },
      });
      refetch();
      // Show success alert or perform any other actions after deletion
      alert("Formace byla úspěšně odstraněna.");
    } catch (error) {
      console.error(error);
      // Handle error if necessary
    }
  };

  return (
    <Box>
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "85%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: "1em", marginTop: "1em" }}>
          Vytvořené formace:
        </Typography>
        {data.getCompleteSubteamDetail.Formations.map(
          (formation: Formation) => (
            <Card key={formation.formationId} sx={{ marginBottom: "1em" }}>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: "0.5em" }}>
                  {formation.formationName}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "60%",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {/* Box pro "Levý útočník", "Centr" a "Pravý útočník" */}
                    {Object.entries(formation.cards)
                      .filter(([position]) =>
                        ["lefU", "Cent", "rigU"].includes(position)
                      )
                      .map(([position, player]) => (
                        <Card
                          key={position}
                          sx={{
                            minWidth: 200,
                            minHeight: 150,
                            cursor: "pointer",
                            marginLeft: "1em",
                            marginRight: "1em",
                          }}
                        >
                          <CardContent>
                            <Typography
                              sx={{ marginBottom: "0.5em" }}
                              variant="h6"
                            >
                              {position === "lefU"
                                ? "Levý útočník"
                                : position === "Cent"
                                ? "Centr"
                                : position === "rigU"
                                ? "Pravý útočník"
                                : ""}
                            </Typography>

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
                                  {player
                                    ? `${player.name} ${player.surname}`
                                    : "Není obsazen"}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                  </Box>
                  {/* Box pro "Levý obránce" a "Pravý obránce" */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        marginTop: "1em",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      {Object.entries(formation.cards)
                        .filter(([position]) =>
                          ["lefD", "rigD"].includes(position)
                        )
                        .map(([position, player]) => (
                          <Card
                            key={position}
                            sx={{
                              minWidth: 200,
                              minHeight: 150,
                              cursor: "pointer",
                              marginLeft: "1em",
                              marginRight: "1em",
                            }}
                          >
                            <CardContent>
                              <Typography
                                sx={{ marginBottom: "0.5em" }}
                                variant="h6"
                              >
                                {position === "lefD"
                                  ? "Levý obránce"
                                  : position === "rigD"
                                  ? "Pravý obránce"
                                  : ""}
                              </Typography>

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
                                    {player
                                      ? `${player.name} ${player.surname}`
                                      : "Není obsazen"}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "block",
                    justifyContent: "space-between",
                    marginTop: "1em",
                    marginLeft: "auto",
                  }}
                >
                  <Button
                    onClick={() => handleDeleteFormation(formation.formationId)}
                    variant="contained"
                    color="error"
                  >
                    Odstranit
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )
        )}
      </Box>
    </Box>
  );
};

export default Formations;
