import express from 'express';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'bancok_user',
  host: 'postgres',
  database: 'bancok',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.post('/api/v1/auth/register', async (req, res) => {
  const { email, password, phone, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const passwordHash = password; // Reemplazar con bcrypt en producción
  const result = await pool.query(
    'INSERT INTO users (email, password_hash, phone) VALUES ($1, $2, $3) RETURNING id',
    [email, passwordHash, phone]
  );

  const userId = result.rows[0].id;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({
    success: true,
    data: { userId, email, kycStatus: 'pending', nextStep: 'phone_verification' },
    token,
  });
});

app.listen(3001, () => console.log('Auth service running on port 3001'));