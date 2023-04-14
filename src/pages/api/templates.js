import { MongoClient } from "mongodb";

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client;
}

const collectionName = "templates";

async function findDocuments(client, query = {}) {
  const db = client.db();
  const collection = db.collection(collectionName);
  const documents = await collection.find(query).toArray();
  return documents;
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

  switch (method) {
    case "GET":
      try {
        const documents = await findDocuments(client, query);
        res.status(200).json(documents);
      } catch (error) {
        res.status(500).json({ error });
      }
      break;

    case "POST":
      try {
        const insertedId = await createDocument(client, document);
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
