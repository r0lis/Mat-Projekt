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
        subteamIdSelected
        date
        time
        selectedMembers
        matchType
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
  subteamIdSelected: string;
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
      {subteamIds.map((subteamId) => {
        const subteamMatches = matchesData?.getMatchesBySubteam
          .filter(
            (subteam: { subteamId: string }) => subteam.subteamId === subteamId
          )
          .map(
            (subteam: { subteamId: string; matches: Match[] }) =>
              subteam.matches
          )
          .flat(); // Získáme pole zápasů pro konkrétní subteam

        return (
          <Box key={subteamId}>
            {subteamMatches.map((match: Match) => (
              <Box sx={{}} key={match.matchId}>
                <Typography>Date: {match.date}</Typography>
                <Typography>Time: {match.time}</Typography>
                <Typography>Opponent: {match.opponentName}</Typography>
                <Typography>Members: {match.selectedMembers}</Typography>
                <Typography>Match type: {match.matchType}</Typography>
                <Typography>Subteam:</Typography>
              <Box>
                {match.subteamIdSelected && (
                  <SubteamDetails subteamId={match.subteamIdSelected} />
                )}
              </Box>
                <Typography>Hall:</Typography>
                <Box>
                  {match.selectedHallId && (
                    <HallInfo teamId={teamId} hallId={match.selectedHallId} />
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

const SubteamDetails: React.FC<{ subteamId: string }> = ({ subteamId }) => {
    const { loading, error, data } = useQuery(GET_SUBTEAM_DETAILS, {
      variables: { subteamId },
    });
  
    if (loading) return <CircularProgress color="primary" size={20} />;
    if (error) return <Typography>Error loading subteam information</Typography>;
  
    const subteamDetails = data.getCompleteSubteamDetail;
    return <Typography>Name: {subteamDetails.Name}</Typography>;
  };

export default Content;
