import { useState } from 'react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Zde můžete implementovat logiku pro přihlášení
  };

  return (
    <div>
      <h1>Přihlášení</h1>
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Heslo:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleLogin}>
          Přihlásit se
        </button>
      </form>
    </div>
  );
};

export default AuthPage;