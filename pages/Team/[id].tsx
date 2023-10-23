import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';
import Navbar from '@/components/teamPage/Navbar';

const GET_TEAM_DETAILS = gql`
query GetTeamDetails($teamId: String!) {
  getTeamDetails(teamId: $teamId) {
    Name
    Members
  }
}
`;

function Team() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: id },
  });

  if (loading) return <p>Načítání...</p>;
  if (error) return <p>Chyba: {error.message}</p>;

  const team = data.getTeamDetails;
  const teamName = team ? team.Name : '';

  return (
    <div>
      <Navbar teamName={teamName} /> 
      <h1>Tým</h1>
      {team && (
        <div>
          <h2>Team Name: {team.Name}</h2>
          <h2>Members: {team.Members.join(', ')}</h2>
        </div>
      )}
    </div>
  );
}

export default Team;