import {
  getRecentMetrics,
  getRecentNotes,
  openAi,
  metricFunctionDefinitionForLlm,
  notesFunctionDefinitionForLlm,
} from "./index";

export async function callFunctionsAndAddReturnToMessages(
  responseMessageWithFunctionRecommendation,
  messages
) {
  /**
   * A map of functions that can be called by using
   * the recommended function as the potential key.
   */
  const availableFunctions = {
    getRecentMetrics: getRecentMetrics,
    getRecentNotes: getRecentNotes,
  };
  const recommendedFunctionNameToCall =
    responseMessageWithFunctionRecommendation.function_call.name;
  const functionToCall = availableFunctions[recommendedFunctionNameToCall];
  const functionArgs = JSON.parse(
    responseMessageWithFunctionRecommendation.function_call.arguments
  );

  // ToDo, carefully call arguments and augment if needed
  const functionReturn = functionToCall();

  const messagesWithFunctionCallMessage = [
    ...messages,
    responseMessageWithFunctionRecommendation,
    {
      role: "function",
      name: recommendedFunctionNameToCall,
      content: functionReturn,
    },
  ];

  const chatCompletionWithFunctionAndFunctionCallData =
    await openAi.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: messagesWithFunctionCallMessage,
      // Possible functions again (recursively tackle prompt requests)
      functions: [
        metricFunctionDefinitionForLlm,
        notesFunctionDefinitionForLlm,
      ],
    });

  const responseMessage =
    chatCompletionWithFunctionAndFunctionCallData.data.choices[0].message;

  // enter recursion so that we can keep calling more functions if needed
  if (responseMessage.function_call) {
    const recursed = await callFunctionsAndAddReturnToMessages(
      responseMessage,
      messagesWithFunctionCallMessage
    );
    return recursed;
  } else {
    const messagesWithFunctionCallData = [
      ...messagesWithFunctionCallMessage,
      responseMessage,
    ];
    return messagesWithFunctionCallData;
  }
}
