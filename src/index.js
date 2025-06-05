import { setupServer } from './server.js';
import { initMongoConnection } from './db/models/initMongoConnection.js';
import dotenv from 'dotenv';

dotenv.config();
const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();
