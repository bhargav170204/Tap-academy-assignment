import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const accessSecret: Secret = process.env.JWT_ACCESS_SECRET || 'access_secret_default_key_change_in_production';
const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_default_key_change_in_production';

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn('⚠️  Warning: Using default JWT secrets. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in .env for production');
}

export const signAccessToken = (payload: object) => {
  const opts: SignOptions = { expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') as any };
  return jwt.sign(payload as string | object | Buffer, accessSecret, opts);
};

export const signRefreshToken = (payload: object) => {
  const opts: SignOptions = { expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as any };
  return jwt.sign(payload as string | object | Buffer, refreshSecret, opts);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessSecret as Secret);
};
