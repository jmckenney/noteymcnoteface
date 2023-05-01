import React, { useCallback } from "react";
import ReactDom from "react-dom";
import ConsultNoteEditor from "./ConsultNoteEditor";
import { useAnchorContext } from "@/hooks/AnchorProvider";

export default function ConsultNoteDockableContainer({ note }) {
  const { isDraggableVideoConsultMounted, draggableVideoConsultAnchorRef } =
    useAnchorContext();

  const shouldDockToVideoEditor = useCallback(() => {
    return (
      isDraggableVideoConsultMounted &&
      draggableVideoConsultAnchorRef.current &&
      draggableVideoConsultAnchorRef.current instanceof HTMLElement
    );
  }, [isDraggableVideoConsultMounted, draggableVideoConsultAnchorRef]);

  return shouldDockToVideoEditor() ? (
    ReactDom.createPortal(
      <ConsultNoteEditor
        note={note}
        draggableVideoConsultAnchorRef={draggableVideoConsultAnchorRef}
      />,
      draggableVideoConsultAnchorRef.current
    )
  ) : (
    <ConsultNoteEditor note={note} />
  );
}
