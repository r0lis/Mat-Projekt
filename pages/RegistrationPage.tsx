import React, { useState } from 'react';
import { authUtils } from '../firebase/auth.utils';
import { useMutation, gql } from '@apollo/client';
import Link from 'next/link'; // Import Link z Next.js

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [createUser] = useMutation(CREATE_USER_MUTATION);

  const handleRegister = async () => {
    try {
      // Ověření, zda email obsahuje '@' a heslo je dostatečně dlouhé (např. minimálně 6 znaků)
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Neplatný e-mail nebo heslo.');
      }

      // Ověření, zda obě hesla jsou stejná
      if (password !== confirmPassword) {
        throw new Error('Hesla se neshodují.');
      }

      await authUtils.register(email, password);

    const user = authUtils.getCurrentUser(); // Získání aktuálního uživatele

    if (user) {
      const userId = user.uid; // Získání UID uživatele z objektu user

      const response = await createUser({
        variables: { Email: email, IdUser: userId, IdTeam: '456' }, // Použití UID uživatele
      });

      const newUser = response.data.createUser;

      // Nastavení upozornění o úspěšné registraci
      setRegistrationSuccess(true);
    } else {
      throw new Error('Uživatel není přihlášen.'); // Pokud uživatel není přihlášen, vyvoláme chybu
    }

    } catch (error: any) {
      setError(error.message); // Nastavení chybové zprávy pro zobrazení na stránce
      setRegistrationSuccess(false); // Pokud došlo k chybě, registrace není úspěšná
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
      <input
        type="password"
        placeholder="Potvrzení hesla"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Zobrazení chyby */}
      {registrationSuccess && <p style={{ color: 'green' }}>Registrace úspěšná. Můžete se přihlásit.</p>} {/* Upozornění o úspěšné registraci */}
      <button onClick={handleRegister}>Registrovat</button>

      <Link href="/LoginPage">Přihlásit</Link> {/* Tlačítko pro přihlášení */}
      <Link href="/">Zpět</Link> {/* Tlačítko pro přihlášení */}

    </div>
  );
};

export default RegistrationPage;
