import { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";

const PotentialTemplateItem = ({ id, name, key }) => {
  return (
    <Button variant="outlined" startIcon={<ArrowBackIos />}>
      {name}
    </Button>
  );
};

export default function TemplateCreationPage() {
  const [potentialTemplateItems, setPotentialTemplateItems] = useState([
    { id: 1, name: "Session Number", key: "sessionNumber" },
    { id: 2, name: "Referral", key: "referral" },
    { id: 3, name: "Prescription", key: "prescription" },
    { id: 4, name: "Metric Point (Weight)", key: "metricPointWeight" },
    { id: 5, name: "Custom Form", key: "custom" },
  ]);

  const [addedTemplateItems, setAddedTemplateItems] = useState([]);
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateTrigger, setTemplateTrigger] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const [forms, setForms] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await fetch("/api/forms");
      const forms = await response.json();
      setForms(forms);
    };
    fetchTemplates();
  }, []);

  const AddedTemplateItems = ({ id, name, index, uuid, formDbId = "" }) => {
    // TODO enhance this to not be dumb:)
    const formChooserOptions = id === 5 ? forms : null;
    return (
      <Box sx={{ p: 1, m: 1, borderRadius: 1 }}>
        <Typography>{name}</Typography>
        {formChooserOptions && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Custom Form To Use</InputLabel>
            <Select
              name={uuid}
              onChange={(e) => {
                handleFormSelection(uuid, e.target.value);
              }}
              label="Custom Form To Use"
              value={formDbId}
            >
              {forms.map((form) => (
                <MenuItem key={form._id} value={form._id}>
                  {form.formTitle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    );
  };

  const handleAddTemplateItem = (id) => {
    const templateItemToAdd = potentialTemplateItems.find(
      (component) => component.id === id
    );
    const deepCopy = JSON.parse(JSON.stringify(templateItemToAdd));
    deepCopy.uuid = uuidv4();
    setAddedTemplateItems((prevComponents) => [...prevComponents, deepCopy]);
    // remove from potentialTemplateItems if not a custom form
    if (id !== 5) {
      setPotentialTemplateItems((prevComponents) => {
        return prevComponents.filter((component) => component.id !== id);
      });
    }
  };

  const handleFormSelection = (addedTemplateItemUuid, formDbId) => {
    // find the addedTemplateItem
    const templateItemToAugment = addedTemplateItems.find((item) => {
      return item.uuid === addedTemplateItemUuid;
    });
    // augment that item with the id from the db to use for the custom form
    templateItemToAugment.formDbId = formDbId;
    // get a list of all the other addedTemplateItems
    const otherAddedTemplateItems = addedTemplateItems.filter((item) => {
      return item.uuid !== addedTemplateItemUuid;
    });
    setAddedTemplateItems((prevComponents) => [
      ...otherAddedTemplateItems,
      templateItemToAugment,
    ]);
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
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ document: template }),
    });

    if (response.ok) {
      console.log("Template saved successfully!");
      // redirect to templates page
      router.push("/templates");
    } else {
      console.error("Failed to save template");
    }
  };

  return (
    <PageContainer title="Create Template">
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" component="h2" gutterBottom>
            Template Details
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Template Title"
              id="templateTitle"
              variant="outlined"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Template Trigger"
              id="templateTrigger"
              variant="outlined"
              value={templateTrigger}
              onChange={(e) => setTemplateTrigger(e.target.value)}
            />
          </Box>
          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Template Description"
              id="templateDescription"
              variant="outlined"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
            />
          </Box>
          <Typography variant="h6" component="h2" gutterBottom>
            Added Template Items
          </Typography>
          <Box sx={{ mt: 2 }}>
            {addedTemplateItems.map((templateItem, index) => (
              <AddedTemplateItems
                key={templateItem.uuid}
                uuid={templateItem.uuid}
                id={templateItem.id}
                name={templateItem.name}
                index={index}
                formDbId={templateItem.formDbId || ""}
              />
            ))}
          </Box>
          <Button
            onClick={saveTemplate}
            variant="outlined"
            sx={{ mt: 2 }}
            disabled={addedTemplateItems.length === 0}
          >
            Save Template
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography variant="h6" component="h2" gutterBottom>
            Potential Template Items
          </Typography>
          <Stack spacing={2} sx={{ textAlign: "left" }}>
            {potentialTemplateItems.map((templateItem) => (
              <div
                key={`div${templateItem.id}`}
                onClick={() => handleAddTemplateItem(templateItem.id)}
              >
                <PotentialTemplateItem
                  key={templateItem.id}
                  id={templateItem.id}
                  name={templateItem.name}
                />
              </div>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
