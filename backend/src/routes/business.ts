import { Router } from 'express';

const router = Router();

router.get('/profile', (req, res) => {
  res.json({ success: true, message: 'Get business profile' });
});

router.post('/profile', (req, res) => {
  res.json({ success: true, message: 'Update business profile' });
});

export { router as businessRoutes };