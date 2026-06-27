import { Router } from 'express';
import crypto from 'crypto';
import {
  db,
  formatUser,
  getScholarByUserId,
  hashPassword,
  verifyPassword,
} from '../db.js';
import { authRequired, signToken } from '../middleware/auth.js';
import { upload } from '../upload.js';

const router = Router();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(422).json({ message: 'Email and password are required' });
  }
  const user = db.get('users', (u) => u.email === email.toLowerCase().trim());
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (!user.is_active) {
    const scholar = getScholarByUserId(user.id);
    if (scholar?.status === 'pending') {
      return res.status(403).json({ message: 'Your application is pending admin approval.' });
    }
    if (scholar?.status === 'rejected') {
      return res.status(403).json({ message: 'Your application was rejected. Contact support.' });
    }
    return res.status(403).json({ message: 'Account is inactive. Contact support.' });
  }
  res.json({ token: signToken(user), user: formatUser(user) });
});

router.post('/register', (req, res) => {
  const b = req.body || {};
  const email = (b.email || '').toLowerCase().trim();
  if (!b.name || !email || !b.password || !b.phone_number) {
    return res.status(422).json({ message: 'Name, email, phone and password are required' });
  }
  if (b.password !== b.password_confirmation) {
    return res.status(422).json({ message: 'Password confirmation does not match' });
  }
  if (db.get('users', (u) => u.email === email)) {
    return res.status(422).json({ message: 'Email already registered', errors: { email: ['Taken'] } });
  }
  const phoneVerified = db.all('otp_codes', (o) => o.phone_number === b.phone_number && o.verified)
    .sort((a, b) => b.id - a.id)[0];
  if (!phoneVerified) {
    return res.status(422).json({ message: 'Phone number not verified. Complete OTP verification first.' });
  }

  const user = db.insert('users', {
    email,
    password_hash: hashPassword(b.password),
    role: 'scholar',
    name: b.name,
    phone_number: b.phone_number,
    is_active: false,
    security_question_1: b.security_question_1 || null,
    security_answer_1: b.security_answer_1 || null,
    security_question_2: b.security_question_2 || null,
    security_answer_2: b.security_answer_2 || null,
  });

  db.insert('scholars', {
    user_id: user.id,
    full_name: b.name,
    email,
    phone_number: b.phone_number,
    city: b.city || null,
    state: b.state || null,
    bio: null,
    status: 'pending',
    date_of_birth: b.date_of_birth || null,
    gender: b.gender || null,
    primary_veda: b.primary_veda || null,
    shakha: b.shakha || null,
    years_of_study: b.years_of_study || null,
    current_level: b.current_level || null,
    pathasala_name: b.pathasala_name || null,
    pathasala_location: b.pathasala_location || null,
    enrollment_year: b.enrollment_year || null,
    study_status: b.study_status || null,
    guru_name: b.guru_name || null,
    param_guru: b.param_guru || null,
    sampradaya: b.sampradaya || null,
    guru_location: b.guru_location || null,
    profile_photo_url: b.profile_photo_url || null,
    photo: b.profile_photo_url || null,
    certificate_urls: b.certificate_urls || [],
    specialisations: b.primary_veda ? [b.primary_veda] : [],
    languages: ['Sanskrit', 'Telugu'],
  });

  res.status(201).json({ message: 'Application submitted successfully. Await admin approval.' });
});

router.get('/me', authRequired, (req, res) => {
  res.json({ user: formatUser(req.user) });
});

router.post('/logout', authRequired, (_req, res) => {
  res.json({ message: 'Logged out' });
});

router.post('/send-otp', (req, res) => {
  const { phone_number } = req.body || {};
  if (!phone_number) return res.status(422).json({ message: 'Phone number is required' });
  if (db.get('users', (u) => u.phone_number === phone_number)) {
    return res.status(422).json({ message: 'Phone number already registered' });
  }
  const code = generateOtp();
  db.insert('otp_codes', {
    phone_number,
    code,
    verified: false,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  });
  const payload = { message: 'OTP sent' };
  if (process.env.NODE_ENV !== 'production') payload.otp = code;
  res.json(payload);
});

router.post('/verify-otp', (req, res) => {
  const { phone_number, otp } = req.body || {};
  if (!phone_number || !otp) return res.status(422).json({ message: 'Phone and OTP are required' });
  const row = db.all('otp_codes', (o) => o.phone_number === phone_number && o.code === otp)
    .sort((a, b) => b.id - a.id)[0];
  if (!row || new Date(row.expires_at) < new Date()) {
    return res.status(422).json({ message: 'Invalid or expired OTP' });
  }
  db.update('otp_codes', row.id, { verified: true });
  res.json({ message: 'Phone verified' });
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(422).json({ message: 'No file uploaded' });
  const baseUrl = process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 8001}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ url, file_url: url });
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(422).json({ message: 'Email is required' });
  const normalized = email.toLowerCase().trim();
  if (db.get('users', (u) => u.email === normalized)) {
    const token = crypto.randomBytes(32).toString('hex');
    db.insert('password_resets', {
      email: normalized,
      token,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[dev] Reset: /reset-password?token=${token}&email=${encodeURIComponent(normalized)}`);
    }
  }
  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

router.post('/reset-password', (req, res) => {
  const { token, email, password, password_confirmation } = req.body || {};
  if (!token || !email || !password) {
    return res.status(422).json({ message: 'Token, email and password are required' });
  }
  if (password !== password_confirmation) {
    return res.status(422).json({ message: 'Password confirmation does not match' });
  }
  const normalized = email.toLowerCase().trim();
  const reset = db.get('password_resets', (r) => r.token === token && r.email === normalized);
  if (!reset || new Date(reset.expires_at) < new Date()) {
    return res.status(422).json({ message: 'Invalid or expired reset token' });
  }
  const user = db.get('users', (u) => u.email === normalized);
  if (user) db.update('users', user.id, { password_hash: hashPassword(password) });
  db.remove('password_resets', (r) => r.id === reset.id);
  res.json({ message: 'Password reset successful' });
});

export default router;
