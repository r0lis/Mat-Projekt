/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Select, MenuItem } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";

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


const MatchAttendance: React.FC<props> = (id) => {

  const subteamId = id.subteamId;

  const { loading: matchLoading, error: matchError, data: matchData } = useQuery(GET_ALL_MATCHES_BY_SUBTEAM_ID, {
    variables: { subteamId },
  });

  const { loading: subteamLoading, error: subteamError, data: subteamData } = useQuery(GET_COMPLETE_SUBTEAM_DETAIL, {
    variables: { subteamId },
  });
  const [filterType, setFilterType] = React.useState<string>('all'); 

  if (matchLoading || subteamLoading) {
    return <p>Loading...</p>;
  }

  if (matchError || subteamError) {
    return <p>Error: {subteamError?.message || matchError?.message}</p>;
  }

  const matches: Match[] = matchData.getAllMatchBySubteamId;
  const subteamDetail = subteamData.getCompleteSubteamDetail;
  const filteredMembers = subteamDetail?.subteamMembers.filter((member: { role: string; }) => member.role === '3') || [];
  const sortedMatches = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const filteredMatches = sortedMatches.filter((match) => {
    if (filterType === 'all') return true;

    const matchDate = new Date(match.date);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    if (filterType === 'year') {
      return matchDate.getFullYear() === currentYear;
    } else if (filterType === 'month') {
      return matchDate.getFullYear() === currentYear && matchDate.getMonth() === currentMonth;
    }

    return true;
  });

  return (
    <Box sx={{ marginLeft: "2%", marginRight: "2%" }}>
      <Box sx={{marginTop:"0.5em", marginBottom:"0.5em"}}>
      <Typography variant="h5">Docházka hráčů</Typography>
      </Box>
      <Box sx={{ marginBottom: "1em", display:"flex", marginTop:"1em" }}>
      <Typography sx={{fontSize:"1.2em", fontWeight:"400", marginRight:"1.5em"}}>Filtr:</Typography>
      <Select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value as string)}
      >
        <MenuItem value="all">Všechny</MenuItem>
        <MenuItem value="year">Rok</MenuItem>
        <MenuItem value="month">Měsíc</MenuItem>
      </Select>
    </Box>
      {filteredMembers.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Člen</TableCell>
                {filteredMatches.map((match) => (
                  <TableCell key={match.matchId}>{match.date &&
                    new Date(match.date).toLocaleDateString("cs-CZ", {
                      day: "2-digit",

                      month: "2-digit",
                    })}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member: SubteamMember) => (
                <TableRow key={member.email}>
                <TableCell>{member.name} {member.surname}</TableCell>
                {filteredMatches.map((match) => {
                  const attendance = match.attendance?.find((a) => a.player === member.email);

                  return (
                    <TableCell key={match.matchId}>
                      {attendance ? (
                        attendance.hisAttendance === 1 ? (
                          <CheckCircleIcon sx={{ color: "green" }} />
                        ) : attendance.hisAttendance === 2 ? (
                          <CancelIcon sx={{ color: "red" }} />
                        ) : (
                          <HelpIcon sx={{ color: "rgba(200, 198, 199, 0.8)"}} />
                        )
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No subteam members found with role 3.</Typography>
      )}
    </Box>
  );
};

export default MatchAttendance;