import React, { createContext, useContext, useState, useRef } from "react";

const AnchorContext = createContext();

export const useAnchorContext = () => {
  return useContext(AnchorContext);
};

export const AnchorProvider = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const anchorRef = useRef();

  return (
    <AnchorContext.Provider value={{ isMounted, setIsMounted, anchorRef }}>
      {children}
    </AnchorContext.Provider>
  );
};
