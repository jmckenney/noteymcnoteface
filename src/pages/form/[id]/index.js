import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PageContainer from "@/layouts/dashboard/DashboardLayout";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import AddedFormItem from "@/components/forms/AddedFormItem";
import PotentialFormItemDialog from "@/components/PotentialFormItemDialog";
import { PotentialFormItem } from "@/components/forms/PotentialFormItem";
import { potentialFormItems } from "@/components/forms/potentialFormItems";

export default function FormPage() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({});
  const [showInputFormItemDialog, setShowInputFormItemDialog] = useState(false);
  const [potentialFormItemsList, setPotentialFormItemsList] =
    useState(potentialFormItems);
  const [inputFormItemDialogType, setInputFormItemDialogType] =
    useState(undefined);

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

  const handleAdd = (key) => {
    setInputFormItemDialogType(key);
    setShowInputFormItemDialog(true);
  };

  const updateForm = async () => {
    // Todo: allow editing of title, description
    // Todo: allow reordering of form items
    const response = await fetch("/api/forms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: { _ID: id },
        document: { formItems: form.formItems },
      }),
    });

    if (response.ok) {
      console.log("Form saved successfully!");
      // redirect to forms page
      router.push("/forms");
    } else {
      console.error("Failed to save form");
    }
  };

  return (
    <>
      <>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 3, pr: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {form.formTitle}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {form.formDescription}
            </Typography>
            <Stack spacing={2}>
              {form?.formItems?.map((formItem, index) => (
                <AddedFormItem
                  key={formItem.id}
                  id={formItem.id}
                  name={formItem.name}
                  type={formItem.type}
                  index={index}
                  title={formItem.title}
                  formItem={formItem}
                />
              ))}

              <Button onClick={updateForm} variant="outlined" sx={{ mt: 2 }}>
                Edit Form
              </Button>
            </Stack>
          </Box>
          <Divider orientation="vertical" flexItem />

          <Box sx={{ flexGrow: 2, pl: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Potential Form Items
            </Typography>
            <Stack spacing={2} sx={{ textAlign: "left" }}>
              {potentialFormItemsList.map((formItem) => (
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
            </Stack>
          </Box>
        </Box>
      </>

      {showInputFormItemDialog && (
        <PotentialFormItemDialog
          setOpen={setShowInputFormItemDialog}
          saveFormItem={(formItem) => {
            setForm({
              ...form,
              formItems: [...form.formItems, formItem],
            });
          }}
          heading={`Add ${inputFormItemDialogType} Item`}
          type={inputFormItemDialogType}
        ></PotentialFormItemDialog>
      )}
    </>
  );
}
