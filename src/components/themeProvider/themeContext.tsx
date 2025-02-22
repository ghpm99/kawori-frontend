import { createContext, useContext } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children, value }) => {
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
