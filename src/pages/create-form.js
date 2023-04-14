import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import PotentialFormItemDialog from "@/components/PotentialFormItemDialog";

const PotentialFormItem = ({ id, name }) => {
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

const AddedFormItem = ({ id, name, type, title }) => {
  console.log("AddedFormItem", id, name, type, title);
  // Todo: might need to sanitize the names when using for id, placeholder, etc.
  switch (type) {
    case "input":
      return (
        <div key={id} className={`p-2 m-1 rounded`}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm  mb-2" htmlFor={name}>
              {name}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={name}
              type="text"
              placeholder={name}
              onChange={(e) => {
                e.preventDefault();
                setTemplateTitle(e.target.value);
              }}
            />
          </div>
        </div>
      );
    case "textarea":
      return (
        <div key={id} className={`p-2 m-1 rounded`}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm  mb-2" htmlFor={name}>
              {name}
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={name}
              type="text"
              placeholder={name}
              onChange={(e) => {
                e.preventDefault();
                setTemplateTitle(e.target.value);
              }}
            />
          </div>
        </div>
      );
    case "title":
      return (
        <div key={id} className={`p-2 m-1 rounded`}>
          {/* tailwind h2 */}
          <h2 className="text-xl  mb-4">{title}</h2>
        </div>
      );

    default:
      break;
  }
};

export default function TemplateCreationPage() {
  const [addedFormItems, setAddedFormItems] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [showInputFormItemDialog, setShowInputFormItemDialog] = useState(false);
  const [inputFormItemDialogType, setInputFormItemDialogType] =
    useState(undefined);

  const [potentialFormItems, setPotentialFormItems] = useState([
    // ToDo, these may come from the server at some point, allowed items
    { name: "Input", key: "input" },
    { name: "TextArea", key: "textarea" },
    { name: "Title", key: "title" },
  ]);

  const handleAdd = (key) => {
    setInputFormItemDialogType(key);
    setShowInputFormItemDialog(true);
  };

  const saveForm = async () => {
    if (addedFormItems.length === 0) return;
    const form = {
      formTitle,
      formDescription,
      formItems: addedFormItems,
    };
    console.log("save form", form);
    const response = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ document: form }),
    });

    if (response.ok) {
      console.log("Form saved successfully!");
      // redirect to templates page
    } else {
      console.error("Failed to save form");
    }
  };
  return (
    <>
      <PageContainer title="Create form">
        <div className="flex">
          <div className="w-3/5 p-4">
            <h2 className="text-xl  mb-4">Form Details</h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm  mb-2"
                htmlFor="formTitle"
              >
                Form Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="formTitle"
                type="text"
                placeholder="Form Title"
                onChange={(e) => {
                  e.preventDefault();
                  setFormTitle(e.target.value);
                }}
                value={formTitle}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm  mb-2"
                htmlFor="formDescription"
              >
                Form Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="formDescription"
                type="text"
                placeholder="Form Description"
                onChange={(e) => {
                  e.preventDefault();
                  setFormDescription(e.target.value);
                }}
                value={formDescription}
              />
            </div>

            <h2 className="text-xl  mb-4">Added Form Items</h2>
            <div className="mt-4">
              {addedFormItems.map((formItem, index) => (
                <AddedFormItem
                  key={formItem.id}
                  id={formItem.id}
                  name={formItem.name}
                  type={formItem.type}
                  index={index}
                  title={formItem.title}
                />
              ))}
            </div>
            <button
              onClick={saveForm}
              className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 mt-4 rounded"
              disabled={addedFormItems.length === 0}
            >
              Save Template
            </button>
          </div>
          <div className="w-2/5 p-4">
            <h2 className="text-xl  mb-4">Potential Form Items</h2>
            {potentialFormItems.map((formItem) => (
              <div
                key={`div${formItem.id}`}
                onClick={() => handleAdd(formItem.key)}
              >
                <PotentialFormItem
                  key={formItem.id}
                  id={formItem.id}
                  name={formItem.name}
                />
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
      {showInputFormItemDialog && (
        <PotentialFormItemDialog
          setOpen={setShowInputFormItemDialog}
          saveFormItem={(formItem) => {
            setAddedFormItems([...addedFormItems, formItem]);
          }}
          heading={`Add ${inputFormItemDialogType} Item`}
          type={inputFormItemDialogType}
        ></PotentialFormItemDialog>
      )}
    </>
  );
}
