export const notesFunctionDefinitionForLlm = {
  name: "getRecentNotes",
  description:
    "Get recent notes for the purpose of summarizing them for the user. Will default to limit of 5 notes.",
  parameters: {
    type: "object",
    properties: {
      Limit: { type: "number" },
    },
    required: [],
  },
};

export const getRecentNotes = () => {
  return JSON.stringify([
    {
      date: "2021-06-13T00:00:00.000Z",
      title: "Encounter",
      content: "Patient presents with a1c of 7.2.",
    },
    {
      date: "2021-06-13T00:00:00.000Z",
      title: "Encounter",
      content: "Patient has been referred to a therapist to handle stress.",
    },
  ]);
};
