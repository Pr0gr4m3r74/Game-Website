import { Router } from 'express';
import authRoutes from './auth';
import gameRoutes from './games';

const router = Router();

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
