import { useAuth0 } from "@auth0/auth0-react";
import { useState, createContext, ReactNode, useContext } from "react";
import { userClient } from '@/api/user/userClient';

const namespace = import.meta.env.VITE_AUTH0_NAMESPACE;
const { createUser, getUser } = userClient;
let userCreated = false;

const UserAuthContext = createContext({
  sisuFlow: () => {},
  isAuthenticated: false,
  name: '',
});

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const [name, setName] = useState<string>('');

  const sisuFlow = async () => {
    setName(user?.given_name ?? '');
    try {
      const tokens = await getIdTokenClaims();
      if (tokens) {
        const loginsCount = tokens[`${namespace}/app_metadata.logins_count`] ?? -1;
        // If user just registered
        if (loginsCount === 0 && user && !userCreated) {
          createUser(
            user.given_name!!,
            user.family_name!!
          ).then(() => {
            userCreated = true;
          });
        } else if (loginsCount > 0 && user) {
          // Set name to value from id token claim while we load from db
          const userData = await getUser();
          if (userData) {
            setName(userData.firstName);
          }
        }
      } else {
        console.error('Could not get user id tokens');
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  const value = {
    sisuFlow,
    isAuthenticated,
    name,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  )
};

export const useUserAuth = () => {
  return useContext(UserAuthContext);
}