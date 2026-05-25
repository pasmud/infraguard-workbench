import { Router } from 'express';
import { isCheckovAvailable } from '../services/checkov.ts';
import { isTrivyAvailable } from '../services/trivy.ts';
import type { ScannerConfig } from '../types/index.ts';

const router = Router();

router.get('/', (req, res) => {
  const checkov = isCheckovAvailable();
  const trivy = isTrivyAvailable();

  const config: ScannerConfig = {
    checkovAvailable: checkov.available,
    trivyAvailable: trivy.available,
    checkovVersion: checkov.version,
    trivyVersion: trivy.version,
  };

  res.json(config);
});

export default router;
