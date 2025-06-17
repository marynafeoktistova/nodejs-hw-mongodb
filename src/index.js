import { initMongoDbConnection } from './db/initMongoConnection.js';
import { startServer } from './server.js';

await initMongoDbConnection();
startServer();
