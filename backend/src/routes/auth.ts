import { Router } from 'express';

const router = Router();

// Placeholder auth routes
router.post('/register', (req, res) => {
  res.json({ success: true, message: 'Registration endpoint' });
});

router.post('/login', (req, res) => {
  res.json({ success: true, message: 'Login endpoint' });
});

export { router as authRoutes };