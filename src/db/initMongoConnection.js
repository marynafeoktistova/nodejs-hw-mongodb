import mongoose from 'mongoose';

import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  const user = getEnvVar('MONGODB_USER');
  const pwd = getEnvVar('MONGODB_PASSWORD');
  const url = getEnvVar('MONGODB_URL');
  const db = getEnvVar('MONGODB_DB');
  const uri = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;
  console.log(uri);
  try {
    await mongoose.connect(uri);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
