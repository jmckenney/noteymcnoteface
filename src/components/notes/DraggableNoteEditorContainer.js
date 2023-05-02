import React from "react";
import Draggable from "react-draggable";

export default function DraggableNoteEditorContainer({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 999,
      }}
    >
      <Draggable>
        <div
          style={{
            pointerEvents: "all",
            cursor: "move",
            width: "500px",
            overflow: "auto",
            padding: "20px",
          }}
        >
          {children}
        </div>
      </Draggable>
    </div>
  );
}
