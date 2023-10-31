import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, gql } from '@apollo/client';
import { authUtils } from '../firebase/auth.utils';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stepper from '../components/createTeam/Stepper';

const CREATE_TEAM_MUTATION = gql`
  mutation CreateTeam($Name: String!, $AdminEmail: String!, $teamId: String!, $MembersEmails: [String]!) {
    createTeam(input: { Name: $Name, teamId: $teamId, AdminEmail: $AdminEmail, MembersEmails: $MembersEmails }) {
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
  const [error, setError] = useState(null);

  const [createTeam] = useMutation(CREATE_TEAM_MUTATION);

  const currentUserEmail = authUtils.getCurrentUser()?.email || '';

  const handleCreateTeam = async () => {
    try {
      if (!name || !currentUserEmail) {
        throw new Error('Název týmu a e-mail admina jsou povinné.');
      }

      const response = await createTeam({
        variables: { Name: name, AdminEmail: currentUserEmail, teamId: "fefe", MembersEmails: [currentUserEmail] },
      });

      console.log('Tým byl úspěšně vytvořen', response);

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <><Box sx={{ maxWidth: 400, margin: '0 auto', marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vytvořit tým
      </Typography>
      <form>
        <div>
          <TextField
            id="name"
            label="Název týmu"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal" />
        </div>

        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" onClick={handleCreateTeam} sx={{ marginTop: 2 }}>
          Vytvořit tým
        </Button>
      </form>

    </Box><Box>
        <Stepper />
      </Box></>
    
  );
}

export default CreateTeam;
