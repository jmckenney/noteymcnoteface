import { ObjectId, MongoClient } from "mongodb";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const getValueProperties = (obj) => {
  if (!obj || typeof obj !== "object") {
    return [];
  }

  if (obj.hasOwnProperty("value") && typeof obj.value === "string") {
    return [obj.value];
  }

  return Object.values(obj).flatMap(getValueProperties);
};

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client;
}

const collectionName = "notes";

async function findDocuments(client, query = {}, limit) {
  const db = client.db();
  const collection = db.collection(collectionName);
  if (limit) {
    return await collection
      .find(query)
      .limit(limit)
      .sort({ created: -1 })
      .toArray();
  } else {
    return await collection.find(query).toArray();
  }
}

async function createDocument(client, document) {
  const db = client.db();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(document);
  return result.insertedId;
}

async function updateDocument(client, query, update) {
  const db = client.db();
  const collection = db.collection(collectionName);
  const result = await collection.updateOne(query, { $set: update });
  return result.modifiedCount;
}

async function patchDocument(client, query, update) {
  query = { _id: new ObjectId(query._ID) };
  const db = client.db();
  const collection = db.collection(collectionName);

  let updateOperation;

  // TODO, make this more robust and less like the smell of dead fish.
  if (update.hasOwnProperty("metrics")) {
    updateOperation = { $push: { metrics: update.metrics } };
  } else if (update.hasOwnProperty("noteTemplate")) {
    const valueTexts = getValueProperties(update.noteTemplate);
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 1000,
        temperature: 0.2,
        prompt: `
      Create a short summary of the patient's goals and motivations. Include
      and details about hospital stays or other medical history that may be
      relevant to the patient's current situation.

      ${JSON.stringify(valueTexts)}
      `,
      });
      console.log(completion.data.choices[0].text);

      updateOperation = {
        $set: {
          noteTemplate: update.noteTemplate,
          // summary: "summary text",
          summary: completion.data.choices[0].text,
        },
      };
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  } else if (update.hasOwnProperty("state")) {
    updateOperation = { $set: { state: update.state } };
  } else {
    throw new Error(
      "Invalid update key. Must be 'metrics' or 'noteTemplate' or 'state'."
    );
  }

  const result = await collection.updateOne(query, updateOperation);
  return result.modifiedCount;
}

async function deleteDocument(client, query) {
  const db = client.db();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne(query);
  return result.deletedCount;
}

export default async function handler(req, res) {
  const client = await connectToDatabase();

  const { method } = req;
  const { query, document } = req.body;
  const { state, limit } = req.query;

  switch (method) {
    case "GET":
      try {
        const filter = state ? { state } : {};
        let limitInt;
        if (limit) {
          limitInt = parseInt(limit, 10);
        }
        const documents = await findDocuments(client, filter, limitInt);
        res.status(200).json(documents);
      } catch (error) {
        res.status(500).json({ error });
      }
      break;

    case "POST":
      try {
        const insertedId = await createDocument(client, {
          ...document,
          created: new Date(),
        });
        res.status(200).json({ insertedId });
      } catch (error) {
        res.status(500).json({ error });
      }
      break;

    case "PUT":
      try {
        const modifiedCount = await updateDocument(client, query, document);
        res.status(200).json({ modifiedCount });
      } catch (error) {
        res.status(500).json({ error });
      }
      break;

    case "PATCH":
      try {
        const modifiedCount = await patchDocument(client, query, document);
        res.status(200).json({ modifiedCount });
      } catch (error) {
        res.status(500).json({ error });
      }
      break;

    case "DELETE":
      try {
        const deletedCount = await deleteDocument(client, query);
        res.status(200).json({ deletedCount });
      } catch (error) {
        res.status(500).json({ error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).json({ message: `Method ${method} not allowed` });
  }

  client.close();
}
