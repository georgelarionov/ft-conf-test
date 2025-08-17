import { createContext, useCallback, useContext, useState } from 'react';
import { FTProduct, IUser, Customer, Designer, ICollection } from '../../../utils/dbModels';
import * as endpoints from '../../../utils/endpoints/endpoints';

const AuthContext = createContext<{
  isAuthorized: boolean;
  user: IUser | null;
  menuDrafts: FTProduct[] | null;
  updateMenuDrafts: (d) => void;
  menuCollections: ICollection[] | null;
  updateAuthState: () => void;
  // updateProfile: () => void;
  logout: () => void;
  isLoading?: boolean;
  showLoginModal?: boolean;
  setShowLoginModal: (flag: boolean) => void;
}>({
  isAuthorized: false,
  user: null,
  // collections: {} as Record<string, FTProduct[]>,
  menuDrafts: [] as FTProduct[],
  menuCollections: [] as ICollection[],
  updateMenuDrafts: (d) => {},
  updateAuthState: () => {},
  // updateProfile: () => {},
  logout: () => {},
  isLoading: true,
  setShowLoginModal: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isAuthorized: false,
    user: null as IUser | null,
    // collections: {} as Record<string, FTProduct[]>,
    menuDrafts: null as FTProduct[] | null,
    menuCollections: null as ICollection[] | null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const logout = async () => {
    console.log('AuthProvider - logout');
    if (!state.isAuthorized) {
      return;
    }

    const response = await endpoints.userLogout(state.user); // customerLogout();
    // console.log('Logout response:'+JSON.stringify(response.data));
    const isAuthorized = !(response.status == 200);
    setState(prev => ({
      ...prev,
      isAuthorized,
      user: null,
    }));
  };

  // const updateProfile = async () => {
  //   let user: IUser | null = null;
  //   // let collections = {};
  //   let menuDrafts = [] as FTProduct[];
  //   if (state.isAuthorized) {
  //     const response = await endpoints.getProfile(user);
  //     if (response.status == 200) {
  //       if (response.data.collections) {
  //         let collections = response.data.collections as Record<string, FTProduct[]>;
  //         menuDrafts = collections.drafts;
  //       }
  //     }

  //     setState(prev => ({
  //       ...prev,
  //       isAuthorized: user != null,
  //       user,
  //       menuDrafts
  //     }));
  //   }
  // };

  const updateMenuDrafts = (updated_drafts) => {
    let menuDrafts = [];
    if (state.isAuthorized) {
      menuDrafts = updated_drafts;

      setState(prev => ({
        ...prev,
        menuDrafts,
      }));
    }
  };

  const updateAuthState = useCallback(async () => {
    let user: IUser | null = null;
    // let collections = {};
    let menuDrafts = [] as FTProduct[];
    let menuCollections = [] as ICollection[];

    // if (!state.isAuthorized) {
    //   setIsLoading(true);

    //   const response = await getProfile();
    //   if (response.status == 200) {
    //     user = response.data.customer as ICustomer;
    //     collections = response.data.collections as Record<string, ICollection>;
    //   }

    //   setState(prev => ({
    //     ...prev,
    //     isAuthorized: user != null,
    //     user,
    //     collections,
    //   }));
    //   setIsLoading(false);
    // } else {
    //   setIsLoading(false);
    // }
    setIsLoading(true);
    try {
      if (!state.isAuthorized) {
        const response = await endpoints.getProfile();
        // console.log('Profile Response:'+JSON.stringify(response));
        if(!response) {
          return;
        }
        if (response.status === 200) {
          if(response.data.customer) {
            user = new Customer();
            Object.assign(user, response.data.customer);
            if (response.data.collections) {
              const collections = response.data.collections as Record<string, FTProduct[]>;
              menuDrafts = collections.drafts;
            }
          }
          else if(response.data.designer) {
            user = new Designer();
            Object.assign(user, response.data.designer);
            
            if (response.data.designer_data) {
              const designer_data = response.data.designer_data; // as Record<string, any>;
              menuDrafts = designer_data.latest_drafts as FTProduct[];
              menuCollections = designer_data.latest_collections as ICollection[];
              // console.log('AuthProvider - menuCollections:'+JSON.stringify(menuCollections));
            }
          }
          // user = response.data.customer as ICustomer;
          // let collections = response.data.collections as Record<string, FTProduct[]>;
          // menuDrafts = collections.drafts;
        }

        setState(prev => ({
          ...prev,
          isAuthorized: user != null,
          user,
          menuDrafts,
          menuCollections
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Handle the error (optional: display a message to the user, etc.)
    } finally {
      setIsLoading(false); // Ensure isLoading is set to false no matter what
    }
  }, [state.isAuthorized, setState]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthorized: state.isAuthorized,
        menuDrafts: state.menuDrafts,
        menuCollections: state.menuCollections,
        updateMenuDrafts,
        updateAuthState,
        // updateProfile,
        logout,
        isLoading,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
