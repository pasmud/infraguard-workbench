import { Router } from 'express';
import { generateMarkdownReport, generateJsonReport } from '../services/export.ts';

const router = Router();

router.get('/markdown', async (req, res) => {
  try {
    const report = await generateMarkdownReport();
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-report.md"');
    res.send(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

router.get('/json', async (req, res) => {
  try {
    const report = await generateJsonReport();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-report.json"');
    res.send(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
