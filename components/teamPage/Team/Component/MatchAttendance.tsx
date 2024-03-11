/* eslint-disable @typescript-eslint/strict-boolean-expressions */
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
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
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
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
} from "@mui/icons-material";

const GET_ALL_MATCHES_BY_SUBTEAM_ID = gql`
  query GetAllMatchesBySubteamId($subteamId: String!) {
    getAllMatchBySubteamId(subteamId: $subteamId) {
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
      matchType
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

type props = {
  subteamId: string;
};

interface Match {
  matchId: string;
  opponentName: string;
  selectedHallId: string;
  subteamIdSelected: string;
  selectedPlayers: string[];
  selectedManagement: string[];
  date: string;
  time: string;
  selectedMembers: string[];
  selectedHallPosition: string;
  matchType: string;
  attendance?: {
    player: string;
    hisAttendance: number;
    reason?: string;
  }[];
}

interface SubteamMember {
  name: string;
  surname: string;
  email: string;
  picture: string;
  role: string;
  position: string;
}

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
      totalMatches++;
      if (attendance.hisAttendance === 1) {
        totalPresence++;
      }
    }
  });

  return totalMatches > 0 ? (totalPresence / totalMatches) * 100 : 0;
};

const MatchAttendance: React.FC<props> = (id) => {
  const CurrentUserEmail = authUtils.getCurrentUser()?.email;

  const subteamId = id.subteamId;

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
  const [filterType, setFilterType] = React.useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  if (matchLoading || subteamLoading) {
    return <p>Loading...</p>;
  }

  if (matchError || subteamError) {
    return <p>Error: {subteamError?.message || matchError?.message}</p>;
  }

  const matches: Match[] = matchData.getAllMatchBySubteamId;
  const subteamDetail = subteamData.getCompleteSubteamDetail;
  const currentUserMember = subteamDetail?.subteamMembers.find(
    (member: SubteamMember) => member.email === CurrentUserEmail
  );
  let filteredMembers: SubteamMember[] = [];
  if (currentUserMember && currentUserMember.role === "3") {
    filteredMembers = [currentUserMember];
  } else {
    filteredMembers =
      subteamDetail?.subteamMembers.filter(
        (member: SubteamMember) => member.role === "3"
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
  ? filteredMatches.map((match) => {
      // Zjistěte, zda je vybraný člen pozván na tento zápas
      const isInvited = match.attendance?.some((a: { player: string }) => a.player === selectedMember);
      if (isInvited) {
        const attendance = match.attendance?.find((a: { player: string }) => a.player === selectedMember);
        return {
          name: match.date,
          hisAttendance: attendance ? attendance.hisAttendance : 0,
        };
      }
      // Pokud není pozván, vraťte null
      return null;
    }).filter(Boolean) // Odfiltrujte nullové hodnoty
  : [];

const pieChartData = selectedMemberAttendance.length > 0
  ? [
      {
        name: "Přítomen",
        value: selectedMemberAttendance.filter((entry) => entry?.hisAttendance === 1).length,
      },
      {
        name: "Nepřítomen",
        value: selectedMemberAttendance.filter((entry) => entry?.hisAttendance === 2).length,
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
        <Box>
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
                  <TableCell>Průměr (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.map((member: SubteamMember) => (
                  <TableRow key={member.email}>
                    <TableCell
                      onClick={() => setSelectedMember(member.email)}
                      style={{ cursor: "pointer" }}
                    >
                      {member.name} {member.surname}
                    </TableCell>
                    {filteredMatches.map((match) => {
                      const attendance = match.attendance?.find(
                        (a) => a.player === member.email
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
          <Box>
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
          </Box>
        </Box>
      ) : (
        <Typography>No subteam members found with role 3.</Typography>
      )}
    </Box>
  );
};

export default MatchAttendance;
