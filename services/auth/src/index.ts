import express from 'express';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import { authenticate } from './middleware/authMiddleware';
import { AuthService } from './services/authService';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'bancok_user',
  host: 'postgres',
  database: 'bancok',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const authService = new AuthService();

app.post('/api/v1/auth/register', async (req, res) => {
  const { email, password, phone, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const { success, userId } = await authService.registerUser({ email, password, phone });
  if (!success) return res.status(500).json({ error: 'Registration failed' });

  // Generar código 2FA temporal
  const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
  await pool.query(
    'INSERT INTO two_fa_codes (user_id, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'10 minutes\')',
    [userId, twoFACode]
  );

  res.json({
    success: true,
    data: { userId, email, kycStatus: 'pending', nextStep: '2fa_verification' },
  });
});

app.post('/api/v1/auth/verify-2fa', authenticate, async (req, res) => {
  const { code } = req.body;
  const { userId } = (req as any).user;

  const { success, error } = await authService.verify2FA(userId, code);
  if (!success) return res.status(400).json({ error });

  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  res.json({ success: true, token });
});

app.listen(3001, () => console.log('Auth service running on port 3001'));