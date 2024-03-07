import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {  useApolloClient } from '@apollo/client';
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
  const [userChecked, setUserChecked] = useState(false);
  const apolloClient = useApolloClient();

  const heartbeat = async () => {
    try {
      console.log('Heartbeat request sent');
      axios.post("/api/teamService");

    } catch (error) {
      setIsConnected(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const user = authUtils.getCurrentUser();
      if (user && !userChecked) { 
        heartbeat(); 
        setUserChecked(true); 
      }
  
      if (user && userChecked) { 
        return; 
      }
    }, 1000); // Spuštění heartbeatu až za 1 sekundu

    return () => clearTimeout(timer);
  }, [userChecked, apolloClient]);
  return (
    <HeartbeatContext.Provider value={{ isConnected }}>
      {children}
    </HeartbeatContext.Provider>
  );
};


