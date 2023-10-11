import React, { useState } from 'react';
import { authUtils } from '../firebase/auth.utils';
import { useMutation, gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

const CHECK_EMAIL_EXISTENCE_QUERY = gql`
  query CheckDuplicateEmail($email: String!) {
    checkDuplicateEmail(email: $email)
  }
`;

const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false); // Nový stav pro označení, zda probíhá kontrola e-mailu
  const router = useRouter();

  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const { data: emailCheckData } = useQuery(CHECK_EMAIL_EXISTENCE_QUERY, {
    variables: { email },
    skip: !isCheckingEmail, // Přeskočit dotaz, pokud není aktivní kontrola e-mailu
  });

  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length >= 6;

  const handleRegister = async () => {
    setIsCheckingEmail(true); // Aktivace kontroly e-mailu při kliknutí na tlačítko "Registrovat"

    try {
      if (!isEmailValid || !isPasswordValid) {
        throw new Error('Neplatný e-mail nebo heslo.');
      }

      if (password !== confirmPassword) {
        throw new Error('Hesla se neshodují.');
      }

      if (isEmailDuplicate) {
        throw new Error('E-mail již existuje.');
      }

      await authUtils.register(email, password);

      const user = authUtils.getCurrentUser();
      

      if (user) {
        const userId = user.uid;

        const response = await createUser({
          variables: { Email: email, IdUser: userId, IdTeam: '456' },
        });

        const newUser = response.data.createUser;

        setRegistrationSuccess(true);

        router.push('/CreateTeam');
      } else {
        throw new Error('Uživatel není přihlášen.');
      }
    } catch (error: any) {
      setError(error.message);
      setRegistrationSuccess(false);
    }
  };

  return (
    <div>
      <h2>Registrace</h2>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setIsCheckingEmail(false); // Při změně e-mailu zrušte aktivaci kontroly e-mailu
        }}
      />
      {isCheckingEmail && <p style={{ color: 'gray' }}>Kontroluji e-mail...</p>}
      {isEmailDuplicate && <p style={{ color: 'red' }}>E-mail již existuje.</p>}
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

      <Link href="/LoginPage">Přihlásit</Link>
    </div>
  );
};

export default RegistrationPage;
