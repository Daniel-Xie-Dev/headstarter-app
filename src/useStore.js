import React, { createContext, useContext, useState } from "react";

// create your global store and init with empty or initial state object
const GlobalContext = createContext({});

// create a provider to share your store accross your entire app
export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const store = {
    user,
    userData,
    setUser,
    setUserData
  };

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
};

// create a consummer to be called in your components and avoid importing both context and useContext everywhere
export const useStore = () => {
  const store = useContext(GlobalContext);
  return store;
};
