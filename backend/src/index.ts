import express from 'express';
import cors from 'cors';
import { runMigrations } from './db/index.ts';
import scanRoutes from './routes/scan.ts';
import findingsRoutes from './routes/findings.ts';
import exceptionsRoutes from './routes/exceptions.ts';
import exportRoutes from './routes/export.ts';
import configRoutes from './routes/config.ts';
import net from 'net';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findFreePort(preferred: number, maxAttempts = 100): Promise<number> {
  return new Promise((resolve, reject) => {
    const tryPort = (port: number, attempt: number) => {
      if (attempt > maxAttempts) {
        return reject(new Error('Could not find free port'));
      }
      const server = net.createServer();
      server.listen(port, () => {
        server.close();
        resolve(port);
      });
      server.on('error', () => {
        tryPort(port + 1, attempt + 1);
      });
    };
    tryPort(preferred, 0);
  });
}

async function main() {
  runMigrations();

  const preferredBackend = parseInt(process.env.BACKEND_PORT || '43000');
  const backendPort = await findFreePort(preferredBackend);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/scan', scanRoutes);
  app.use('/api/findings', findingsRoutes);
  app.use('/api/exceptions', exceptionsRoutes);
  app.use('/api/export', exportRoutes);
  app.use('/api/config', configRoutes);

  app.listen(backendPort, () => {
    console.log(`InfraGuard Workbench API running on http://localhost:${backendPort}`);

    const envPath = path.join(__dirname, '..', '..', '.env');
    const envContent = `BACKEND_PORT=${backendPort}\nFRONTEND_PORT=${process.env.FRONTEND_PORT || '42000'}\nDATABASE_PATH=./data/infraguard.db\n`;
    fs.writeFileSync(envPath, envContent);
  });
}

main().catch(console.error);
