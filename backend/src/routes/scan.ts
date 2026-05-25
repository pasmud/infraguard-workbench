import { Router } from 'express';
import { runScan, getScans, getFindingsForScan } from '../services/scanner.ts';
import { getMockFindings, getDemoDirectory } from '../services/mock.ts';
import { isCheckovAvailable } from '../services/checkov.ts';
import { isTrivyAvailable } from '../services/trivy.ts';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { directory, scanner } = req.body;
    if (!directory) {
      return res.status(400).json({ error: 'Directory is required' });
    }

    const result = await runScan(directory, scanner || 'checkov');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Scan failed' });
  }
});

router.post('/demo', async (req, res) => {
  const dir = getDemoDirectory();
  const scanId = `demo-${Date.now()}`;
  const findings = getMockFindings(scanId);

  res.json({
    scan: {
      id: scanId,
      directory: dir,
      scanner: 'mock',
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      error: null,
      findingsCount: findings.length,
    },
    findings,
  });
});

router.get('/', async (req, res) => {
  try {
    const allScans = await getScans();
    res.json(allScans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
});

router.get('/:id/findings', async (req, res) => {
  try {
    const scanFindings = await getFindingsForScan(req.params.id);
    res.json(scanFindings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch findings' });
  }
});

export default router;
