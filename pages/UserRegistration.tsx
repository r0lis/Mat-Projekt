import React, { useState } from 'react';
import { authUtils } from '../firebase/auth.utils';
import { useMutation, gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { sendEmailVerification } from '@firebase/auth';
import { auth } from 'firebase-admin';

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($Name: String!, $Surname: String!, $Email: String!, $IdUser: String!, $IdTeam: String!) {
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
  const router = useRouter();

  const [createUser] = useMutation(CREATE_USER_MUTATION);
 

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
  
      const response = await createUser({
        variables: { Name: name, Surname: surname, Email: email, IdUser: "fefefef", IdTeam: 'fefefe' },
      });
  
      const newUser = response.data.createUser;
  
      // Zde přidáme podmínku pro volání authUtils.register pouze pokud bylo vytvoření uživatele úspěšné
      if (newUser) {
        await authUtils.register(email, password);
      } else {
        // V případě neúspěchu vytvoření uživatele můžete vrátit chybovou zprávu nebo provést další obsluhu chyby
        throw new Error('Chyba při vytváření uživatele.');
      }
  
      const user = authUtils.getCurrentUser();

      if (user) {
        await sendEmailVerification(user);
      } else {
        throw new Error('Uživatel nebyl přihlášen.');
      }
  
      setRegistrationSuccess(true);
  
      router.push('/');
    } catch (error: any) {
      setError(error.message);
      setRegistrationSuccess(false);
    }
  };

  return (
    <div>
      <h2>Registrace</h2>

      <input
        type="nane"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="surname"
        placeholder="Surname"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      />

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Potvrzení hesla"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {registrationSuccess && <p style={{ color: 'green' }}>Registrace úspěšná. Můžete se přihlásit.</p>}
      <button onClick={handleRegister}>Registrovat</button>
      <Box>      <Link href="/LoginPage">Přihlásit</Link>
      </Box>
      <Box>      <Link href="/">Zpět</Link>
      </Box>
    </div>
  );
};

export default RegistrationPage;
