import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gql, useApolloClient } from '@apollo/client';

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
      const response = await apolloClient.query({
        query: gql`
          query {
            heartbeat
          }
        `,
      });

      // Můžete aktualizovat isConnected na základě odpovědi
      setIsConnected(response.data.heartbeat);
      console.info('User is in the application and actively communicating with the server.');
      console.log('User is in the application and actively communicating with the server.');

    } catch (error) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Spustí heartbeat každých 5 sekund (5000 milisekund)
    const interval = setInterval(heartbeat, 5000);
    

    const handleBeforeUnload = () => {
      // Tento kód se spustí, když uživatel opouští stránku
      console.log('Uživatel opouští aplikaci.');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);


    // Zastaví heartbeat při odmontování komponentu
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Tato část kódu se spustí při odmontování komponenty
      console.log('Uživatel opustil aplikaci.');
      console.info('Uživatel opustil aplikaci.');

    };
  }, [apolloClient]);

  return (
    <HeartbeatContext.Provider value={{ isConnected }}>
      {children}
    </HeartbeatContext.Provider>
  );
};
