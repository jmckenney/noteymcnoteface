import React, { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";

export default function TemplatesPage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await fetch("/api/forms");
      const forms = await response.json();
      console.log("forms", forms);
      setForms(forms);
    };
    fetchTemplates();
  }, []);

  return (
    <PageContainer title="Forms">
      {forms.map((form) => (
        <div
          className="flex justify-between items-center mb-8"
          key={form.formTitle}
        >
          <h2 className="text-2xl">{form.formTitle}</h2>
        </div>
      ))}
    </PageContainer>
  );
}
