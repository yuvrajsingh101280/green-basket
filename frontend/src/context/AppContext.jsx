import { createContext, useState } from "react";
import React from "react";
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("Dark");
  const value = { theme, setTheme };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
