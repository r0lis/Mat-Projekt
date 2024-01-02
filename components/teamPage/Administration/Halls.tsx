import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Modal,
} from "@mui/material";
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import AddHall from "./AddHall";
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

type Hall = {
  name: string;
  location: string;
  hallId: string;
};

type Props = {
  id: string;
};

const Halls: React.FC<Props> = ({ id }) => {
  const [addHall, setAddHall] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState<{
    name: string;
    location: string;
    hallId: string;
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

  if (loadingDetails || loadingHalls)
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
  if (errorDetails || errorHalls) return <Typography>Chyba</Typography>;

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

  const halls = dataHalls?.getHallsByTeamId;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          marginTop: "0.5em",
          marginRight: "2%",
          marginLeft: "2%",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: "500" }} variant="h5">
            Haly
          </Typography>
        </Box>
        <Box sx={{ marginLeft: "auto", backgroundColor: "#027ef2" }}>
          <Button variant="contained" color="primary" onClick={handleAddHall}>
            Přidat
          </Button>
        </Box>
      </Box>
      {addHall ? (
        <AddHall id={id} onClose={handleCloseAddHall} />
      ) : (
        <Box sx={{ marginLeft: "2%" }}>
          {halls !== null ? (
            <Box>
              {halls.map((hall: Hall, index: number) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{ fontSize: "1.2em" }}
                  >{`Název: ${hall.name} `}</Typography>
                  <InfoOutlinedIcon
                    sx={{ marginLeft: "8px", cursor: "pointer" }}
                    onClick={() => handleOpenInfoModal(hall)}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>Žádné haly</Typography>
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
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="info-modal-title" variant="h6" component="h2">
            Název: {selectedHall?.name}
          </Typography>
          <Typography id="info-modal-description" sx={{ mt: 2 }}>
            Umístění: {selectedHall?.location}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {selectedHall?.hallId}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default Halls;
