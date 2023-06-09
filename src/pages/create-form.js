import CreateForm from "../components/forms/CreateForm";

import React from "react";

import { useRouter } from "next/router";

export default function CreateFormPage() {
  const router = useRouter();
  const handleSavedForm = (id) => {
    console.log("saved form id", id);
    router.push(`/forms`);
  };
  return (
    <>
      <CreateForm handleSavedForm={handleSavedForm} />
    </>
  );
}
