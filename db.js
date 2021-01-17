import MongoClient from "mongodb";

const mongoUrl =
  process.env.MONGODB_URL ||
  "mongodb://alikadir:password@127.0.0.1:27017?retryWrites=false";

export const writeFileUpload = async info => {
  const client = await MongoClient.connect(mongoUrl);
  const database = client.db("files");
  const uploadedFilesCollection = database.collection("uploadedFiles");
  await uploadedFilesCollection.insertOne(info);
};
export const readUploadedFiles = async () => {
  const client = await MongoClient.connect(mongoUrl);
  const database = client.db("files");
  const uploadedFilesCollection = database.collection("uploadedFiles");
  return await uploadedFilesCollection.find({}).toArray();
};
