import MongoClient from "mongodb";

export const writeFileUpload = async info => {
  const client = await MongoClient.connect(process.env.MONGODB_URL);
  const database = client.db("files");
  const uploadedFilesCollection = database.collection("uploadedFiles");
  await uploadedFilesCollection.insertOne(info);
};
export const readUploadedFiles = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URL);
  const database = client.db("files");
  const uploadedFilesCollection = database.collection("uploadedFiles");
  return await uploadedFilesCollection.find({}).toArray();
};
