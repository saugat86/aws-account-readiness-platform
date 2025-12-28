import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get appeals' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Create appeal' });
});

export { router as appealRoutes };