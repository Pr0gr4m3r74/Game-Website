import { Router } from 'express';
import { body } from 'express-validator';
import { getGames, createGame, joinGame } from '../controllers/gameController';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

const createGameValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Game name must be 1-100 characters'),
  body('description')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be 1-500 characters'),
  body('maxPlayers')
    .optional()
    .isInt({ min: 2, max: 10 })
    .withMessage('Max players must be between 2 and 10'),
];

router.get('/', authenticate, apiLimiter, getGames);
router.post('/', authenticate, apiLimiter, createGameValidation, createGame);
router.post('/:id/join', authenticate, apiLimiter, joinGame);

export default router;
