/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Typography, Modal, Button } from "@mui/material";
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

type Props = {
  teamId: string;
};

const CalendarComponent: React.FC<Props> = ({ teamId }) => {
  const user = authUtils.getCurrentUser();
  const [subteamIds, setSubteamIds] = useState<string[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  console.log(teamId);
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
            title: match.opponentName,
            start: `${match.date}T${match.time}`,
            end: `${match.date}T${match.endTime}`,
            type: "Zápas", // Přidání typu události
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
            title: training.description,
            start: `${training.date}T${training.time}`,
            end: `${training.date}T${training.endTime}`,
            type: "Trénink", // Přidání typu události
          }))
      );
      setCalendarEvents((prevEvents: any[]) => [
        ...prevEvents,
        ...trainingEvents,
      ]);
    }
  }, [trainingsData]);

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event.extendedProps);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
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
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {selectedEvent?.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Typ: {selectedEvent?.type}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Datum: {selectedEvent?.time}
          </Typography>
          <Button onClick={handleCloseModal}>Zavřít</Button>
        </Box>
      </Modal>
    </Box>
  );
};

const renderEventContent = (eventInfo: any) => {
  return (
    <div>
      <b>{eventInfo.event.extendedProps.type}</b>{" "}
      {eventInfo.event.extendedProps.type !== "Trénink" && (
        <b>{eventInfo.event.title}</b>
      )}
      <p>Čas: {eventInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p> {/* Zobrazení času */}
    </div>
  );
};

export default CalendarComponent;
