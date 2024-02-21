/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Typography, Modal, Button, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

const GET_SUBTEAMS = gql`
  query GetYourSubteamData($teamId: String!, $email: String!) {
    getYourSubteamData(teamId: $teamId, email: $email) {
      Name
      subteamId
      teamId
    }
  }
`;

const GET_HALL_BY_TEAM_AND_HALL_ID1 = gql`
  query GetHallByTeamAndHallId($teamId: String!, $hallId: String!) {
    getHallByTeamAndHallId(teamId: $teamId, hallId: $hallId) {
      hallId
      name
      location
    }
  }
`;

const GET_MATCHES_BY_SUBTEAM = gql`
  query GetMatchesBySubteam($input: MatchesBySubteamInput!) {
    getAllMatchesBySubteam(input: $input) {
      subteamId
      matches {
        matchId
        opponentName
        selectedHallId
        subteamIdSelected
        selectedHallPosition
        date
        endTime
        time
        selectedMembers
        selectedPlayers
        selectedManagement
        matchType
        attendance {
          player
          hisAttendance
          reason
        }
      }
    }
  }
`;

const GET_TRAININGS_BY_SUBTEAM = gql`
  query GetTrainingsBySubteam($input: MatchesBySubteamInput!) {
    getAllTrainingsBySubteam(input: $input) {
      subteamId
      trainings {
        matchId
        teamId
        opponentName
        selectedHallId
        subteamIdSelected
        endTime
        description
        date
        time
        selectedMembers
        selectedPlayers
        selectedManagement
        attendance {
          player
          hisAttendance
          reason
        }
      }
    }
  }
`;

const GET_HALL_BY_TEAM_AND_HALL_ID2 = gql`
  query GetTrainingHallByTeamAndHallId(
    $teamId: String!
    $treningHallId: String!
  ) {
    getTrainingHallByTeamAndHallId(
      teamId: $teamId
      treningHallId: $treningHallId
    ) {
      treningHallId
      name
      location
    }
  }
`;

const GET_SUBTEAM_DETAILS = gql`
  query GetSubteamDetails($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      Name
    }
  }
`;

type Props = {
  teamId: string;
};

const CalendarComponent: React.FC<Props> = ({ teamId }) => {
  const user = authUtils.getCurrentUser();
  const [subteamIds, setSubteamIds] = useState<string[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventDetails, setEventDetails] = useState<any>(null);

  const {
    loading: subteamLoading,
    error: subteamError,
    data: subteamData,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId, email: user?.email || "" },
    skip: !user,
  });

  useEffect(() => {
    if (subteamData && subteamData.getYourSubteamData) {
      const ids = subteamData.getYourSubteamData.map(
        (subteam: { subteamId: string }) => subteam.subteamId
      );
      setSubteamIds(ids);
    }
  }, [subteamData]);

  const {
    loading: matchesLoading,
    error: matchesError,
    data: matchesData,
  } = useQuery(GET_MATCHES_BY_SUBTEAM, {
    variables: { input: { subteamIds: subteamIds || [] } },
    skip: subteamIds.length === 0,
  });

  const {
    loading: trainingsLoading,
    error: trainingsError,
    data: trainingsData,
  } = useQuery(GET_TRAININGS_BY_SUBTEAM, {
    variables: { input: { subteamIds: subteamIds || [] } },
    skip: subteamIds.length === 0,
  });

  useEffect(() => {
    if (matchesData && matchesData.getAllMatchesBySubteam) {
      const matchEvents = matchesData.getAllMatchesBySubteam.flatMap(
        (subteam: any) =>
          subteam.matches.map((match: any) => ({
            id: match.matchId,
            title: match.opponentName,
            start: `${match.date}T${match.time}`,
            end: `${match.date}T${match.endTime}`,
            type: "Zápas", // Přidání typu události
            hall: match.selectedHallId,
            subteamId: match.subteamIdSelected,
            matchType: match.matchType,
          }))
      );
      setCalendarEvents((prevEvents: any[]) => [...prevEvents, ...matchEvents]);
    }
  }, [matchesData]);

  useEffect(() => {
    if (trainingsData && trainingsData.getAllTrainingsBySubteam) {
      const trainingEvents = trainingsData.getAllTrainingsBySubteam.flatMap(
        (subteam: any) =>
          subteam.trainings.map((training: any) => ({
            id: training.matchId,
            title: training.description,
            start: `${training.date}T${training.time}`,
            end: `${training.date}T${training.endTime}`,
            type: "Trénink", // Přidání typu události
            hall: training.selectedHallId,
            subteamId: training.subteamIdSelected,
            description: training.description,
          }))
      );
      setCalendarEvents((prevEvents: any[]) => [
        ...prevEvents,
        ...trainingEvents,
      ]);
    }
  }, [trainingsData]);

  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const eventData = calendarEvents.find((event) => event.id === eventId);
    setEventDetails(eventData);
    setSelectedEvent(clickInfo.event.extendedProps);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setEventDetails(null);
  };

  if (subteamLoading || matchesLoading || trainingsLoading)
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
  if (subteamError || matchesError || trainingsError)
    return <Typography>Chyba</Typography>;

  return (
    <Box sx={{ marginBottom: "5em" }}>
      <Box sx={{ marginLeft: "1em" }}>
        <Typography variant="h4">Kalendář</Typography>
      </Box>
      <Box
        sx={{
          maxWidth: "1000px",
          height: "700px",
          marginTop: "2em",
          marginLeft: "auto",
          marginRight: "auto",
          paddingBottom: "5em",
          display: "block",
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          editable={true}
          selectable={true}
          selectMirror={true}
          eventContent={renderEventContent} // Přidání vlastní funkce pro formátování událostí
          eventClick={handleEventClick} // Handler pro kliknutí na událost
        />
      </Box>
      <Box sx={{ marginLeft: "1em" }}></Box>
      <Modal open={!!selectedEvent} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            width: 550,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#027ef2",
              paddingLeft: "10%",
              borderRadius: "10px 10px 0px 0px",
              paddingRight: "5%",
              paddingTop: "1%",
              paddingBottom: "1%",
            }}
          >
            <Typography sx={{ color: "white", fontWeight: "400" }}>
              Detail události
            </Typography>
            <Typography
              sx={{ color: "white", fontWeight: "500", textAlign: "" }}
              variant="h5"
              component="h2"
            >
              {selectedEvent?.type}
            </Typography>
          </Box>
          <Box
            sx={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "1em" }}
          >
            <Box
              sx={{
                display: selectedEvent?.type === "Zápas" ? "flex" : "block",
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                {selectedEvent?.title}
              </Typography>
              <Typography
                sx={{ display: "flex", fontWeight: "500" }}
                variant="body1"
                gutterBottom
              >
                {selectedEvent?.type === "Zápas" ? "" : "Popis "}

                {selectedEvent?.type === "Trénink"
                  ? selectedEvent?.description
                  : eventDetails?.title}
              </Typography>
            </Box>
            <SubteamDetails subteamId={selectedEvent?.subteamId} />

            <Typography variant="body1" gutterBottom>
              <span style={{ fontWeight: 500 }}>Typ zápasu:</span>{" "}
              {selectedEvent?.type === "Zápas"
                ? selectedEvent?.matchType === "home"
                  ? "Domácí"
                  : "Hosté"
                : ""}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <span style={{ fontWeight: 500 }}>Začátek:</span>{" "}
              {eventDetails ? formatDate(new Date(eventDetails.start)) : ""}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <span style={{ fontWeight: 500 }}>Konec:</span>{" "}
              {eventDetails ? formatDate(new Date(eventDetails.end)) : ""}
            </Typography>

            {selectedEvent?.type === "Zápas" ? (
              <HallInfo teamId={teamId} hallId={selectedEvent?.hall} />
            ) : (
              <HallInfo2 teamId={teamId} treningHallId={selectedEvent?.hall} />
            )}
          </Box>
          <Box sx={{ paddingLeft: "1%" }}>
            <Button
              sx={{
                paddingLeft: "10%",
                paddingRight: "10%",
                paddingBottom: "1.5em",
              }}
              onClick={handleCloseModal}
            >
              Zavřít
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const renderEventContent = (eventInfo: any) => {
  const eventBackgroundColor =
    eventInfo.event.extendedProps.type === "Zápas"
      ? "rgba(0, 56, 255, 0.24)"
      : "rgba(255, 130, 0, 0.15)";
  const eventBorderColor =
    eventInfo.event.extendedProps.type === "Zápas"
      ? "rgba(0, 34, 155, 1)"
      : "rgba(255, 130, 0, 0.6)";
  return (
    <Box
      sx={{
        backgroundColor: eventBackgroundColor,
        border: `2px solid ${eventBorderColor}`,
        borderRadius: "5px",
        padding: "5px",
        width: "100%",
      }}
    >
      <b>{eventInfo.event.extendedProps.type}</b>{" "}
      {eventInfo.event.extendedProps.type !== "Trénink" && (
        <b>{eventInfo.event.title}</b>
      )}
      <p style={{ marginTop: "2px", marginBottom: "2px" }}>
        Čas:{" "}
        {eventInfo.event.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>{" "}
      {/* Zobrazení času */}
    </Box>
  );
};

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("cs-CZ", options);
};

interface HallInfoProps {
  teamId: string;
  hallId: string;
}

const HallInfo: React.FC<HallInfoProps> = ({ teamId, hallId }) => {
  const { loading, error, data } = useQuery(GET_HALL_BY_TEAM_AND_HALL_ID1, {
    variables: { teamId, hallId },
  });

  if (loading) return <CircularProgress color="primary" size={20} />;
  if (error) return <Typography>Error loading hall information</Typography>;

  const hall = data.getHallByTeamAndHallId;
  return (
    <Box sx={{ paddingBottom: "0.5em" }}>
      <Typography sx={{ fontWeight: "500", paddingBottom: "0em" }}>
        Hala:{" "}
      </Typography>
      <Grid container spacing={10}>
        <Grid item xs={2}>
          <Typography sx={{ fontWeight: "500" }}>Název: </Typography>
          <Typography sx={{ fontWeight: "500" }}>Umístení: </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{hall?.name}</Typography>
          <Typography>{hall?.location}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

interface HallInfoProps2 {
  teamId: string;
  treningHallId: string;
}

const HallInfo2: React.FC<HallInfoProps2> = ({ teamId, treningHallId }) => {
  const { loading, error, data } = useQuery(GET_HALL_BY_TEAM_AND_HALL_ID2, {
    variables: { teamId, treningHallId },
  });

  if (loading) return <CircularProgress color="primary" size={20} />;
  if (error) return <Typography>Error loading hall information</Typography>;

  const hall = data.getTrainingHallByTeamAndHallId;
  console.log(hall);
  return (
    <Box sx={{ paddingBottom: "0.5em" }}>
      <Typography sx={{ fontWeight: "500", paddingBottom: "0em" }}>
        Hala{" "}
      </Typography>
      <Grid container spacing={10}>
        <Grid item xs={2}>
          <Typography sx={{ fontWeight: "500" }}>Název: </Typography>
          <Typography sx={{ fontWeight: "500" }}>Umístení: </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>{hall.name}</Typography>
          <Typography>{hall.location}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const SubteamDetails: React.FC<{ subteamId: string }> = ({ subteamId }) => {
  const { loading, error, data } = useQuery(GET_SUBTEAM_DETAILS, {
    variables: { subteamId },
  });

  if (loading) return <CircularProgress color="primary" size={20} />;
  if (error) return <Typography>Error loading subteam information</Typography>;

  const subteamDetails = data.getCompleteSubteamDetail;
  return (
    <Typography>
      {" "}
      <span style={{ fontWeight: 500 }}>Tým:</span> {subteamDetails.Name}
    </Typography>
  );
};

export default CalendarComponent;
