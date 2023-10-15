import React, { useState } from 'react';
import { authUtils } from '../firebase/auth.utils';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import router z Next.js

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter(); // Inicializace routeru

  const handleLogin = async () => {
    try {
      await authUtils.login(email, password);
      // Přihlášení bylo úspěšné.
      setIsLoggedIn(true);
      setError(null); // Vymaže případnou předchozí chybovou zprávu.

      // Přesměrování na stránku /demoUserPage po úspěšném přihlášení
      router.push('/');
    } catch (error) {
      console.error('Chyba při přihlašování:', error);
      setError('Přihlášení selhalo. Zkontrolujte e-mail a heslo.'); // Nastavení chybové zprávy.
      setIsLoggedIn(false);
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
      <Link href="/UserRegistration">Registrovat</Link> {/* Tlačítko pro přihlášení */}

      <Link href="/">Zpět</Link> {/* Tlačítko pro přihlášení */}


      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Zobrazení chyby */}
      {isLoggedIn && <p style={{ color: 'green' }}>Přihlášení úspěšné.</p>} {/* Informace o úspěšném přihlášení */}
    </div>
  );
};

export default LoginPage;