export class AuthService {
  async registerUser(data) {
    // Lógica de registro
    return { success: true };
  }
}
import { pool } from '../../shared/database';
import bcrypt from 'bcrypt';

export class AuthService {
  async registerUser(data: { email: string; password: string; phone: string }) {
    const { email, password, phone } = data;
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, phone) VALUES ($1, $2, $3) RETURNING id',
      [email, passwordHash, phone]
    );

    return { success: true, userId: result.rows[0].id };
  }

  async verify2FA(userId: string, code: string) {
    const result = await pool.query(
      'SELECT code, expires_at, used FROM two_fa_codes WHERE user_id = $1 AND used = FALSE ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    const codeData = result.rows[0];
    if (!codeData || codeData.code !== code || new Date() > codeData.expires_at) {
      return { success: false, error: 'Invalid or expired code' };
    }

    await pool.query('UPDATE two_fa_codes SET used = TRUE WHERE id = $1', [result.rows[0].id]);
    return { success: true };
  }
}