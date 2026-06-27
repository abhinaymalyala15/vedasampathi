import { Router } from 'express';
import {
  db,
  formatEvent,
  formatPathasalaPublic,
  formatScholarFull,
  formatScholarPublic,
} from '../db.js';
import { authRequired, optionalAuth } from '../middleware/auth.js';
import { upload } from '../upload.js';

const router = Router();

router.get('/scholars', (req, res) => {
  const perPage = Math.min(parseInt(req.query.per_page || '20', 10), 100);
  const rows = db.all('scholars', (s) => s.status === 'approved')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, perPage);
  res.json({ data: rows.map(formatScholarPublic), per_page: perPage, total: rows.length });
});

router.get('/scholars/:id', optionalAuth, (req, res) => {
  const row = db.get('scholars', (s) => s.id === parseInt(req.params.id, 10) && s.status === 'approved');
  if (!row) return res.status(404).json({ message: 'Scholar not found' });
  res.json(formatScholarFull(row));
});

router.get('/pathasalas', (req, res) => {
  const perPage = Math.min(parseInt(req.query.per_page || '20', 10), 100);
  const rows = db.all('pathasalas', (p) => p.status === 'approved')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, perPage);
  res.json({ data: rows.map(formatPathasalaPublic), per_page: perPage, total: rows.length });
});

router.get('/pathasalas/:id', (req, res) => {
  const row = db.get('pathasalas', (p) => p.id === parseInt(req.params.id, 10) && p.status === 'approved');
  if (!row) return res.status(404).json({ message: 'Pathasala not found' });
  res.json(formatPathasalaPublic(row));
});

router.get('/events', optionalAuth, (req, res) => {
  const perPage = Math.min(parseInt(req.query.per_page || '20', 10), 100);
  const userId = req.user?.id || null;
  const today = new Date().toISOString().slice(0, 10);

  let rows = db.all('events', () => true);
  if (req.query.upcoming === '1') {
    rows = rows.filter((e) => e.date && e.date >= today);
  }
  if (req.query.created_by_role && req.query.created_by_id) {
    const cid = parseInt(req.query.created_by_id, 10);
    rows = rows.filter((e) => e.created_by_role === req.query.created_by_role && e.created_by_id === cid);
  }
  rows = rows.sort((a, b) => (a.date || '').localeCompare(b.date || '')).slice(0, perPage);
  res.json({ data: rows.map((r) => formatEvent(r, userId)), per_page: perPage, total: rows.length });
});

router.get('/events/:id', optionalAuth, (req, res) => {
  const row = db.get('events', (e) => e.id === parseInt(req.params.id, 10));
  if (!row) return res.status(404).json({ message: 'Event not found' });
  res.json(formatEvent(row, req.user?.id || null));
});

router.post('/events/:id/subscribe', authRequired, (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  if (!db.get('events', (e) => e.id === eventId)) {
    return res.status(404).json({ message: 'Event not found' });
  }
  if (!db.get('event_subscriptions', (s) => s.user_id === req.user.id && s.event_id === eventId)) {
    db.insert('event_subscriptions', { user_id: req.user.id, event_id: eventId });
  }
  res.json({ message: 'Subscribed' });
});

router.delete('/events/:id/unsubscribe', authRequired, (req, res) => {
  db.remove('event_subscriptions', (s) => s.user_id === req.user.id && s.event_id === parseInt(req.params.id, 10));
  res.json({ message: 'Unsubscribed' });
});

router.post('/donations', (req, res) => {
  const b = req.body || {};
  if (!b.donor_name || !b.donor_email || !b.amount || !b.donation_type) {
    return res.status(422).json({ message: 'Required donation fields missing' });
  }
  db.insert('donations', {
    donor_name: b.donor_name,
    donor_email: b.donor_email,
    donor_phone: b.donor_phone || null,
    donation_type: b.donation_type,
    scholar_id: b.scholar_id || null,
    pathasala_id: b.pathasala_id || null,
    amount: b.amount,
    notes: b.notes || null,
    status: 'pending',
  });
  res.status(201).json({ message: 'Donation recorded. Thank you!' });
});

router.post('/contacts', (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(422).json({ message: 'Name, email and message are required' });
  }
  db.insert('contacts', { name, email, subject: subject || null, message });
  res.status(201).json({ message: 'Message sent successfully' });
});

router.get('/pages/:slug', (req, res) => {
  const page = db.get('cms_pages', (p) => p.slug === req.params.slug && p.is_published);
  if (!page) return res.status(404).json({ message: 'Page not found' });
  res.json({ title: page.title, slug: page.slug, content: page.content });
});

router.post('/upload', authRequired, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(422).json({ message: 'No file uploaded' });
  const baseUrl = process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 8001}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ url, file_url: url });
});

export default router;
