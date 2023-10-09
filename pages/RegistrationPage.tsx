import React, { useState } from 'react';
import { authUtils } from '../firebase/auth.utils';
import { useMutation, gql } from '@apollo/client';

// Definujte mutaci GraphQL
const CREATE_USER_MUTATION = gql`
  mutation CreateUser($Email: String!, $IdUser: String!, $IdTeam: String!) {
    createUser(input: { Email: $Email, IdUser: $IdUser, IdTeam: $IdTeam }) {
      IdUser
      IdTeam
      Email
      # Další údaje, které chcete získat
    }
  }
`;



const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Použijte useMutation k definici mutace createUser
  const [createUser] = useMutation(CREATE_USER_MUTATION);

  const handleRegister = async () => {
    try {
      // Registrujte uživatele pomocí authUtils
      await authUtils.register(email, password);

      const response = await createUser({
        variables: { Email: email, IdUser: '123', IdTeam: '456' },
      });
  

      // Získání výsledku z mutace
      const newUser = response.data.createUser;

      // Nyní máte nového uživatele dostupného v newUser

    } catch (error) {
      console.error('Chyba při registraci:', error);
    }
  };

  return (
    <div>
      <h2>Registrace</h2>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrovat</button>
    </div>
  );
};

export default RegistrationPage;
