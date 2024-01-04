/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
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
    getMatchesBySubteam(input: $input) {
      subteamId
      matches {
        matchId
        teamId
        opponentName
        selectedHallId
        date
        time
        selectedMembers
        matchType
      }
    }
  }
`;

const GET_HALL_BY_TEAM_AND_HALL_ID = gql`
  query GetHallByTeamAndHallId($teamId: String!, $hallId: String!) {
    getHallByTeamAndHallId(teamId: $teamId, hallId: $hallId) {
      hallId
      name
      location
    }
  }
`;

type Props = {
  teamId: string;
};

interface Match {
  matchId: string;
  opponentName: string;
  selectedHallId: string;
  date: string;
  time: string;
  selectedMembers: string[];
  matchType: string;
}

const Content: React.FC<Props> = ({ teamId }) => {
  const user = authUtils.getCurrentUser();
  const [subteamIds, setSubteamIds] = useState<string[]>([]);

  const {
    loading: subteamLoading,
    error: subteamError,
    data: subteamData,
  } = useQuery(GET_SUBTEAMS, {
    variables: { teamId, email: user?.email || "" },
    skip: !user,
  });

  useEffect(() => {
    if (subteamData) {
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

  if (subteamLoading || matchesLoading)
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
  if (subteamError || matchesError) return <Typography>Chyba</Typography>;

  return (
    <Box>
      {matchesData?.getMatchesBySubteam.map((subteam: { subteamId: string; matches: Match[] }) => (
        <Box key={subteam.subteamId}>
          {subteam.matches.map((match: Match) => (
            <Box sx={{}} key={match.matchId}>
              <Typography>Date: {match.date}</Typography>
              <Typography>Time: {match.time}</Typography>
              <Typography>Opponent: {match.opponentName}</Typography>
              <Typography>Members: {match.selectedMembers}</Typography>
              <Typography>Match type: {match.matchType}</Typography>
              <Typography>Hall:</Typography>

              <Box>
                {match.selectedHallId && (
                  <HallInfo teamId={teamId} hallId={match.selectedHallId} />
                )}
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

interface HallInfoProps {
  teamId: string;
  hallId: string;
}

const HallInfo: React.FC<HallInfoProps> = ({ teamId, hallId }) => {
  const { loading, error, data } = useQuery(GET_HALL_BY_TEAM_AND_HALL_ID, {
    variables: { teamId, hallId },
  });

  if (loading) return <CircularProgress color="primary" size={20} />;
  if (error) return <Typography>Error loading hall information</Typography>;

  const hall = data.getHallByTeamAndHallId;
  return (
    <>
      <Typography>Name: {hall.name}</Typography>
      <Typography>Location: {hall.location}</Typography>
    </>
  );
};

export default Content;
