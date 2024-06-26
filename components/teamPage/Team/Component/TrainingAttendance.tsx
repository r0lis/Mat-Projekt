/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
} from "@mui/icons-material";
import { authUtils } from "@/firebase/auth.utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const GET_ALL_MATCHES_BY_SUBTEAM_ID = gql`
  query GetAllTrainingBySubteamId($subteamId: String!) {
    getAllTrainingBySubteamId(subteamId: $subteamId) {
      matchId
      teamId
      subteamIdSelected
      opponentName
      selectedHallId
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
`;

const GET_COMPLETE_SUBTEAM_DETAIL = gql`
  query GetCompleteSubteamDetail($subteamId: String!) {
    getCompleteSubteamDetail(subteamId: $subteamId) {
      Name
      teamId
      subteamId
      subteamMembers {
        name
        surname
        email
        picture
        role
        position
      }
    }
  }
`;

const calculateAttendancePercentage = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches: any[],
  memberEmail: string
): number => {
  let totalMatches = 0;
  let totalPresence = 0;

  matches.forEach((match) => {
    const attendance = match.attendance?.find(
      (a: { player: string }) => a.player === memberEmail
    );
    if (attendance) {
      if (attendance.hisAttendance !== 0){
      totalMatches++;
      }
      if (attendance.hisAttendance === 1) {
        totalPresence++;
      }
    }
  });

  return totalMatches > 0 ? (totalPresence / totalMatches) * 100 : 0;
};

const TrainingAttendance: React.FC<{ subteamId: string }> = ({ subteamId }) => {
  const CurrentUserEmail = authUtils.getCurrentUser()?.email;

  const [filterType, setFilterType] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const {
    loading: matchLoading,
    error: matchError,
    data: matchData,
  } = useQuery(GET_ALL_MATCHES_BY_SUBTEAM_ID, {
    variables: { subteamId },
  });

  const {
    loading: subteamLoading,
    error: subteamError,
    data: subteamData,
  } = useQuery(GET_COMPLETE_SUBTEAM_DETAIL, {
    variables: { subteamId },
  });

  if (matchLoading || subteamLoading) {
    return <p>Loading...</p>;
  }

  if (matchError || subteamError) {
    return <p>Error: {subteamError?.message || matchError?.message}</p>;
  }

  const matches = matchData.getAllTrainingBySubteamId;
  const subteamDetail = subteamData.getCompleteSubteamDetail;

  const currentUserMember = subteamDetail?.subteamMembers.find(
    (member: { email: string | null | undefined }) =>
      member.email === CurrentUserEmail
  );

  let filteredMembers: { email: string; name: string; surname: string }[] = [];
  if (currentUserMember && currentUserMember.role === "3") {
    filteredMembers = [currentUserMember];
  } else {
    filteredMembers =
      subteamDetail?.subteamMembers.filter(
        (member: { role: string }) => member.role === "3"
      ) || [];
  }

  const sortedMatches = [...matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const filteredMatches = sortedMatches.filter((match) => {
    if (filterType === "all") return true;

    const matchDate = new Date(match.date);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    if (filterType === "year") {
      return matchDate.getFullYear() === currentYear;
    } else if (filterType === "month") {
      return (
        matchDate.getFullYear() === currentYear &&
        matchDate.getMonth() === currentMonth
      );
    }

    return true;
  });

  const selectedMemberAttendance = selectedMember
  ? filteredMatches.reduce((result, match) => {
      // Zjistěte, zda je vybraný člen pozván na tento zápas
      const isInvited = match.attendance?.some((a: { player: string }) => a.player === selectedMember);
      if (isInvited) {
        const attendance = match.attendance.find((a: { player: string }) => a.player === selectedMember);
        // Zkontrolujte, jestli je účast 1 nebo 2, jinak nepřidávejte tento zápas do výsledku
        if (attendance && [1, 2].includes(attendance.hisAttendance)) {
          result.push({
            name: match.date,
            hisAttendance: attendance.hisAttendance,
          });
        }
      }
      return result;
    }, [])
  : [];


const pieChartData = selectedMemberAttendance.length > 0
  ? [
      {
        name: "Přítomen",
        value: selectedMemberAttendance.filter((entry: { hisAttendance: number; }) => entry?.hisAttendance === 1).length,
      },
      {
        name: "Nepřítomen",
        value: selectedMemberAttendance.filter((entry: { hisAttendance: number; }) => entry?.hisAttendance === 2).length,
      },
    ]
  : [];


  return (
    <Box sx={{ marginLeft: "2%", marginRight: "2%" }}>
      <Box sx={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
        <Typography variant="h5">Docházka hráčů</Typography>
      </Box>
      <Box sx={{ marginBottom: "1em", display: "flex", marginTop: "1.5em" }}>
        <Typography
          sx={{ fontSize: "1.2em", fontWeight: "400", marginRight: "1.5em" }}
        >
          Filtr:
        </Typography>
        <Select
          sx={{ width: "30%", marginLeft: "auto" }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as string)}
        >
          <MenuItem value="all">Všechny</MenuItem>
          <MenuItem value="year">Rok</MenuItem>
          <MenuItem value="month">Měsíc</MenuItem>
        </Select>
      </Box>
      {filteredMembers.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Člen</TableCell>
                  {filteredMatches.map((match) => (
                    <TableCell key={match.matchId}>
                      {match.date &&
                        new Date(match.date).toLocaleDateString("cs-CZ", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                    </TableCell>
                  ))}
                  <TableCell>Průměr (%) <Typography sx={{fontSize:"0.9em"}}>k dnešnímu dni</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.email}>
                    <TableCell
                      onClick={() => setSelectedMember(member.email)}
                      style={{ cursor: "pointer" }}
                    >
                      {member.name} {member.surname}
                    </TableCell>
                    {filteredMatches.map((match) => {
                      const attendance = match.attendance?.find(
                        (a: { player: string }) => a.player === member.email
                      );

                      return (
                        <TableCell key={match.matchId}>
                          {attendance ? (
                            attendance.hisAttendance === 1 ? (
                              <CheckCircleIcon sx={{ color: "green" }} />
                            ) : attendance.hisAttendance === 2 ? (
                              <CancelIcon sx={{ color: "red" }} />
                            ) : (
                              <HelpIcon
                                sx={{ color: "rgba(200, 198, 199, 0.8)" }}
                              />
                            )
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      {`${Math.round(
                        calculateAttendancePercentage(
                          filteredMatches,
                          member.email
                        )
                      )} / 100`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {selectedMember && (
            <Box mt={4} sx={{ marginLeft: "1em" }}>
              <Typography variant="h6">
                Docházka hráče:{" "}
                {selectedMember &&
                  filteredMembers.find(
                    (member) => member.email === selectedMember
                  )?.name}{" "}
                {selectedMember &&
                  filteredMembers.find(
                    (member) => member.email === selectedMember
                  )?.surname}
              </Typography>
              <LineChart
                width={900}
                height={400}
                data={selectedMemberAttendance}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tick={{ fontSize: 14 }}
                  tickFormatter={(value) =>
                    value === 1
                      ? "Ano"
                      : value === 2
                      ? "Ne"
                      : value === 0
                      ? "NZ"
                      : ""
                  }
                />{" "}
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="hisAttendance"
                  stroke="#8884d8"
                />
              </LineChart>
              <Box display="flex" alignItems="center" justifyContent="center">
                <PieChart width={400} height={400}>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, value }) =>
                      `${name}: ${(
                        (value / selectedMemberAttendance.length) *
                        100
                      ).toFixed(2)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === "Nepřítomen" ? "red" : "green"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
                <Box ml={5}>
                  {pieChartData.map((entry, index) => (
                    <Typography key={index}>
                      {entry.name}:{" "}
                      {(
                        (entry.value / selectedMemberAttendance.length) *
                        100
                      ).toFixed(2)}
                      %
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Typography>No subteam members found with role 3.</Typography>
      )}
    </Box>
  );
};

export default TrainingAttendance;
