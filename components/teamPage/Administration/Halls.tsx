import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Modal,
  List,
  ListItemIcon,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import AddHall from "./AddHall";
import AddTrainingHall from "./AddTreningHall";
import AddGym from "./AddGym";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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

const DELETE_TRENING_HALL = gql`
  mutation DeleteTreningHall($teamId: String!, $treningHallId: String!) {
    deleteTreningHallFromTeam(teamId: $teamId, treningHallId: $treningHallId) {
      teamId
      TreningHalls {
        name
        location
        treningHallId
      }
    }
  }
`;

const DELETE_HALL = gql`
  mutation DeleteHall($teamId: String!, $hallId: String!) {
    deleteHallFromTeam(teamId: $teamId, hallId: $hallId) {
      teamId
      Halls {
        name
        location
        hallId
      }
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

const DELETE_GYM = gql`
  mutation DeleteGym($teamId: String!, $gymId: String!) {
    deleteGymFromTeam(teamId: $teamId, gymId: $gymId) {
      teamId
      Gyms {
        name
        location
        gymId
      }
    }
  }
`;

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

type Props = {
  id: string;
};

const Halls: React.FC<Props> = ({ id }) => {
  const [addHall, setAddHall] = useState(false);
  const [addTreningHall, setAddTreningHall] = useState(false);
  const [addGym, setAddGym] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalOpenTrening, setInfoModalOpenTrening] = useState(false);
  const [infoModalOpenGym, setInfoModalOpenGym] = useState(false);
  const [selectedHall, setSelectedHall] = useState<{
    name: string;
    location: string;
    hallId: string;
  } | null>(null);
  const [selectedTreningHall, setSelectedTreningHall] = useState<{
    name: string;
    location: string;
    treningHallId: string;
  } | null>(null);
  const [selectedGym, setSelectedGym] = useState<{
    name: string;
    location: string;
    gymId: string;
  } | null>(null);

  const {
    loading: loadingDetails,
    error: errorDetails,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: dataDetails,
  } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: id },
  });

  const {
    loading: loadingHalls,
    error: errorHalls,
    data: dataHalls,
  } = useQuery(GET_TEAM_HALLS, {
    variables: { teamId: id },
  });

  const [deleteHallMutation] = useMutation(DELETE_HALL, {
    refetchQueries: [
      { query: GET_TEAM_DETAILS, variables: { teamId: id } },
      { query: GET_TEAM_HALLS, variables: { teamId: id } },
    ],
  });

  const {
    loading: loadingTrainingHalls,
    error: errorTrainingHalls,
    data: dataTreningHalls,
  } = useQuery(GET_TEAM_TRENING_HALLS, {
    variables: { teamId: id },
  });

  const [deleteTreningHallMutation] = useMutation(DELETE_TRENING_HALL, {
    refetchQueries: [
      { query: GET_TEAM_DETAILS, variables: { teamId: id } },
      { query: GET_TEAM_TRENING_HALLS, variables: { teamId: id } },
    ],
  });

  const {
    loading: loadingGyms,
    error: errorGyms,
    data: dataGyms,
  } = useQuery(GET_TEAM_GYMS, {
    variables: { teamId: id },
  });

  const [deleteGymMutation] = useMutation(DELETE_GYM, {
    refetchQueries: [
      { query: GET_TEAM_DETAILS, variables: { teamId: id } },
      { query: GET_TEAM_GYMS, variables: { teamId: id } },
    ],
  });

  if (loadingDetails || loadingHalls || loadingTrainingHalls || loadingGyms)
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
  if (errorDetails || errorHalls || errorTrainingHalls || errorGyms)
    return <Typography>Chyba</Typography>;

  const handleAddHall = () => {
    setAddHall(true);
  };

  const handleCloseAddHall = () => {
    setAddHall(false);
  };

  const handleOpenInfoModal = (hall: Hall) => {
    setSelectedHall(hall);
    setInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setSelectedHall(null);
    setInfoModalOpen(false);
  };

  const handleDeleteHall = async () => {
    if (selectedHall) {
      const { hallId } = selectedHall;
      try {
        await deleteHallMutation({ variables: { teamId: id, hallId } });
        handleCloseInfoModal();
      } catch (error) {
        console.error("Error deleting hall:", error);
      }
    }
  };

  const handleAddTreningHall = () => {
    setAddTreningHall(true);
  };

  const handleCloseAddTreningHall = () => {
    setAddTreningHall(false);
  };

  const handleOpenInfoModalTrening = (treningHall: TreningHall) => {
    setSelectedTreningHall(treningHall);
    setInfoModalOpenTrening(true);
  };

  const handleCloseInfoModalTrening = () => {
    setSelectedTreningHall(null);
    setInfoModalOpenTrening(false);
  };

  const handleDeleteTreningHall = async () => {
    if (selectedTreningHall) {
      const { treningHallId } = selectedTreningHall;
      try {
        await deleteTreningHallMutation({
          variables: { teamId: id, treningHallId },
        });
        handleCloseInfoModalTrening();
      } catch (error) {
        console.error("Error deleting hall:", error);
      }
    }
  };

  const handleAddGym = () => {
    setAddGym(true);
  };

  const handleCloseAddGym = () => {
    setAddGym(false);
  };

  const handleOpenInfoModalGym = (gym: Gym) => {
    setSelectedGym(gym);
    setInfoModalOpenGym(true);
  };

  const handleCloseInfoModalGym = () => {
    setSelectedGym(null);
    setInfoModalOpenGym(false);
  };

  const handleDeleteGym = async () => {
    if (selectedGym) {
      const { gymId } = selectedGym;
      try {
        await deleteGymMutation({ variables: { teamId: id, gymId } });
        handleCloseInfoModalGym();
      } catch (error) {
        console.error("Error deleting hall:", error);
      }
    }
  };

  const halls: Hall[] | undefined = dataHalls?.getHallsByTeamId;
  const treningHalls: TreningHall[] | undefined =
    dataTreningHalls?.getTreningHallsByTeamId;
  const gyms: Gym[] | undefined = dataGyms?.getGymsByTeamId;

  const isSmallWindow = window.innerWidth < 1200;

  return (
    <Box sx={{ display: isSmallWindow ? "block" : "flex", marginTop: "0.5em" }}>
      <Box
        sx={{
          marginLeft: isSmallWindow ? "0" : "",
          marginRight: isSmallWindow ? "" : "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            marginTop: "0.5em",
            marginRight: "4%",
            marginLeft: "2%",
            width: "18em",
          }}
        >
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box>
              <Typography
                sx={{ fontWeight: "500", whiteSpace: "nowrap" }}
                variant="h5"
              >
                Zápasové haly
              </Typography>
            </Box>
            <Box sx={{ marginLeft: isSmallWindow ? "20%" : "10%", display: addHall ? "none":"" }}>
              <Button
                sx={{ backgroundColor: "#027ef2" }}
                variant="contained"
                color="primary"
                onClick={handleAddHall}
              >
                Přidat
              </Button>
            </Box>
          </Box>
        </Box>
        {addHall ? (
          <AddHall id={id} onClose={handleCloseAddHall} />
        ) : (
          <Box sx={{ marginLeft: "2%", marginTop: "0.5em" }}>
            {halls && halls.length > 0 ? (
              <List>
                {halls.map((hall: Hall, index: number) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleOpenInfoModal(hall)}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          sx={{ fontSize: "1.2em", whiteSpace: "nowrap" }}
                        >
                          {`Název: ${hall.name} `}
                        </Typography>
                      }
                    />
                    <ListItemIcon>
                      <InfoOutlinedIcon sx={{ cursor: "pointer" }} />
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>Žádné zápasové haly</Typography>
            )}
          </Box>
        )}

        <Modal
          open={infoModalOpen}
          onClose={handleCloseInfoModal}
          aria-labelledby="info-modal-title"
          aria-describedby="info-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: "10px",
              backgroundImage: `
            linear-gradient(to bottom, #c2c3c4 80px, #ffffff 80px)
          `,
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Box>
              <Typography id="info-modal-title" variant="h6" component="h2">
                Název: {selectedHall?.name}
              </Typography>
            </Box>
            <Box sx={{ paddingTop: "1em" }}>
              <Typography id="info-modal-description" sx={{ mt: 2 }}>
                Umístění: {selectedHall?.location}
              </Typography>
              <Box>
                <Button onClick={handleDeleteHall}>Smazat</Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
      <Box
        sx={{
          marginLeft: isSmallWindow ? "0" : "auto",
          marginRight: isSmallWindow ? "" : "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            marginTop: "0.5em",
            marginRight: "auto",
            marginLeft: isSmallWindow ? "2%" : "auto",
            width: "18em",
          }}
        >
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box>
              <Typography sx={{ fontWeight: "500" }} variant="h5">
                Posilovny
              </Typography>
            </Box>
            <Box sx={{ marginLeft: isSmallWindow ? "20%" : "30%", display: addGym ? "none":"" }}>
              <Button
                sx={{ backgroundColor: "#027ef2" }}
                variant="contained"
                color="primary"
                onClick={handleAddGym}
              >
                Přidat
              </Button>
            </Box>
          </Box>
        </Box>
        {addGym ? (
          <AddGym id={id} onClose={handleCloseAddGym} />
        ) : (
          <Box
            sx={{ marginLeft: isSmallWindow ? "3%" : "", marginTop: "0.5em" }}
          >
            {gyms && gyms.length > 0 ? (
              <List>
                {gyms.map((gym: Gym, index: number) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleOpenInfoModalGym(gym)}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          sx={{ fontSize: "1.2em", whiteSpace: "nowrap" }}
                        >
                          {`Název: ${gym.name} `}
                        </Typography>
                      }
                    />
                    <ListItemIcon>
                      <InfoOutlinedIcon sx={{ cursor: "pointer" }} />
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>Žádné posilovny</Typography>
            )}
          </Box>
        )}

        <Modal
          open={infoModalOpenGym}
          onClose={handleCloseInfoModalGym}
          aria-labelledby="info-modal-title"
          aria-describedby="info-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: "10px",
              backgroundImage: `
            linear-gradient(to bottom, #c2c3c4 80px, #ffffff 80px)
          `,
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Box>
              <Typography id="info-modal-title" variant="h6" component="h2">
                Název: {selectedGym?.name}
              </Typography>
            </Box>
            <Box sx={{ paddingTop: "1em" }}>
              <Typography id="info-modal-description" sx={{ mt: 2 }}>
                Umístění: {selectedGym?.location}
              </Typography>
              <Box>
                <Button onClick={handleDeleteGym}>Smazat</Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
      <Box
        sx={{
          marginLeft: isSmallWindow ? "0" : "auto",
          marginRight: isSmallWindow ? "" : "",
        }}
      >
        <Box
          sx={{
            display: "flex",
            marginTop: "0.5em",
            marginRight: "2%",
            marginLeft: isSmallWindow ? "2%" : "auto",
            width: "18em",
          }}
        >
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box>
              <Typography
                sx={{ fontWeight: "500", whiteSpace: "nowrap" }}
                variant="h5"
              >
                Treninkové haly
              </Typography>
            </Box>
            <Box sx={{ marginLeft: isSmallWindow ? "auto" : "10%",  display: addTreningHall ? "none":"" }}>
              <Button
                sx={{ backgroundColor: "#027ef2" }}
                variant="contained"
                color="primary"
                onClick={handleAddTreningHall}
              >
                Přidat
              </Button>
            </Box>
          </Box>
        </Box>
        {addTreningHall ? (
          <AddTrainingHall id={id} onClose={handleCloseAddTreningHall} />
        ) : (
          <Box
            sx={{
              marginLeft: isSmallWindow ? "3%" : "",
              marginTop: "0.5em",
              boxShadow: "",
            }}
          >
            {treningHalls && treningHalls.length > 0 ? (
              <List>
                {treningHalls.map((treningHall: TreningHall, index: number) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleOpenInfoModalTrening(treningHall)}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          sx={{ fontSize: "1.2em", whiteSpace: "nowrap" }}
                        >
                          {`Název: ${treningHall.name} `}
                        </Typography>
                      }
                    />
                    <ListItemIcon>
                      <InfoOutlinedIcon sx={{ cursor: "pointer" }} />
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>Žádné treninkové haly</Typography>
            )}
          </Box>
        )}

        <Modal
          open={infoModalOpenTrening}
          onClose={handleCloseInfoModalTrening}
          aria-labelledby="info-modal-title"
          aria-describedby="info-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: "10px",
              backgroundImage: `
            linear-gradient(to bottom, #c2c3c4 80px, #ffffff 80px)
          `,
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Box>
              <Typography id="info-modal-title" variant="h6" component="h2">
                Název: {selectedTreningHall?.name}
              </Typography>
            </Box>
            <Box sx={{ paddingTop: "1em" }}>
              <Typography id="info-modal-description" sx={{ mt: 2 }}>
                Umístění: {selectedTreningHall?.location}
              </Typography>
              <Box>
                <Button onClick={handleDeleteTreningHall}>Smazat</Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Halls;
