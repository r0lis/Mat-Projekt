/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { authUtils } from '../../firebase/auth.utils';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { Box, Button, TextField, Typography, Link } from '@mui/material';


const CREATE_USER_TO_TEAM_MUTATION = gql`
  mutation CreateUser($Name: String!, $Surname: String!, $Email: String!, $IdUser: String!, $IdTeam: [String]!) {
    createUser(input: { Name: $Name, Surname: $Surname, Email: $Email, IdUser: $IdUser, IdTeam: $IdTeam }) {
      Name
      Surname
      IdUser
      IdTeam
      Email
      # Další údaje, které chcete získat
    }
  }
`;

const RegistrationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [verificationSuccess, setverificationSuccess] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const [createUser] = useMutation(CREATE_USER_TO_TEAM_MUTATION);

  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length >= 6;

  const handleRegister = async () => {
    try {
      if (!isEmailValid || !isPasswordValid) {
        throw new Error('Neplatný e-mail nebo heslo.');
      }

      if (password !== confirmPassword) {
        throw new Error('Hesla se neshodují.');
      }

      await authUtils.register(email, password);


      const user = authUtils.getCurrentUser();

      if (user) {
        setRegistrationSuccess(true);
      } else {
        throw new Error('Chyba při vytváření uživatele.');
      }
    } catch (error: any) {
      setError(error.message);
      setRegistrationSuccess(false);
    }
  };

  const handleEmailVerification = async () => {
    try {
      await authUtils.sendEmailVerification();
      const user = authUtils.getCurrentUser();
      setverificationSuccess(true);

      if (user) {
        await user.reload();

        if (user.emailVerified) {
          const response = await createUser({
            variables: { Name: name, Surname: surname, Email: email, IdUser: "fefefef", IdTeam: [id as string] },
          });
          setverificationSuccess(true);

          router.push(`/`);
        } else {
          await authUtils.deleteUser();
          throw new Error('E-mailová adresa není ověřena.');
        }
      } else {
        throw new Error('Uživatel nebyl nalezen.');
      }
    } catch (error: any) {
      setError(error.message);
      await authUtils.deleteUser();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ margin: '1rem' }}>Registrace</Typography>

      <Box sx={{ width: '40%', position: 'relative' }}>
        <TextField
          type="text"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          type="text"
          label="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          type="email"
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          type="password"
          label="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          type="password"
          label="Potvrzení hesla"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        {error && <Typography variant="body1" color="error" sx={{ marginTop: '1rem' }}>{error}</Typography>}
        {registrationSuccess && (
          <div>
            <Typography variant="body1" color="success" sx={{ marginTop: '1rem' }}>
              Registrace úspěšná. Ověřte svůj e-mail, abyste mohli pokračovat.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleEmailVerification} sx={{ marginTop: '1rem' }}>
              Ověřit E-mail
            </Button>
          </div>
        )}

        {!registrationSuccess && (
          <Button variant="contained" color="primary" onClick={handleRegister} sx={{ marginTop: '1rem' }}>
            Registrovat
          </Button>
        )}
      </Box>

      <Link href="/LoginPage" sx={{ marginTop: '1rem' }}>Přihlásit</Link>
      <Link href="/UserRegistration" sx={{ marginTop: '1rem' }}>Zkusit znovu</Link>
      <Link href="/" sx={{ marginTop: '1rem' }}>Zpět</Link>
    </Box>
  );
};

export default RegistrationPage;
