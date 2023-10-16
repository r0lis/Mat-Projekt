import React, { useState } from 'react';
import { authUtils } from '../firebase/auth.utils';
import { useMutation, gql } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';

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

      // Nejprve provádíme registraci uživatele
      await authUtils.register(email, password);

      // Pokud registrace byla úspěšná, pokračujeme vytvořením uživatele v databázi
      const response = await createUser({
        variables: { Name: name, Surname: surname, Email: email, IdUser: "fefefef", IdTeam: 'fefefe' },
      });

      const newUser = response.data.createUser;

      if (newUser) {
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
      await authUtils.sendEmailVerification(); // Odešleme e-mailové ověření
      router.push('/'); // Pokud je ověření úspěšné, provedeme přesměrování
    } catch (error: any) {
      setError(error.message);

      await authUtils.deleteUser();
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
      {registrationSuccess && (
        <div>
          <p style={{ color: 'green' }}>Registrace úspěšná. Ověřte svůj e-mail, abyste mohli pokračovat.</p>
          <button onClick={handleEmailVerification}>Ověřit E-mail</button>
        </div>
      )}
      {!registrationSuccess && <button onClick={handleRegister}>Registrovat</button>}
      <Box>      <Link href="/LoginPage">Přihlásit</Link>
      </Box>
      <Box>      <Link href="/">Zpět</Link>
      </Box>
    </div>
  );
};

export default RegistrationPage;