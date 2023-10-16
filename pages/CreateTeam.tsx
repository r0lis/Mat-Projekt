import React from 'react';
import { useRouter } from 'next/router';
import { authUtils } from '../firebase/auth.utils'; 

function CreateTeam() {
  const router = useRouter();
  const user = authUtils.getCurrentUser();

  if (!user) {
    // Uživatel není přihlášen, takže zobrazíme chybovou zprávu a tlačítko pro přesměrování na /LoginPage
    return (
      <div>
        <p>Chyba: Uživatel není přihlášen.</p>
        <button onClick={() => router.push('/LoginPage')}>Přihlásit se</button>
      </div>
    );
  }

  // Pokud je uživatel přihlášen, můžeme zobrazit obsah stránky
  return (
    <div>CreateTeam TODO</div>
  );
}

export default CreateTeam;