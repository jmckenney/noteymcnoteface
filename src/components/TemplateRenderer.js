import React, { useContext, useState, useEffect } from "react";
import ConsultNoteDockableContainer from "./notes/ConsultNoteDockableContainer";
import NoteContext from "@/hooks/TeamContext";

export default function TemplateRenderer({ trigger = ".hcinitial" }) {
  const [template, setTemplate] = useState(null);
  const [noteId, setNoteId] = useState(null);
  const { setNoteBeingEdited } = useContext(NoteContext);

  useEffect(() => {
    const fetchTemplate = async () => {
      // hard coding template id for now for .hcinitial
      const response = await fetch(`/api/templates/644b06bbdcbd9f2e0b11e5f6`);
      const templateJson = await response.json();

      // Get all the subforms for this template and augment the template with them.
      // loop through all templatesItems that have key of custom and fetch their form json
      await Promise.all(
        templateJson.templateItems
          .filter((item) => item.key === "custom")
          .map(async (item) => {
            const response = await fetch(`/api/forms/${item.formDbId}`);
            const form = await response.json();
            // augment the form with the uuid of the template item
            // TODO, make this more explicit. This is only working because filter and map are passing
            // the original items by reference, not by value.
            item.form = form;
            return form;
          })
      );

      // if this is a note and we have the template fully loaded,
      // save that template, including the subform tree, to the note (for current and future editing)
      // TODO add the if condition here or enhance to make this obvious it only happens with editable notes.
      const note = {
        noteType: "CONSULT_ENCOUNTER",
        noteTemplate: templateJson,
        providerUuid: "asldkjfldk-lkdjfjlkd-ldfkd", // mocked, obvi.
        memberUuid: "bsldkjfldk-lkdjfjlkd-ldfkz", // mocked, obvi.
        state: "IN_PROGRESS", // finalized will come later...
        metrics: [],
      };
      const noteResponse = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ document: note }),
      });
      const noteResponseJson = await noteResponse.json();
      setNoteId(noteResponseJson.insertedId);
      setTemplate(templateJson);

      const noteToEdit = {
        _id: noteId,
        created: new Date(),
        state: "IN_PROGRESS",
        noteTemplate: templateJson,
      };

      setNoteBeingEdited(noteToEdit);
    };
    fetchTemplate();
  }, []);

  // return <ConsultNoteDockableContainer note={note} view="edit" />;
}
