import { initMongoConnection } from './db/initMongoConnection.js';
import dotenv from 'dotenv';

dotenv.config();
const bootstrap = async () => {
  await initMongoConnection();
};

bootstrap();
