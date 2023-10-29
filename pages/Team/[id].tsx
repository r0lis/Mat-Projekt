import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';
import SideBar from '@/components/teamPage/SideBar';

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

  return (
    <div>
      
      {team && (
        <div>
          <SideBar items={["Přehled", "Tréninky",  "Kalendář", "Soupisky", "Nominace", "Platby", "Události", "Členové","Oprávnění", "Správa"]} />
          
        </div>
      )}
    </div>
  );
}

export default Team;