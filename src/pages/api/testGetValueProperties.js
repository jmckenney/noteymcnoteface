/**
 * Process the template to get values to send to openai
 * completion api.
 *
 * @param {*} obj
 * @returns string[]
 */
const getValueProperties = (obj) => {
  if (!obj || typeof obj !== "object") {
    return [];
  }

  if (obj.hasOwnProperty("value") && typeof obj.value === "string") {
    return [obj.value];
  }

  return Object.values(obj).flatMap(getValueProperties);
};

const testTemplate = {
  _id: "644b06bbdcbd9f2e0b11e5f6",
  templateTitle: "Health Coach Initial Consult",
  templateTrigger: ".hcinitial",
  templateDescription: "",
  templateItems: [
    {
      id: 5,
      name: "Custom Form",
      key: "custom",
      uuid: "1fd6c93d-20f0-4a64-ac7f-db1034a12b78",
      formDbId: "644c33dadcbd9f2e0b11e5fc",
      form: {
        _id: "644c33dadcbd9f2e0b11e5fc",
        formTitle: "Wellness Plan",
        formDescription: "",
        formItems: [
          {
            id: "18691d5e-9569-4fc7-8f03-a5cc7890c509",
            name: "Weekly Plan",
            type: "textarea",
            value:
              "1. I will limit eating fast food to once a week and cook the rest of our meals at home.\n     * I will ensure our pantry and fridge are stocked with healthy options by grocery shopping regularly. \n     * I will stay mindful throughout the day of what time it is, when I have last eaten, and if I need to choose water or coffee instead of an emotional snack. \n\n2. I will achieve 10,000 steps per day, over 50% of the month.\n     * I will walk in the mornings around 7am, in the evenings, and/or after lunch. \n     * I will be more intentional about getting up more frequently throughout the day (refilling my water bottle, etc) to get more steps in.\n\n3. I will stay mindful of a casual approach to my wellness, remembering that I am in a different phase of my life than when I was in high school, and things can be flexible as needed to be sustainable.\n\n4. I will research different activities to try, to see what is most enjoyable, rewarding, and motivating to continue adding more movement to my routine.\n",
          },
          {
            id: "3e06706d-75d6-4035-956a-705d787e499b",
            name: "Monthly Plan",
            type: "textarea",
            value:
              "Short Term Goals - (11/11/22 - 1/11/2023):\n1. I am making progress toward 2-3 days of exercise per week.\n2. I have lost a few pounds and am beginning to feel more energetic with improved sleep.",
          },
          {
            id: "0b58989e-b24e-42c5-becd-8db39f190909",
            name: "Motivators",
            type: "textarea",
            value:
              "Motivators:\n* I want to experience better quality sleep through a healthy lifestyle so I can wake up feeling energized throughout the day. \n* I want to be healthy to continue doing what I enjoy for as long as possible, and conquer things I may not think I can do.\n* I would eventually like to learn what is healthy and what's not healthy to have a better understanding of how to make beneficial choices for my body.\"",
          },
        ],
      },
    },
    {
      id: "5",
      name: "Custom Form",
      key: "custom",
      uuid: "85913760-95f0-49f1-932b-7e03118b7eb3",
      formDbId: "6452ed21f84b83eddd6451b8",
      form: {
        _id: "6452ed21f84b83eddd6451b8",
        formTitle: "Screeners",
        formDescription: "",
        formItems: [
          {
            id: "c9a4b6ce-2e60-4bc8-b86c-1ada2233994c",
            title: "Member is in WL Program",
            type: "title",
          },
          {
            id: "983be62b-4674-4c14-8fdb-d3c2e04eee8b",
            title:
              "Are you pregnant or do you have Kidney disease requiring dialysis?",
            type: "select",
            options: [
              { title: "Select", value: "" },
              {
                title: "Yes (Transfer to Resilience)",
                value: "Yes_Transfer_to_Resilience",
              },
            ],
          },
          {
            id: "8496d231-073b-40d9-810f-639ac72c09d4",
            title: "Do you have Heart Failure?",
            type: "select",
            options: [
              { title: "Select", value: "" },
              {
                title: "Yes (Transfer to Heart Health)",
                value: "Yes_Transfer_to_Heart_Health",
              },
              {
                title: "Yes (Transfer to Whole Health)",
                value: "Yes_Transfer_to_Whole_Health",
              },
              {
                title: "Yes (Transfer to Resilience)",
                value: "Yes_Transfer_to_Resilience",
              },
              {
                title: "Yes (CHF state 1 or 2, remain in current)",
                value:
                  "Yes_CHF_stage_1_or_2. No_program_restrictions,_ remain_in_current_program.",
              },
              { title: "No", value: "No_" },
            ],
          },
          {
            id: "9ed803db-1da1-49ff-9e02-1135aec92b85",
            title:
              "Have you been diagnosed with diabetes and take sylfonylureas such as Glipizide (Glucotrol), Glyburide (Diabeta, Micronase, Glynase) Gliclazide, Glimepiride (Amaryl); Meglitinides such as Repaglinide (Prandin), Nateglinide (Starlix); or use Insulin? ",
            type: "select",
            options: [
              { title: "Select", value: "" },
              {
                title: "Yes (Transfer to Whole Health)",
                value: "Yes_Transfer_to_Whole_Health",
              },
              {
                title: "Yes (Transfer to Resiliene)",
                value: "Yes_Transfer_to_Resilience",
              },
              { title: "No", value: "No_" },
            ],
          },
          {
            id: "dec50d48-b0ca-48c3-a667-f546fd3bdcf2",
            title:
              "Have you ever been diagnosed with or treated for an eating disorder, such as anorexia or bulimia?",
            type: "select",
            options: [
              { title: "Select", value: "" },
              { title: "No", value: "No_" },
              { title: "Yes", value: "Yes_" },
            ],
          },
        ],
      },
    },
    {
      id: "5",
      name: "Custom Form",
      key: "custom",
      uuid: "ec5e54fa-e7a6-41d2-b98b-f2c2e43bde11",
      formDbId: "645153e3f84b83eddd6451af",
      form: {
        _id: "645153e3f84b83eddd6451af",
        formTitle: "Health Information / Medications / Chronic Conditions",
        formDescription: "",
        formItems: [
          {
            id: "5f406f96-a256-4461-8657-5200421feb17",
            title: "Member Notes",
            type: "select",
            options: [
              {
                title:
                  "No significant health conditions or history of injury, illness, or trauma.",
                value:
                  "no significant health conditions or history of injury, illness, or trauma.",
              },
              {
                title: "Having 1 or more significant health conditions.",
                value: "Having 1 or more significant health conditions.",
              },
              {
                title:
                  "Having a history of significant impacts on their health.",
                value:
                  "Having a history of significant impacts on their health.",
              },
            ],
          },
          {
            id: "c0c45870-680b-4ea8-b6d0-671599e08df3",
            name: "Other Relevant Health Information, diagnosis, date, duration, state of condition etc.",
            type: "textarea",
          },
          {
            id: "1cd0ebc3-860e-44c0-a806-8ae6b18032da",
            title: "Last Visit With PCP",
            type: "select",
            options: [
              { title: "0-3 months", value: "0-3 months" },
              { title: "4-6 months", value: "4-6 months" },
              { title: "7-12 months", value: "7-12 months" },
              { title: "1+ year", value: "1+ year" },
              { title: "Member Refused", value: "Member Refused" },
              {
                title: "Not Applicable/Discussed",
                value: "Not Applicable/Discussed",
              },
            ],
          },
          {
            id: "ad40fe7c-40d9-4912-894f-677a5034b0ae",
            name: "If member has not seen PCP in 6-12 months, please explain.",
            type: "textarea",
          },
        ],
      },
    },
  ],
};

console.log(getValueProperties(testTemplate));
