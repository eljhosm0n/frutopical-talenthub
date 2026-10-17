import { app } from './app.js';
import { checkDatabase } from './config/database.js';
import { environment } from './config/env.js';

const { port } = environment();
checkDatabase()
  .then(() => app.listen(port, () => console.log(`API lista en http://localhost:${port}/api/v1`)))
  .catch((error) => { console.error('No fue posible conectar a MySQL:', error.message); process.exit(1); });
