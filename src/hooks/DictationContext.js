import React, { createContext, useState, useContext } from "react";

const DictationContext = createContext(null);

export const useDictationContext = () => {
  return useContext(DictationContext);
};

export const DictationProvider = ({ children }) => {
  const [activeDictationId, setActiveDictationId] = useState(null);

  return (
    <DictationContext.Provider
      value={{ activeDictationId, setActiveDictationId }}
    >
      {children}
    </DictationContext.Provider>
  );
};
