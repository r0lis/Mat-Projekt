import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { authUtils } from "@/firebase/auth.utils";
import axios from 'axios';


type HeartbeatContextType = {
  isConnected: boolean;
}

const HeartbeatContext = createContext<HeartbeatContextType | undefined>(undefined);

export const useHeartbeat = (): HeartbeatContextType => {
  const context = useContext(HeartbeatContext);
  if (!context) {
    throw new Error('useHeartbeat must be used within a HeartbeatProvider');
  }
  return context;
};

interface HeartbeatProviderProps {
  children: ReactNode;
}

export const HeartbeatProvider = ({ children }: HeartbeatProviderProps): JSX.Element => {
  const [isConnected, setIsConnected] = useState(true);
  const apolloClient = useApolloClient();

  const heartbeat = async () => {
    try {
      axios.post("/api/teamService");
      const response = await apolloClient.query({
        query: gql`
          query {
            heartbeat
          }
        `,
      });

      // Můžete aktualizovat isConnected na základě odpovědi
      setIsConnected(response.data.heartbeat);

    } catch (error) {
      setIsConnected(false);
    }
  };
  const user = authUtils.getCurrentUser();
  
  useEffect(() => {
    const user = authUtils.getCurrentUser();
     


    // Check if the user is not null before starting the heartbeat
    if (user) {
      // Spustí heartbeat každých 5 sekund (5000 milisekund)
      const interval = setInterval(heartbeat, 5000);
  
      const handleBeforeUnload = () => {
        // Tento kód se spustí, když uživatel opouští stránku
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      // Zastaví heartbeat při odmontování komponentu
      return () => {
        clearInterval(interval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
  
        
      };
    } else {
      // If user is null, log a message indicating that the heartbeat is not started
    }
  }, [user, apolloClient]);

  return (
    <HeartbeatContext.Provider value={{ isConnected }}>
      {children}
    </HeartbeatContext.Provider>
  );
};
