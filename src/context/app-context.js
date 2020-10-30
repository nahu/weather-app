import React, { useState } from 'react';

export const AppContext = React.createContext({});

const AppProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [date, setDate] = useState(new Date());

  return (
    <AppContext.Provider value={{ location, setLocation, date, setDate }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
