import { createContext, useState, useContext } from 'react';
import { UserCheckout } from 'type';

const UserContext = createContext<{
  userCheckout: UserCheckout;
  updateUserCheckout: (data: Partial<UserCheckout>) => void;
}>({
  updateUserCheckout: () => {},
  userCheckout: {} as UserCheckout,
});

export const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    userCheckout: {} as UserCheckout,
  });

  const updateUserCheckout = (data: Partial<UserCheckout>) => {

    setState(prev => ({
      ...prev,
      userCheckout: { ...prev.userCheckout, ...data },
    }));
  };

  return (
    <UserContext.Provider
      value={{
        userCheckout: state.userCheckout,
        updateUserCheckout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
