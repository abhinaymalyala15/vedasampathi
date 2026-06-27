import jwt from 'jsonwebtoken';
import { db, formatUser } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vedasampatti-dev-secret-change-in-production';

export { JWT_SECRET };

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    const user = db.get('users', (u) => u.id === payload.sub);
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }
    req.user = user;
    req.userFormatted = formatUser(user);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), JWT_SECRET);
      const user = db.get('users', (u) => u.id === payload.sub);
      if (user?.is_active) {
        req.user = user;
        req.userFormatted = formatUser(user);
      }
    } catch { /* ignore */ }
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
