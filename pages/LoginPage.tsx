/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react';
import { authUtils } from '../firebase/auth.utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, TextField, Typography } from '@mui/material';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      await authUtils.login(email, password);

      setIsLoggedIn(true);
      setError(null);


      router.push('/');
    } catch (error) {
      console.error('Chyba při přihlašování:', error);
      setError('Přihlášení selhalo. Zkontrolujte e-mail a heslo.');
      setIsLoggedIn(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '40%',
        margin: '0 auto',
      }}
    >
      <Typography variant="h4">Přihlášení</Typography>

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
        onSubmit={handleLogin}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        
      />
      <Button variant="contained" color="primary" onClick={handleLogin} sx={{ marginTop: '1rem' }}>
        Přihlásit
      </Button>
      <Box sx={{ marginTop: '1rem' }}>
        <Link href="/UserRegistration">
          Registrovat
        </Link>
      </Box>
      <Box sx={{ marginTop: '1rem' }}>
        <Link href="/">
          Zpět
        </Link>
      </Box>


      {error && (
        <Typography variant="body1" color="error" sx={{ marginTop: '1rem' }}>
          {error}
        </Typography>
      )}
      {isLoggedIn && (
        <Typography variant="body1" color="success" sx={{ marginTop: '1rem' }}>
          Přihlášení úspěšné.
        </Typography>
      )}
    </Box>
  );
};

export default LoginPage;
