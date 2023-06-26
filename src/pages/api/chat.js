import {
  metricFunctionDefinitionForLlm,
  notesFunctionDefinitionForLlm,
  callFunctionsAndAddReturnToMessages,
  openAi,
} from "./chatFunctions/";

export default async function handler(req, res) {
  const { method } = req;
  const { chatPrompt, conversation = [] } = req.body;

  const messages = conversation.length
    ? [...conversation, { role: "user", content: chatPrompt }]
    : [
        {
          role: "system",
          content:
            "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous. If the user asks for a notes summary, just give a general summary of the note contents.",
        },
        {
          role: "user",
          content: chatPrompt,
        },
      ];

  console.log("messages", messages);

  switch (method) {
    case "POST":
      try {
        const response = await openAi.createChatCompletion({
          model: "gpt-3.5-turbo-0613",
          messages,
          functions: [
            metricFunctionDefinitionForLlm,
            notesFunctionDefinitionForLlm,
          ],
        });

        const responseMessage = response.data.choices[0].message;

        if (responseMessage.function_call) {
          const messagesWithFunctionCallData =
            await callFunctionsAndAddReturnToMessages(
              responseMessage,
              messages
            );
          res.status(200).json(messagesWithFunctionCallData);
        } else {
          messages.push(responseMessage);
          res.status(200).json(messages);
        }
      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
