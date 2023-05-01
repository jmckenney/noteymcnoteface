import React, { createContext, useContext, useState, useRef } from "react";

const AnchorContext = createContext();

export const useAnchorContext = () => {
  return useContext(AnchorContext);
};

export const AnchorProvider = ({ children }) => {
  const [isDraggableVideoConsultMounted, setIsDraggableVideoConsultMounted] =
    useState(false);
  const draggableVideoConsultAnchorRef = useRef();

  return (
    <AnchorContext.Provider
      value={{
        isDraggableVideoConsultMounted,
        setIsDraggableVideoConsultMounted,
        draggableVideoConsultAnchorRef,
      }}
    >
      {children}
    </AnchorContext.Provider>
  );
};
