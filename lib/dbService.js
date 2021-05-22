import MongoClient from "mongodb";

export const insertDbFileInfo = async info => {
  console.time("write file into db");
  const client = await MongoClient.connect(process.env.MONGODB_URL);
  console.timeLog("write file into db");

  const database = client.db("files");
  const uploadedFilesCollection = database.collection("uploadedFiles");
  await uploadedFilesCollection.insertOne(info);

  console.timeEnd("write file into db");
};
export const selectDbUploadedFiles = async () => {
  console.time("read data from db");
  const client = await MongoClient.connect(process.env.MONGODB_URL);
  console.timeLog("read data from db");

  const database = client.db("files");
  const uploadedFilesCollection = database.collection("uploadedFiles");
  const result = await uploadedFilesCollection.find({}).toArray();

  console.timeEnd("read data from db");
  return result;
};
