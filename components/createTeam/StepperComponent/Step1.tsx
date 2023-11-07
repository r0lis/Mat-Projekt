import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Alert, Box, Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import { authUtils } from '@/firebase/auth.utils';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';


const CREATE_TEAM_MUTATION = gql`
  mutation CreateTeam($Name: String!, $AdminEmail: String!, $teamId: String!, $MembersEmails: [String]!, $Email: String!, $Logo: String!, $OwnerName: String!, $OwnerSurname: String!, $Place: String! ) {
    createTeam(input: { Name: $Name, teamId: $teamId, AdminEmail: $AdminEmail, MembersEmails: $MembersEmails, Email: $Email, Logo: $Logo, OwnerName: $OwnerName, OwnerSurname: $OwnerSurname, Place: $Place }) {
      Name
      teamId
      AdminEmail
      MembersEmails
      Email
      Logo
      OwnerName
      OwnerSurname
      Place
    }
  }
`;

interface Step1Props {
  onCompleteTeamCreation: (teamEmail: string) => void;
}


const Step1: React.FC<Step1Props> = ({ onCompleteTeamCreation }) => {

  const router = useRouter();
  const [name, setName] = useState('');
  const [emailTeam, setEmail] = useState('');
  const [img, setImg] = useState('');
  const [nameOwner, setNameOwner] = useState('');
  const [surnameOwner, setSurnameOwner] = useState('');
  const [place, setPlace] = useState('');
  const [error, setError] = useState(null);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailValue, setEmailValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [error3, setError3] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState(false);

  const [createTeam] = useMutation(CREATE_TEAM_MUTATION);

  const currentUserEmail = authUtils.getCurrentUser()?.email || '';


  const handleCreateTeam = async () => {
    try {
      if (!name || !currentUserEmail) {
        throw new Error('Název týmu a e-mail admina jsou povinné.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTeam)) {
        throw new Error('Prosím, zadejte platný e-mail pro tým.');
      }

      if (!/^[A-Z].{1,}$/u.test(name)) {
        throw new Error('Název týmu musí začínat velkým písmenem a být delší než 1 znak.');
      }

      if (emails.length < 2) {
        throw new Error('Tým musí mít alespoň 2 uživatele.');

      }

      if (!/^[A-Z].{1,}$/u.test(place)) {
        throw new Error('Město týmu musí začínat velkým písmenem a být delší než 1 znak.');
      }
  
      // Ověření jména a příjmení vlastníka týmu
      if (!/^[A-Z].{2,}$/u.test(nameOwner) || !/^[A-Z].{2,}$/u.test(surnameOwner)) {
        throw new Error('Jméno a příjmení vlastníka týmu musí začínat velkým písmenem a být delší než 2 znaky.');
      }

      const allMembers = [currentUserEmail, ...emails];

      const response = await createTeam({
        variables: { Name: name, AdminEmail: currentUserEmail, teamId: "fefe", MembersEmails: allMembers, Email: emailTeam, Logo: img, OwnerName: nameOwner, OwnerSurname: surnameOwner, Place: place },
      });

      console.log('Tým byl úspěšně vytvořen', response);

      //router.push('/').then(() => window.location.reload());
      onCompleteTeamCreation(emailTeam);
      console.log(emailTeam);
      setIsCreated(true);
      
    } catch (error: any) {
      setError(error.message);
    }
  }

  const addEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue.trim() !== '' && emailRegex.test(emailValue)) {
      if (editIndex !== null) {
        const updatedEmails = [...emails];
        updatedEmails[editIndex] = emailValue;
        setEmails(updatedEmails);
        setEditIndex(null);
      } else {
        setEmails([...emails, emailValue]);
      }
      setEmailValue('');
      setError2(null); // Clear the error state if input is valid
    } else {
      setError2('Please enter a valid email.'); // Set the error message for an invalid email
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
      <Box sx={{ backgroundColor: 'white', width: '60%', marginLeft: 'auto', marginRight: 'auto', padding: '5%', marginTop: '6em', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Typography sx={{ textAlign: 'center' }} variant="h4" gutterBottom>
          Vytvoření týmu:
        </Typography>

        <Box sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
        {isCreated ? (
            <Alert severity="success">
              Tým byl úspěšně vytvořen!
            </Alert>
          ) : (
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
                value={emailTeam}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                error={error3 !== null}
                helperText={error3}
              />
            </div>

            <div>
              <TextField
                id="image"
                label="Týmové logo"
                variant="outlined"
                value={img}
                onChange={(e) => setImg(e.target.value)}
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
            <div style={{ marginBottom: '10px' }}>
              {error2 && <Alert severity="error">{error2}</Alert>}
            </div>


            <div>
              <h3>Seznam uživatelů které jste přidali:</h3>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    {emails.map((email, index) => (
                      <TableRow key={index}>
                        <TableCell >{email}</TableCell>
                        <TableCell>
                          <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(index)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div>
              <TextField
                id="name"
                label="Jméno vlastníka týmu"
                variant="outlined"
                value={nameOwner}
                onChange={(e) => setNameOwner(e.target.value)}
                fullWidth
                margin="normal" />
            </div>

            <div>
              <TextField
                id="surname"
                label="Příjmení vlastníka týmu"
                variant="outlined"
                value={surnameOwner}
                onChange={(e) => setSurnameOwner(e.target.value)}
                fullWidth
                margin="normal" />
            </div>

            <div>
              <TextField
                id="place"
                label="Město týmu"
                variant="outlined"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                fullWidth
                margin="normal" />
            </div>

            {error && <Alert severity="error">{error}</Alert>}
            <Button variant="contained" onClick={handleCreateTeam} sx={{ marginTop: 2 }}>
              Potvrdit
            </Button>
          </form>
          )}
        
        </Box>


      </Box>


    </Box>

  );
};

export default Step1;

function useEffect(arg0: () => void, arg1: (boolean | (() => void))[]) {
  throw new Error('Function not implemented.');
}
