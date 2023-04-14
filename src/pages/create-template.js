import { useState } from "react";
import PageContainer from "../components/PageContainer";

const PotentialTemplateItem = ({ id, name }) => {
  return (
    <div className="p-2 m-1 border border-gray-300 rounded cursor-pointer flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
        />
      </svg>
      {name}
    </div>
  );
};

const AddedTemplateItems = ({ id, name, index }) => {
  return (
    <div key={id} className={`p-2 m-1 rounded`}>
      {name}
    </div>
  );
};

export default function TemplateCreationPage() {
  const [potentialTemplateItems, setPotentialTemplateItems] = useState([
    { id: 1, name: "Session Number", key: "sessionNumber" },
    { id: 2, name: "Referral", key: "referral" },
    { id: 3, name: "Prescription", key: "prescription" },
    { id: 4, name: "Metric Point (Weight)", key: "metricPointWeight" },
    { id: 5, name: "Custom template (TODO)", key: "custom" },
  ]);

  const [addedTemplateItems, setAddedTemplateItems] = useState([]);
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateTrigger, setTemplateTrigger] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const handleAdd = (id) => {
    setAddedTemplateItems((prevComponents) => [
      ...prevComponents,
      potentialTemplateItems.find((component) => component.id === id),
    ]);
    setPotentialTemplateItems((prevComponents) => {
      return prevComponents.filter((component) => component.id !== id);
    });
  };

  const saveTemplate = async () => {
    // only save if there are items in the addedTemplateItems array
    if (addedTemplateItems.length === 0) return;
    const template = {
      templateTitle,
      templateTrigger,
      templateDescription,
      templateItems: addedTemplateItems,
    };
    console.log("save template", template);
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ document: template }),
    });

    if (response.ok) {
      console.log("Template saved successfully!");
      // redirect to templates page
    } else {
      console.error("Failed to save template");
    }
  };

  return (
    <PageContainer title="Create Template">
      <div className="flex">
        <div className="w-3/5 p-4">
          <h2 className="text-xl  mb-4">Template Details</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm  mb-2"
              htmlFor="templateTitle"
            >
              Template Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="templateTitle"
              type="text"
              placeholder="Template Title"
              onChange={(e) => {
                e.preventDefault();
                setTemplateTitle(e.target.value);
              }}
              value={templateTitle}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm  mb-2"
              htmlFor="templateTrigger"
            >
              Template Trigger
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="templateTrigger"
              type="text"
              placeholder="Template Trigger"
              onChange={(e) => {
                e.preventDefault();
                setTemplateTrigger(e.target.value);
              }}
              value={templateTrigger}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm  mb-2"
              htmlFor="templateDescription"
            >
              Template Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="templateDescription"
              type="text"
              placeholder="Template Description"
              onChange={(e) => {
                e.preventDefault();
                setTemplateDescription(e.target.value);
              }}
              value={templateDescription}
            />
          </div>

          <h2 className="text-xl  mb-4">Added Template Items</h2>
          <div className="mt-4">
            {addedTemplateItems.map((templateItem, index) => (
              <AddedTemplateItems
                key={templateItem.id}
                id={templateItem.id}
                name={templateItem.name}
                index={index}
              />
            ))}
          </div>
          <button
            onClick={saveTemplate}
            className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 mt-4 rounded"
            disabled={addedTemplateItems.length === 0}
          >
            Save Template
          </button>
        </div>
        <div className="w-2/5 p-4">
          <h2 className="text-xl  mb-4">Potential Template Items</h2>
          {potentialTemplateItems.map((templateItem) => (
            <div
              key={`div${templateItem.id}`}
              onClick={() => handleAdd(templateItem.id)}
            >
              <PotentialTemplateItem
                key={templateItem.id}
                id={templateItem.id}
                name={templateItem.name}
              />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
