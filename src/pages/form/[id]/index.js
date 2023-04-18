import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PageContainer from "../../../components/PageContainer";

export default function FormPage() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({});
  useEffect(() => {
    const fetchTemplate = async () => {
      const response = await fetch(`/api/forms/${id}`);
      const form = await response.json();
      console.log("form", form);
      setForm(form);
    };
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  return (
    <PageContainer title="Form">
      <h1>Form: {id}</h1>
      {form?.formItems?.map((item) => (
        <>
          <ul className="list-disc list-inside" key={item.id}>
            {/* <li>{item.id}</li> */}
            <li>{item.name}</li>
            <li>{item?.title}</li>
          </ul>
          <hr />
        </>
      ))}
    </PageContainer>
  );
}
