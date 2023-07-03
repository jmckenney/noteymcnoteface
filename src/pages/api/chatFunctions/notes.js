export const notesFunctionDefinitionForLlm = {
  name: "getRecentNotes",
  description:
    "Get recent notes for the purpose of summarizing them for the user. Will default to limit of 5 notes.",
  parameters: {
    type: "object",
    properties: {
      Limit: { type: "number" },
    },
    required: [],
  },
};

export const getRecentNotes = () => {
  return JSON.stringify([
    {
      date: "2021-06-13T00:00:00.000Z",
      title: "Encounter",
      content: `HEALTH_COACHING_FOLLOW_UP_SESSION 
(Do not delete #snippet_.hcfu )

Date: 06-26-2023

Primary_provider_session_# 10
 
 _Phase_: Active
Consult conducted by:   

Member's Home Address: 1555 Main St, Anytown, USA

Location_during_consult: Home_
	555 Main St, Anytown, USA

Program_: Weight loss  

Vida_related_concerns: None this week.

*RECAP_OF_PROGRESS: 
food is going great, making improvements and making healthier choices. The last two weeks he has been more consistent with salads.

*HEALTH_INFORMATION_/_MEDICATIONS_/_CHRONIC_CONDITIONS 

Weight:_235_pounds 

Weight_collected_was_measured choose one
Weight notes: He feels more light. No changes in weight. His clothes are feeling better. Belly size reduced. 

*FOCUS_OF_THE_SESSION: 
Member wanted to focus today on: 
He is feeling more light weight. He is happy and wants to continue losing weight. He will like to continue to lose more weight until he can go back to 210 lbs by the end of this year. Staying consistent with healthy eating and exercise. He wants to work on being more consistent during the week with healthy eating. Challenges: craving Indian food. 

*STRESSORS_AND_STRESS_LEVELS:
No discussion today.

*SLEEP_: 
No discussion today.

*PHYSICAL_ACTIVITY: 

Regular walks, not starting strength training yet. Walks 4 days per week. Ranging from 30 minutes to 1 hour. 

*NUTRITION_/_DIET: 

Eating healthy salads. What has helped you to stay consistent with healthy eating? He changed to salads, he cut down sugar except what he eats in fruits. Apple cider vinegar tea in the morning and green tea. He has been able to manage his cravings and has made a big impact. 

*INCLUSION_EXCLUSION_REQUIRED _COMPLETION _SECTION:

*REQUIRED_COMPLETION_:
Did the member share any information indicating that they should be excluded from their current program?: No

*SUMMARY_POST_CALL_MESSAGE_(COPY AND PASTE AND SEND IN CHAT TO MEMBER WITHIN 48 HRS):

Hello Doug!
Thank you for your time at our last call.

Our next call is scheduled for: 07-03-2023 at : PM. 

As a reminder, here are some action steps you said were important for you to do before we meet again.
1. I will work on 

You can also see your care plan in Journey in the app. Tap the "Plan" button at the top of the screen. Got Questions? Let me know here in Chat. 

*COORDINATION_OF_CARE_&_FOLLOW_UP: 
Not applicable`,
    },
    {
      date: "2021-06-13T00:00:00.000Z",
      title: "Encounter",
      content: `HEALTH_COACHING_FOLLOW_UP_SESSION 
(Do not delete #snippet_.hcfu )
Date: 05-22-2023
Primary_provider_session_#  9 _Phase_: Active 
Consult conducted by:   Phone call
Location_during_consult:  |WORK 

Program_: -weight loss.  

Vida_related_concerns:  none.

*RECAP_OF_PROGRESS: 
No major changes, continues to limit soda consumption. Exercise: he is doing two days per week, not 4 days yet. HE is doing 1:15 minutes per day. Healthy eating, not 100 percent but continue to  make the choice. Home made food, avoiding eating out. No fast food, no french fries. Current 238 lbs. His goal is 230 lb
238 lbs.
2% --	5	--	233
5% --	12	--	226
7% --	17	--	221

Goals for the week: continue with his plan and see how he can adjust. Sent strength training for the upper lower body. 
*HEALTH_INFORMATION_/_MEDICATIONS_/_CHRONIC_CONDITIONS 
Not discussed today.
Weight:_238_pounds  
Weight_collected_was_measured choose one
Weight notes: his goal is to reach 230 lbs.

*FOCUS_OF_THE_SESSION: 
Member wanted to focus today on: 
The member is willing to add more activity in order to see more weight loss. He is also working on eating less.
*STRESSORS_AND_STRESS_LEVELS:
Not discussed today.
*SLEEP_: 
Not discussed today.
*PHYSICAL_ACTIVITY: 
Looking into adding strength training exercise to his routine.
*NUTRITION_/_DIET: 
Continue to eat home made foods and reduce eating out.
*INCLUSION_EXCLUSION_REQUIRED_COMPLETION_SECTION:
*REQUIRED_COMPLETION_:
Did the member share any information indicating that they should be excluded from their current program?:
No
*SUMMARY_POST_CALL_MESSAGE_(COPY AND PASTE AND SEND IN CHAT TO MEMBER WITHIN 48 HRS):

Hello !
Thank you for your time at our last call.

Our next call is scheduled for  
June 26, 2023 at 12:20 pm
As a reminder, here are some action steps you said were important for you to do before we meet again.
1. Add a strength training routine, at least 2x per week.
2. Continue to avoid eating out.
You can also see your care plan in Journey in the app.  Tap the "Plan" button at the top of the screen.  Got Questions?  Let me know here in Chat. 

*COORDINATION_OF_CARE_&_FOLLOW_UP: 
Sent upper/lower  body routine.`,
    },
  ]);
};
