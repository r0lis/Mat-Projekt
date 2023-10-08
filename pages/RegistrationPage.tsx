import React, { useState } from 'react';
import { authUtils } from '../firebase/auth.utils';
import { useMutation, gql } from '@apollo/client';

const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    registerUser(input: $input) {
      id
      email
      # Další údaje o uživateli
    }
  }
`;

const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerUser] = useMutation(REGISTER_USER);

  const handleRegister = async () => {
    try {
      await authUtils.register(email, password);
      const { data } = await registerUser({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      console.log('Registrace proběhla úspěšně:', data.registerUser);
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