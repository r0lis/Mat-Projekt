import React, { useContext } from 'react';
import { useAuthContext } from '../components/AuthContextProvider';
import { authUtils } from '../firebase/auth.utils'; 

const WelcomePage: React.FC = () => {
    const { user } = useAuthContext();
  
    const handleLogout = async () => {
      try {
        await authUtils.logout(); // Zavolání metody pro odhlášení
      } catch (error) {
        console.error('Chyba při odhlášení:', error);
      }
    };
  
    return (
      <div>
        <h2>Vítejte</h2>
        {user ? (
          <>
            <p>Přihlášený uživatel: {user.email}</p>
            <button onClick={handleLogout}>Odhlásit</button>
          </>
        ) : (
          <p>Nikdo není přihlášený.</p>
        )}
      </div>
    );
  };
  
  export default WelcomePage;