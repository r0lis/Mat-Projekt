import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import firebase_app from '../firebase/config';
import { Box, CircularProgress } from '@mui/material';

const auth = getAuth(firebase_app);
type AuthContextType = { user?: User | null; loading?: boolean };
export const AuthContext = React.createContext<AuthContextType>({});

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ?
     <Box
     sx={{
       display: "flex",
       alignItems: "center",
       justifyContent: "center",
       height: "100vh",
     }}
   >
     <CircularProgress color="primary" size={50} />
   </Box>
   : children}
    </AuthContext.Provider>
  );
};
export const useAuthContext = () => useContext(AuthContext);
