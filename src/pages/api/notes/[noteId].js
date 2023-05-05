import { MongoClient, ObjectId } from "mongodb";

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return client;
}

const collectionName = "notes";

async function findDocument(client, query = {}) {
  const db = client.db();
  const collection = db.collection(collectionName);
  const filter = query._id ? { _id: new ObjectId(query._id) } : {};
  const document = await collection.find(filter).toArray();
  return document[0];
}

export default async function handler(req, res) {
  const client = await connectToDatabase();

  const { method } = req;
  const { noteId } = req.query;

  switch (method) {
    case "GET":
      try {
        const documents = await findDocument(client, { _id: noteId });
        res.status(200).json(documents);
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
