import { Router } from 'express';

const router = Router();

router.post('/upload', (req, res) => {
  res.json({ success: true, message: 'Document upload endpoint' });
});

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get documents' });
});

export { router as documentRoutes };