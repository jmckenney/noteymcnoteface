import React, { useCallback, useState } from "react";
import ReactDom from "react-dom";
import ConsultNote from "./ConsultNote";
import ConsultNoteEditor from "./ConsultNoteEditor";
import { useAnchorContext } from "@/hooks/AnchorProvider";

export default function ConsultNoteDockableContainer({ note, view = "view" }) {
  const { isMounted, anchorRef } = useAnchorContext();
  const [mode, setMode] = useState(view);

  const shouldShowInlineInsteadOfDocking = useCallback(() => {
    return (
      !isMounted ||
      !anchorRef.current ||
      !(anchorRef.current instanceof HTMLElement) ||
      mode !== "edit"
    );
  }, [isMounted, anchorRef, mode]);

  const viewVsEdit = useCallback(() => {
    return mode === "edit" ? (
      <ConsultNoteEditor note={note} anchorRef={anchorRef} />
    ) : (
      <ConsultNote
        note={note}
        anchorRef={anchorRef}
        mode={mode}
        setMode={setMode}
      />
    );
  }, [mode, note, anchorRef]);

  return shouldShowInlineInsteadOfDocking()
    ? viewVsEdit()
    : ReactDom.createPortal(viewVsEdit(), anchorRef.current);
}
