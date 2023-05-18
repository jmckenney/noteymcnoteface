import React, { createContext, useContext, useState } from "react";

const MinimizeNoteContext = createContext();

export const useMinimizeNoteContext = () => {
  return useContext(MinimizeNoteContext);
};

export const MinimizeNoteProvider = ({ children }) => {
  const [isNoteMinimized, setIsNoteMinimized] = useState(false);

  return (
    <MinimizeNoteContext.Provider
      value={{
        isNoteMinimized,
        setIsNoteMinimized,
      }}
    >
      {children}
    </MinimizeNoteContext.Provider>
  );
};
