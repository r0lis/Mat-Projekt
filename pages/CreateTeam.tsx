import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation, gql } from '@apollo/client';
import { authUtils } from '../firebase/auth.utils';

const CREATE_TEAM_MUTATION = gql`
  mutation CreateTeam($Name: String!, $AdminEmail: String!, $teamId: String!, $MembersEmails: [String]!) {
    createTeam(input: { Name: $Name, teamId: $teamId AdminEmail: $AdminEmail, MembersEmails: $MembersEmails }) {
      Name
      teamId
      AdminEmail
      MembersEmails
      # Další údaje o týmu, které chcete získat
    }
  }
`;

function CreateTeam() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [membersEmails, setMembersEmails] = useState([]);
  const [error, setError] = useState(null);

  const [createTeam] = useMutation(CREATE_TEAM_MUTATION);

  const currentUserEmail = authUtils.getCurrentUser()?.email || '';

 
  console.log('currentUserEmail', currentUserEmail);
  const handleCreateTeam = async () => {
    try {
      if (!name) {
        throw new Error('Název týmu a e-mail admina jsou povinné.');
      }

      const response = await createTeam({
        variables: { Name: name, AdminEmail: currentUserEmail, teamId: "fefe", MembersEmails: currentUserEmail },
      });

      console.log('Tým byl úspěšně vytvořen', response);

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <div>
      <h2>Vytvořit tým</h2>
      <form>
        <div>
          <label htmlFor="name">Název týmu:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="button" onClick={handleCreateTeam}>
          Vytvořit tým
        </button>
      </form>
    </div>
  );
}

export default CreateTeam;
