import { Router } from 'express';
import { createException, updateExceptionStatus, getExceptions, getExceptionById } from '../services/exceptions.ts';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { findingId, reason, compensatingControl, expiryDate, proposedBy } = req.body;
    if (!findingId || !reason || !compensatingControl || !expiryDate || !proposedBy) {
      return res.status(400).json({ error: 'All fields are required: findingId, reason, compensatingControl, expiryDate, proposedBy' });
    }

    const exception = await createException(findingId, reason, compensatingControl, expiryDate, proposedBy);
    res.status(201).json(exception);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to create exception' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status, approvedBy } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['proposed', 'approved', 'rejected', 'expired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const exception = await updateExceptionStatus(req.params.id, status, approvedBy);
    if (!exception) {
      return res.status(404).json({ error: 'Exception not found' });
    }
    res.json(exception);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update exception' });
  }
});

router.get('/', async (req, res) => {
  try {
    const allExceptions = await getExceptions();
    res.json(allExceptions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exceptions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const exception = await getExceptionById(req.params.id);
    if (!exception) {
      return res.status(404).json({ error: 'Exception not found' });
    }
    res.json(exception);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exception' });
  }
});

export default router;
