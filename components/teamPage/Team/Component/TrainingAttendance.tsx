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
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Help as HelpIcon } from "@mui/icons-material";
import { authUtils } from "@/firebase/auth.utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

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

const calculateAttendancePercentage = (attendance: number[]): number => {
  const totalMatches = attendance.length;
  if (totalMatches === 0) return 0;

  const totalPresence = attendance.filter((a) => a === 1).length;
  return (totalPresence / totalMatches) * 100;
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

  const currentUserMember = subteamDetail?.subteamMembers.find((member: { email: string | null | undefined; }) => member.email === CurrentUserEmail);

  let filteredMembers: { email: string, name: string, surname: string }[] = [];
  if (currentUserMember && currentUserMember.role === '3') {
    filteredMembers = [currentUserMember];
  } else {
    filteredMembers =
      subteamDetail?.subteamMembers.filter(
        (        member: { role: string; }) => member.role === "3"
      ) || [];
  }

  const sortedMatches = [...matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const filteredMatches = sortedMatches.filter(match => {
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

  const selectedMemberAttendance = selectedMember ? filteredMatches.map(match => {
    const attendance = match.attendance?.find((a: { player: string; }) => a.player === selectedMember);
    return { name: match.date, hisAttendance: attendance ? attendance.hisAttendance : 0 };
  }) : [];

  const pieChartData = [
    { name: 'Presence', value: selectedMemberAttendance.filter(entry => entry.hisAttendance === 1).length },
    { name: 'Absence', value: selectedMemberAttendance.filter(entry => entry.hisAttendance === 2).length }
  ];

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
                  {filteredMatches.map(match => (
                    <TableCell key={match.matchId}>
                      {match.date &&
                        new Date(match.date).toLocaleDateString("cs-CZ", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                    </TableCell>
                  ))}
                  <TableCell>Průměr (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.map(member => (
                  <TableRow key={member.email}>
                    <TableCell onClick={() => setSelectedMember(member.email)} style={{ cursor: 'pointer' }}>
                      {member.name} {member.surname}
                    </TableCell>
                    {filteredMatches.map(match => {
                      const attendance = match.attendance?.find((a: { player: string; }) => a.player === member.email);

                      return (
                        <TableCell key={match.matchId}>
                          {attendance ? (
                            attendance.hisAttendance === 1 ? (
                              <CheckCircleIcon sx={{ color: "green" }} />
                            ) : attendance.hisAttendance === 2 ? (
                              <CancelIcon sx={{ color: "red" }} />
                            ) : (
                              <HelpIcon sx={{ color: "rgba(200, 198, 199, 0.8)" }} />
                            )
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      {`${Math.round(calculateAttendancePercentage(
                        filteredMatches.map(match => {
                          const attendance = match.attendance?.find((a: { player: string; }) => a.player === member.email);
                          return attendance ? attendance.hisAttendance : 0;
                        })
                      ))} / 100`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {selectedMember && (
            <Box mt={4}>
              <Typography variant="h6">Attendance of {selectedMember}</Typography>
              <LineChart width={800} height={400} data={selectedMemberAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hisAttendance" stroke="#8884d8" />
              </LineChart>
              <PieChart width={400} height={400}>
                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value === 2 ? 'red' : 'green'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
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
