import React, { useState } from 'react';
import { authUtils } from '../firebase/auth.utils';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await authUtils.login(email, password);
      // Přihlášení bylo úspěšné, můžete provádět další akce, například přesměrování.
    } catch (error) {
      console.error('Chyba při přihlašování:', error);
    }
  };

  return (
    <div>
      <h2>Přihlášení</h2>
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
      <button onClick={handleLogin}>Přihlásit</button>
    </div>
  );
};

export default LoginPage;