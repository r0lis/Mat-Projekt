import React, { useState } from 'react';
import { authUtils } from '../firebase/auth.utils';

const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await authUtils.register(email, password);
      // Registrace byla úspěšná, můžete přesměrovat uživatele na jinou stránku nebo provést další akce.
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