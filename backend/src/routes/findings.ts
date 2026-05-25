import { Router } from 'express';
import { getAllFindings, getFindingById } from '../services/scanner.ts';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { severity, scanner, framework, compliance } = req.query;
    let allFindings = (await getAllFindings()).map((f) => ({
      ...f,
      complianceIds: typeof f.complianceIds === 'string'
        ? JSON.parse(f.complianceIds as string)
        : f.complianceIds,
    }));

    if (severity) {
      allFindings = allFindings.filter((f: any) => f.severity === severity);
    }
    if (scanner) {
      allFindings = allFindings.filter((f: any) => f.scanner === scanner);
    }
    if (framework) {
      allFindings = allFindings.filter((f: any) => f.framework === framework);
    }
    if (compliance) {
      allFindings = allFindings.filter((f: any) =>
        f.complianceIds.includes(compliance as string)
      );
    }

    res.json(allFindings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch findings' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const finding = await getFindingById(req.params.id);
    if (!finding) {
      return res.status(404).json({ error: 'Finding not found' });
    }
    res.json(finding);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch finding' });
  }
});

export default router;
