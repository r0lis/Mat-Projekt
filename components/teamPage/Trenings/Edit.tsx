import { gql, useQuery } from '@apollo/client';
import { Box, Button, Typography } from '@mui/material'
import React from 'react'

const GET_TRAINING_BY_MATCH_ID = gql`
  query GetTrainingByMatchId($matchId: String!) {
    getTrainingByMatchId(matchId: $matchId) {
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
`;

type Props = {
    matchId: string,
    onClose: () => void
};

const Edit: React.FC<Props> = ({ matchId, onClose }) => {

  const { loading, error, data } = useQuery(GET_TRAINING_BY_MATCH_ID, {
    variables: { matchId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log("Train data:", data.getTrainingByMatchId);

  return (
    <Box>
      Edit
      <Typography>Trenal: {matchId}</Typography>
      <Button onClick={onClose}>Close</Button>
    </Box>
  )
}

export default Edit
