/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Avatar,
  Modal,
  Button,
  TextField,
  Card,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HelpIcon from "@mui/icons-material/Help";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

const GET_SUBTEAMS = gql`
  query GetYourSubteamData($teamId: String!, $email: String!) {
    getYourSubteamData(teamId: $teamId, email: $email) {
      Name
      subteamId
      teamId
    }
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

const GET_SUBTEAM_DETAILS = gql`
  query GetSubteamDetails($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      Name
    }
  }
`;

const UPDATE_ATTENDANCE = gql`
  mutation UpdateTrainingAttendance(
    $matchId: String!
    $player: String!
    $hisAttendance: Int!
    $reason: String!
  ) {
    updateTrainingAttendance(
      matchId: $matchId
      player: $player
      hisAttendance: $hisAttendance
      reason: $reason
    )
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

const GET_USER_DETAILS = gql`
  query GetUserDetails($email: String!) {
    getUserByNameAndSurname(email: $email) {
      Name
      Surname
      Picture
    }
  }
`;

type Props = {
  teamId: string;
};

interface Training {
  matchId: string;
  opponentName: string;
  selectedHallId: string;
  subteamIdSelected: string;
  endTime: string;
  selectedPlayers: string[];
  selectedManagement: string[];
  date: string;
  time: string;
  description: string;
  selectedMembers: string[];
  attendance?: {
    player: string;
    hisAttendance: number;
    reason?: string;
  }[];
}

const AllTrainings: React.FC<Props> = ({ teamId }) => {
  const user = authUtils.getCurrentUser();
  const [subteamIds, setSubteamIds] = useState<string[]>([]);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, setUserDetails] = useState<any>(null);
  const [updatingMatchId, setUpdatingMatchId] = useState<string | null>(null);
  const [updateAttendanceMutation] = useMutation(UPDATE_ATTENDANCE);
  const [openModal, setOpenModal] = useState(false);
  const [reason, setReason] = useState("");
  const [userSelection, setUserSelection] = useState<number | null>(null);
  const [showReason, setShowReason] = useState(false);
  const [expandedTraining, setExpandedTraining] = useState<string | null>(null);
  const router = useRouter();

  const {
    loading: roleLoading,
    error: roleError,
    data: roleData,
  } = useQuery(GET_USER_ROLE_IN_TEAM, {
    variables: { teamId: teamId, email: user?.email || "" },
    skip: !user,
  });

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
  } = useQuery(GET_TRAININGS_BY_SUBTEAM, {
    variables: { input: { subteamIds: subteamIds || [] } },
    skip: subteamIds.length === 0,
  });

  const {
    loading: userDetailsLoading,
    error: userDetailsError,
    data: userDetailsData,
  } = useQuery(GET_USER_DETAILS, {
    variables: { email: user?.email || "" },
    skip: !user,
  });

  useEffect(() => {
    if (userDetailsData) {
      setUserDetails(userDetailsData.getUserByNameAndSurname);
    }
  }, [userDetailsData]);

  const {
    loading,
    error,
    data: dataHalls,
  } = useQuery(GET_HALL_BY_TEAM_AND_HALL_ID, {
    variables: { teamId },
  });

  if (
    subteamLoading ||
    matchesLoading ||
    userDetailsLoading ||
    roleLoading ||
    loading
  )
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
  if (subteamError || matchesError || userDetailsError || roleError || error)
    return <Typography>Chyba</Typography>;

  const userRole = roleData?.getUserRoleInTeam?.role;
  const isRole3 = userRole == 3;

  const handleButtonClick = () => {
    router.push(`/Team/${teamId}/#Settings`);
    window.location.reload();
  };

  if (
    !dataHalls ||
    !dataHalls.getTreningHallsByTeamId ||
    dataHalls.getTreningHallsByTeamId.length === 0
  ) {
    return (
      <Box
        sx={{
          backgroundColor: "	rgba(255,153,102, 0.3)",
          height: "8em",
          padding: "0em 0em 1.5em 0em",
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: "10px",
          border: "1px solid rgba(255,153,102, 1)",
        }}
      >
        <Box
          sx={{
            backgroundColor: "	rgba(255,153,102, 0.4)",
            borderRadius: "10px 10px 0px 0px",
            padding: "1em",
            borderBottom: "2px solid rgba(255,153,102, 1)",
          }}
        >
          <Typography sx={{ fontSize: "1.2em", fontWeight: "500" }}>
            Varování
          </Typography>
        </Box>
        <Box sx={{ padding: "1em", display: "flex" }}>
          {isRole3 ? (
            <Typography>Tréninky nejsou k dispozici</Typography>
          ) : (
            <Typography>Dokončete vytvoření klubu ve správě.</Typography>
          )}
          <Button
            onClick={handleButtonClick}
            sx={{
              marginLeft: "auto",
              backgroundColor: "#027ef2",
              color: "white",
              fontWeight: "500",
            }}
          >
            Správa
          </Button>
        </Box>
      </Box>
    );
  }
  if (
    !matchesData ||
    !matchesData.getAllTrainingsBySubteam ||
    matchesData.getAllTrainingsBySubteam[0]?.trainings.length === 0
  ) {
    return (
      <Box
        sx={{
          backgroundColor: "	rgba(255,153,102, 0.3)",
          height: "8em",
          padding: "0em 0em 1.5em 0em",
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: "10px",
          border: "1px solid rgba(255,153,102, 1)",
        }}
      >
        <Box
          sx={{
            backgroundColor: "	rgba(255,153,102, 0.4)",
            borderRadius: "10px 10px 0px 0px",
            padding: "1em",
            borderBottom: "2px solid rgba(255,153,102, 1)",
          }}
        >
          <Typography sx={{ fontSize: "1.2em", fontWeight: "500" }}>
            Varování
          </Typography>
        </Box>
        <Box sx={{ padding: "1em", display: "flex" }}>
          <Typography>Nemáte naplánovaný žádný trénink.</Typography>
        </Box>
      </Box>
    );
  }

  const handleAttendanceChange = (matchId: string) => {
    setUpdatingMatchId(matchId);
  };

  const handleUpdateAttendance = (matchId: string, value: number) => {
    const player = user?.email || "";

    try {
      updateAttendanceMutation({
        variables: { matchId, player, hisAttendance: value, reason },
        refetchQueries: [
          {
            query: GET_TRAININGS_BY_SUBTEAM,
            variables: { input: { subteamIds } },
          },
        ],
      });
      setExpandedMatchId(null);
      setUpdatingMatchId(null);
    } catch (error) {
      console.error("Chyba při aktualizaci účasti:", error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setReason("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setUserSelection(null);
  };

  const handleCloseModalReason = () => {
    setShowReason(false);
  };

  const isMatchEditable = (matchDate: string, matchTime: string): boolean => {
    const currentDateTime = new Date();
    const matchDateTime = new Date(`${matchDate}T${matchTime}`);
  
    if (matchDateTime > currentDateTime) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Box sx={{paddingTop:"1em"}}>
      {subteamIds.map((subteamId) => {
        const subteamTrainings = matchesData?.getAllTrainingsBySubteam
          .filter(
            (subteam: { subteamId: string }) => subteam.subteamId === subteamId
          )
          .map(
            (subteam: { subteamId: string; trainings: Training[] }) =>
              subteam.trainings
          )
          .flat();

        const sortedTrainings = subteamTrainings.sort(
          (a: Training, b: Training) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA.getTime() - dateB.getTime();
          }
        );

        return (
          <Box key={subteamId}>
            {sortedTrainings
              .filter((training: Training) => {
                const isUserInTraining = training.selectedMembers.includes(
                  user?.email || ""
                );

                const isUserRoleNot3 = userRole !== 3;

                return isUserInTraining && isUserRoleNot3;
              })
              .map((training: Training) => (
                <Box
                  sx={{
                    marginLeft: "3%",
                    marginRight: "3%",
                    marginBottom: "2em",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 130, 0, 0.15)",
                    border: "2px solid rgba(255, 130, 0, 1)",
                    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.33)",
                  }}
                  key={training.matchId}
                >
                  <Box
                    sx={{
                      paddingLeft: "1em",
                      paddingRight: "1em",
                      backgroundColor: "rgba(255, 130, 0, 0.15)",
                      borderRadius: "10px 10px 0 0",
                      borderBottom: "2px solid rgba(255, 130, 0, 1)",
                      paddingTop: "1em",
                      paddingBottom: "0.5em",
                    }}
                  >
                    <Typography variant="h6">
                      Trénink: {training.opponentName}
                      {(() => {
                        const trainingDate = new Date(
                          `${training.date}T${training.time}`
                        );
                        const currentDate = new Date();
                        const isTrainingPassed = trainingDate < currentDate;
                        const isTrainingToday =
                          trainingDate.toDateString() ===
                          currentDate.toDateString();
                        const isTrainingTomorrow =
                          trainingDate.toDateString() ===
                          new Date(
                            currentDate.getTime() + 24 * 60 * 60 * 1000
                          ).toDateString();

                        if (isTrainingPassed) {
                          return (
                            <Typography variant="body2" sx={{ }}>
                              Proběhl
                            </Typography>
                          );
                        } else if (isTrainingToday) {
                          return (
                            <Typography variant="body2" sx={{ color: "" }}>
                              Dnes
                            </Typography>
                          );
                        } else if (isTrainingTomorrow) {
                          return (
                            <Typography
                              variant="body2"
                              sx={{ color: "" }}
                            >
                              Zítra
                            </Typography>
                          );
                        } else {
                          return null;
                        }
                      })()}
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                      <Typography>
                        Datum:{" "}
                        {training.date &&
                          new Date(training.date).toLocaleDateString("cs-CZ", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                      </Typography>
                      <Typography sx={{ marginLeft: "1em" }}>
                        Čas: {training.time}-{training.endTime}
                      </Typography>
                      <Box sx={{ marginLeft: "auto" }}>
                        {isRole3 && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{ marginLeft: "auto", cursor: "pointer" }}
                              onClick={() =>
                                handleAttendanceChange(training.matchId)
                              }
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                  {isMatchEditable(training.date, training.time) ? (
                                  <Typography
                                    onClick={handleOpenModal}
                                    sx={{ fontWeight: "500" }}
                                  >
                                    Změnit účast
                                  </Typography>
                                ) : (<Typography sx={{ fontWeight: "500" }}>Účast</Typography>)}

                                {training.attendance?.map(
                                  (attendanceRecord: {
                                    player: React.Key | null | undefined;
                                    hisAttendance: number;
                                  }) =>
                                    user?.email === attendanceRecord.player && (
                                      <Box
                                        key={attendanceRecord.player}
                                        sx={{
                                          marginLeft: "1em",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <>
                                          <>
                                          {attendanceRecord.hisAttendance ===
                                              0 && (
                                              <HelpIcon
                                                style={{
                                                  color: "gray",
                                                  marginLeft: "0.5em",
                                                }}
                                              />
                                            )}
                                            {attendanceRecord.hisAttendance ===
                                              1 && (
                                              <CheckCircleIcon
                                                style={{
                                                  color: "green",
                                                  marginLeft: "0.5em",
                                                }}
                                              />
                                            )}
                                            {attendanceRecord.hisAttendance ===
                                              2 && (
                                              <CancelIcon
                                                style={{
                                                  color: "red",
                                                  marginLeft: "0.5em",
                                                }}
                                              />
                                            )}
                                          </>
                                        </>

                                        {updatingMatchId ===
                                          training.matchId && (
                                          <>
                                            <Modal
                                              open={openModal}
                                              onClose={handleCloseModal}
                                              aria-labelledby="modal-title"
                                              aria-describedby="modal-description"
                                            >
                                              <Box
                                                sx={{
                                                  position: "absolute",
                                                  top: "50%",
                                                  left: "50%",
                                                  width: "30%",
                                                  height:
                                                    userSelection == 2
                                                      ? "43%"
                                                      : "30%",
                                                  transform:
                                                    "translate(-50%, -50%)",
                                                  backgroundColor: "white",
                                                  borderRadius: "10px",
                                                  padding: "1.5em",
                                                }}
                                              >
                                                <Typography
                                                  sx={{
                                                    fontWeight: "500",
                                                    marginBottom: "0.2em",
                                                  }}
                                                >
                                                  Zvolte docházku na zápas
                                                  proti: {training.opponentName}
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    fontWeight: "500",
                                                    marginBottom: "0.5em",
                                                  }}
                                                >
                                                  Datum: {training.date}
                                                </Typography>
                                                <Box
                                                  onClick={() =>
                                                    setUserSelection(1)
                                                  }
                                                  sx={{
                                                    width: "30%",
                                                    backgroundColor:
                                                      userSelection == 1
                                                        ? "rgba(3, 195, 17, 0.3)"
                                                        : "",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border:
                                                      "1px solid rgba(3, 195, 17, 1)",
                                                    borderRadius: "10px",
                                                    padding: "0.5em",
                                                    marginBottom: "0.5em",
                                                  }}
                                                >
                                                  <Typography
                                                    sx={{
                                                      cursor: "pointer",
                                                      fontWeight: "500",
                                                      fontSize: "1em",
                                                    }}
                                                  >
                                                    Ano
                                                  </Typography>
                                                </Box>

                                                <Box
                                                  sx={{
                                                    width: "30%",
                                                    backgroundColor:
                                                      userSelection == 2
                                                        ? "rgba(250, 0, 0, 0.2)"
                                                        : "",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border:
                                                      "1px solid rgba(250, 0, 0, 1)",
                                                    borderRadius: "10px",
                                                    padding: "0.5em",
                                                    marginBottom: "0.5em",
                                                  }}
                                                  onClick={() =>
                                                    setUserSelection(2)
                                                  }
                                                >
                                                  <Typography
                                                    sx={{ cursor: "pointer" }}
                                                  >
                                                    Ne
                                                  </Typography>
                                                </Box>

                                                {userSelection !== null && (
                                                  <>
                                                    {userSelection === 2 && (
                                                      <TextField
                                                        label="Důvod"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={reason}
                                                        sx={{}}
                                                        onChange={(e) =>
                                                          setReason(
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                    )}
                                                    {userSelection === 2 &&
                                                      reason.length < 3 && (
                                                        <Box>
                                                          <Typography
                                                            variant="caption"
                                                            sx={{
                                                              color: "red",
                                                              marginBottom:
                                                                "1em",
                                                            }}
                                                          >
                                                            Důvod musí mít
                                                            alespoň 3 znaky.
                                                          </Typography>
                                                        </Box>
                                                      )}

                                                    <Button
                                                      variant="contained"
                                                      color="primary"
                                                      sx={{ marginTop: "1em" }}
                                                      onClick={() => {
                                                        if (
                                                          userSelection == 2 &&
                                                          reason.length >= 3
                                                        ) {
                                                          handleUpdateAttendance(
                                                            training.matchId,
                                                            userSelection
                                                          );
                                                          handleCloseModal();
                                                        }
                                                        if (
                                                          userSelection == 1
                                                        ) {
                                                          handleUpdateAttendance(
                                                            training.matchId,
                                                            userSelection
                                                          );
                                                          handleCloseModal();
                                                        }
                                                      }}
                                                    >
                                                      Potvrdit
                                                    </Button>
                                                  </>
                                                )}
                                              </Box>
                                            </Modal>
                                          </>
                                        )}
                                      </Box>
                                    )
                                )}
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      paddingLeft: "1em",
                      paddingRight: "1em",
                      paddingTop: "0.5em",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={1.5}>
                        <Typography sx={{ fontWeight: "500" }}>
                          Váš tým:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          {training.subteamIdSelected && (
                            <SubteamDetails
                              subteamId={training.subteamIdSelected}
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>

                    <Typography sx={{ fontWeight: "500", paddingTop: "0.5em" }}>
                      Info haly
                    </Typography>
                    <Box>
                      {training.selectedHallId && (
                        <HallInfo
                          teamId={teamId}
                          treningHallId={training.selectedHallId}
                        />
                      )}
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex" }}>
                        <Typography sx={{ fontWeight: "500" }}>
                          Popis tréninku
                        </Typography>
                        <IconButton
                          sx={{ marginLeft: "1%", marginTop: "-10px" }}
                          onClick={() =>
                            setExpandedTraining(
                              expandedTraining === training.matchId
                                ? null
                                : training.matchId
                            )
                          }
                        >
                          {expandedTraining === training.matchId ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Box>
                      <Collapse
                        in={expandedTraining === training.matchId}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Card sx={{ marginBottom: "1em" }}>
                          <Typography
                            sx={{ padding: "0.5em 0.5em", fontSize: "1rem" }}
                          >
                            {training.description}
                          </Typography>
                        </Card>
                      </Collapse>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      paddingLeft: "1em",
                      paddingRight: "1em",
                      backgroundColor: "rgba(255, 130, 0, 0.15)",
                      borderRadius: "0px 0px 10px 10px",
                      borderTop: "2px solid rgba(255, 130, 0, 1)",
                      paddingBottom: "0.5em",
                      paddingTop: "0.5em",
                    }}
                  >
                    {expandedMatchId === training.matchId ? (
                      <Box>
                        <Box sx={{ display: "flex" }}>
                          <Typography sx={{ fontWeight: "500" }}>
                            Účastníci:
                          </Typography>
                          <Box>
                            <ExpandLessIcon
                              onClick={() => setExpandedMatchId(null)}
                            />
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                            marginTop: "0.5em",
                            paddingBottom: "1em",
                            marginBottom: "1em",
                          }}
                        >
                          <Box sx={{ paddingTop: "1em", display: "flex" }}>
                            <Typography
                              sx={{
                                fontWeight: "500",
                                marginLeft: "10%",
                                marginRight: "auto",
                                fontSize: "1.2em",
                              }}
                            >
                              Management a trenéři:
                            </Typography>
                          </Box>
                          {training.selectedManagement &&
                          training.selectedManagement.length > 0 ? (
                            <Table
                              sx={{
                                borderRadius: "10px",
                                width: "80%",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {training.selectedManagement.map(
                                  (
                                    member: string,
                                    index: React.Key | null | undefined
                                  ) => (
                                    <TableRow
                                      sx={{ borderBottom: "2px solid gray" }}
                                      key={index}
                                    >
                                      <UserDetails email={member} />
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          ) : (
                            <Box>
                              <Typography sx={{ fontWeight: "500" }}>
                                Účastníci:
                              </Typography>
                              <Typography>Žádní nominovaní hráči.</Typography>
                            </Box>
                          )}
                        </Box>

                        <Box
                          sx={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                            marginTop: "0.5em",
                            paddingBottom: "1em",
                            marginBottom: "1em",
                          }}
                        >
                          {isRole3 ? (
                            <>
                              <Table
                                sx={{
                                  borderRadius: "10px",
                                  width: "80%",
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                }}
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Docházka</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {training.selectedPlayers.map(
                                    (member, index) => {
                                      const attendanceRecord =
                                        training.attendance?.find(
                                          (record) => record.player === member
                                        );

                                      if (
                                        user?.email === member ||
                                        attendanceRecord?.hisAttendance !== 0
                                      ) {
                                        return (
                                          <TableRow
                                            sx={{
                                              borderBottom: "2px solid gray",
                                            }}
                                            key={index}
                                          >
                                            <UserDetails email={member} />
                                            {attendanceRecord && (
                                              <>
                                                {attendanceRecord.hisAttendance ===
                                                  1 && (
                                                  <CheckCircleIcon
                                                    style={{
                                                      color: "green",
                                                      marginLeft: "0.5em",
                                                      width: "1.5em",
                                                      height: "1.5em",
                                                      marginTop: "0.8em",
                                                    }}
                                                  />
                                                )}
                                                {attendanceRecord.hisAttendance ===
                                                  2 && (
                                                  <CancelIcon
                                                    style={{
                                                      color: "red",
                                                      marginLeft: "0.5em",
                                                      width: "1.5em",
                                                      height: "1.5em",
                                                      marginTop: "0.8em",
                                                    }}
                                                  />
                                                )}
                                                {attendanceRecord.hisAttendance ===
                                                  0 && (
                                                  <HelpIcon
                                                    style={{
                                                      color: "gray",
                                                      marginLeft: "0.5em",
                                                      width: "1.5em",
                                                      height: "1.5em",
                                                      marginTop: "0.8em",
                                                    }}
                                                  />
                                                )}
                                              </>
                                            )}
                                          </TableRow>
                                        );
                                      }
                                      return null;
                                    }
                                  )}
                                </TableBody>
                              </Table>
                            </>
                          ) : (
                            <>
                              <Box sx={{ paddingTop: "1em", display: "flex" }}>
                                <Typography
                                  sx={{
                                    fontWeight: "500",
                                    marginLeft: "10%",
                                    marginRight: "auto",
                                    fontSize: "1.2em",
                                  }}
                                >
                                  Hráči:
                                </Typography>
                              </Box>
                              {training.selectedPlayers &&
                              training.selectedPlayers.length > 0 ? (
                                <Table
                                  sx={{
                                    borderRadius: "10px",
                                    width: "80%",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                  }}
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell></TableCell>
                                      <TableCell>Docházka</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {training.selectedPlayers.map(
                                      (member, index) => (
                                        <TableRow
                                          sx={{
                                            borderBottom: "2px solid gray",
                                          }}
                                          key={index}
                                        >
                                          <UserDetails email={member} />
                                          {training.attendance?.map(
                                            (attendanceRecord) =>
                                              attendanceRecord.player ===
                                                member && (
                                                <>
                                                  {attendanceRecord.hisAttendance ===
                                                    1 && (
                                                    <CheckCircleIcon
                                                      key={
                                                        attendanceRecord.player
                                                      }
                                                      style={{
                                                        color: "green",
                                                        marginLeft: "0.5em",
                                                        width: "1.5em",
                                                        height: "1.5em",
                                                        marginTop: "0.8em",
                                                      }}
                                                    />
                                                  )}
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    {attendanceRecord.hisAttendance ===
                                                      2 && (
                                                      <CancelIcon
                                                        key={
                                                          attendanceRecord.player
                                                        }
                                                        onClick={() =>
                                                          setShowReason(true)
                                                        }
                                                        style={{
                                                          color: "red",
                                                          marginLeft: "0.5em",
                                                          width: "1.5em",
                                                          height: "1.5em",
                                                          marginTop: "0.8em",
                                                        }}
                                                      />
                                                    )}

                                                    {attendanceRecord.reason &&
                                                      showReason == true && (
                                                        <Modal
                                                          open={showReason}
                                                          onClose={
                                                            handleCloseModalReason
                                                          }
                                                          aria-labelledby="modal-title"
                                                          aria-describedby="modal-description"
                                                        >
                                                          <Box
                                                            sx={{
                                                              position:
                                                                "absolute",
                                                              top: "50%",
                                                              left: "50%",
                                                              width: "30%",
                                                              height: "40%",
                                                              transform:
                                                                "translate(-50%, -50%)",
                                                              backgroundColor:
                                                                "white",
                                                              borderRadius:
                                                                "10px",
                                                              padding: "1.5em",
                                                            }}
                                                          >
                                                            <Typography>
                                                              Důvod
                                                              nepřítomnosti
                                                              hráče{" "}
                                                              <UserDetails
                                                                email={member}
                                                              />
                                                              na zápas proti{" "}
                                                              {
                                                                training.opponentName
                                                              }
                                                              :
                                                            </Typography>
                                                            <Card
                                                              sx={{
                                                                marginTop:
                                                                  "1em",
                                                                padding: "1em",
                                                                boxShadow:
                                                                  "0 0 10px rgba(0, 0, 0, 0.3)",
                                                              }}
                                                            >
                                                              <Typography
                                                                variant="caption"
                                                                sx={{
                                                                  color: "",
                                                                  marginLeft:
                                                                    "0.5em",
                                                                  fontSize:
                                                                    "0.8em",
                                                                }}
                                                              >
                                                                {
                                                                  attendanceRecord.reason
                                                                }
                                                              </Typography>
                                                            </Card>
                                                          </Box>
                                                        </Modal>
                                                      )}
                                                  </Box>
                                                  {attendanceRecord.hisAttendance ===
                                                    0 && (
                                                    <HelpIcon
                                                      key={
                                                        attendanceRecord.player
                                                      }
                                                      style={{
                                                        color: "gray",
                                                        marginLeft: "0.5em",
                                                        width: "1.5em",
                                                        height: "1.5em",
                                                        marginTop: "0.8em",
                                                      }}
                                                    />
                                                  )}
                                                </>
                                              )
                                          )}
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              ) : (
                                <Box>
                                  <Typography sx={{ fontWeight: "500" }}>
                                    Účastníci:{" "}
                                  </Typography>
                                  <Typography>
                                    Žádní nominovaní hráči.
                                  </Typography>
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Box sx={{ display: "flex" }}>
                          <Typography sx={{ fontWeight: "500" }}>
                            Účastníci:{" "}
                          </Typography>
                          <Box>
                            <ExpandMoreIcon
                              onClick={() =>
                                setExpandedMatchId(training.matchId)
                              }
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
          </Box>
        );
      })}
    </Box>
  );
};

interface HallInfoProps {
  teamId: string;
  treningHallId: string;
}

const HallInfo: React.FC<HallInfoProps> = ({ teamId, treningHallId }) => {
  const { loading, error, data } = useQuery(GET_HALL_BY_TEAM_AND_HALL_ID2, {
    variables: { teamId, treningHallId },
  });

  if (loading) return <CircularProgress color="primary" size={20} />;
  if (error) return <Typography>Error loading hall information</Typography>;

  const hall = data.getTrainingHallByTeamAndHallId;
  console.log(hall);
  return (
    <Box sx={{ paddingBottom: "0.5em" }}>
      <Grid container spacing={2}>
        <Grid item xs={1.5}>
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
  return <Typography> {subteamDetails.Name}</Typography>;
};

const UserDetails: React.FC<{ email: string }> = ({ email }) => {
  const { loading, error, data } = useQuery(GET_USER_DETAILS, {
    variables: { email },
  });

  if (loading) return <CircularProgress color="primary" size={20} />;
  if (error) return <Typography>Error loading user details</Typography>;

  const userDetails = data.getUserByNameAndSurname;
  return (
    <>
      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center", // Center items vertically
          }}
        >
          {userDetails.Picture && (
            <Avatar
              src={userDetails.Picture}
              alt={`Avatar for ${userDetails.Name}`}
              sx={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          )}
          <Typography sx={{ marginLeft: "1em", fontWeight: "500" }}>
            {userDetails.Name} {userDetails.Surname}
          </Typography>
        </Box>
      </TableCell>
    </>
  );
};


export default AllTrainings