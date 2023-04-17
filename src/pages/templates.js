import React, { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import Link from "next/link";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await fetch("/api/templates");
      const templates = await response.json();
      setTemplates(templates);
    };
    fetchTemplates();
  }, []);

  return (
    <PageContainer title="Templates">
      {templates?.map((template) => (
        <div
          className="flex justify-between items-center mb-8"
          key={template.templateTitle}
        >
          <h2 className="text-2xl">
            <Link href={`/template/${template._id}`}>
              {template.templateTitle} - {template.templateTrigger}
            </Link>
          </h2>
        </div>
      ))}
    </PageContainer>
  );
}
