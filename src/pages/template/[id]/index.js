import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PageContainer from "../../../components/PageContainer";

export default function TemplatePage() {
  const router = useRouter();
  const { id } = router.query;
  const [template, setTemplate] = useState({});
  useEffect(() => {
    const fetchTemplate = async () => {
      const response = await fetch(`/api/templates/${id}`);
      const template = await response.json();
      console.log("template", template);
      setTemplate(template);
    };
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  return (
    <PageContainer title="Template">
      <h1>Template: {id}</h1>
      <p>{template?.templateTitle}</p>
      <p>{template?.templateDescription}</p>
      <p>{template?.templateTrigger}</p>
      <h2>Template Items</h2>
      {/* tailwind unordered list */}
      {template?.templateItems?.map((item) => (
        <>
          <ul className="list-disc list-inside" key={item.key}>
            {/* <li>{item.id}</li>
            <li>{item.key}</li> */}
            <li>{item.name}</li>
          </ul>
          <hr />
        </>
      ))}
    </PageContainer>
  );
}
