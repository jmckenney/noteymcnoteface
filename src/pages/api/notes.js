import { ObjectId, MongoClient } from "mongodb";

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
    updateOperation = { $set: { noteTemplate: update.noteTemplate } };
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
