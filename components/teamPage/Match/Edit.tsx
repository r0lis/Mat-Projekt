import { gql, useQuery } from "@apollo/client";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

const GET_MATCH_BY_MATCH_ID = gql`
  query GetMatchByMatchId($matchId: String!) {
    getMatchByMatchId(matchId: $matchId) {
      matchId
      teamId
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
`;

type Props = {
  matchId: string;
  onClose: () => void;
};

const Edit: React.FC<Props> = ({ matchId, onClose }) => {
  const { loading, error, data } = useQuery(GET_MATCH_BY_MATCH_ID, {
    variables: { matchId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log("Match data:", data.getMatchByMatchId);

  return (
    <Box>
      Edit
      <Typography>MatchId: {matchId}</Typography>
      <Button onClick={onClose}>Close</Button>
    </Box>
  );
};

export default Edit;
