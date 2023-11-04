import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Alert, Box, Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import { authUtils } from '@/firebase/auth.utils';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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


const Step1: React.FC = () => {

  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [emails, setEmails] = useState<string[]>([]); // Stav pro uchování e-mailů
  const [emailValue, setEmailValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

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

      router.push('/').then(() => window.location.reload());
    } catch (error: any) {
      setError(error.message);
    }
  }

  const addEmail = () => {
    if (emailValue.trim() !== '') {
      if (editIndex !== null) {
        const updatedEmails = [...emails];
        updatedEmails[editIndex] = emailValue;
        setEmails(updatedEmails);
        setEditIndex(null);
      } else {
        setEmails([...emails, emailValue]);
      }
      setEmailValue('');
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEmailValue(emails[index]);
  };

  const handleDelete = (index: number) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
    setEditIndex(null);
  };

  return (
    <Box sx={{ margin: '0 auto', marginTop: 4, }}>
      <Box sx={{ backgroundColor: 'white', width: '65%', marginLeft: 'auto', marginRight: 'auto', padding:'5%', marginTop:'6em', borderRadius:'10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Typography sx={{textAlign: 'center'}} variant="h4" gutterBottom>
          Vytvořit tým
        </Typography>
      
        <Box sx={{width:'50%', marginLeft:'auto', marginRight:'auto'}}>
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

            <div>
              <TextField
                id="email"
                label="Týmový e-mail"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal" />
            </div>

            <div>
              <TextField
                id="image"
                label="Týmové logo"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Zadejte e-mail"
                variant="outlined"
              />
              <Button variant="contained" onClick={addEmail} style={{ marginLeft: '10px' }}>
                {editIndex !== null ? 'Upravit' : 'Přidat'}
              </Button>
            </div>
            <div>
              <h3>Seznam uživatelů:</h3>
              <List>
                {emails.map((email, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={email} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>

            <div>
              <TextField
                id="name"
                label="Jméno vlastníka týmu"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal" />
            </div>

            <div>
              <TextField
                id="surname"
                label="Příjmení vlastníka týmu"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal" />
            </div>

            <div>
              <TextField
                id="place"
                label="Město týmu"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal" />
            </div>

            {error && <Alert severity="error">{error}</Alert>}
            <Button variant="contained" onClick={handleCreateTeam} sx={{ marginTop: 2 }}>
              Potvrdit
            </Button>
          </form>
        </Box>


      </Box>


    </Box>

  );
};

export default Step1;