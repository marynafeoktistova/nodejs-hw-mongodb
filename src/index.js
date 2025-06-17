import { initMongoDbConnection } from './db/initMongoConnection.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  await initMongoDbConnection();
  startServer();
};

bootstrap();
