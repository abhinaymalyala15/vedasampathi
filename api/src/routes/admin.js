import { Router } from 'express';
import {
  db,
  formatEvent,
  formatScholarPublic,
  formatPathasalaPublic,
} from '../db.js';
import { authRequired, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(authRequired, requireRole('admin'));

router.get('/dashboard', (_req, res) => {
  const recentDonations = db.all('donations', () => true)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  res.json({
    pending_scholars: db.count('scholars', (s) => s.status === 'pending'),
    pending_pathasalas: db.count('pathasalas', (p) => p.status === 'pending'),
    total_events: db.count('events', () => true),
    total_donations: db.sum('donations', 'amount', (d) => d.status !== 'cancelled'),
    total_donation_count: db.count('donations', (d) => d.status !== 'cancelled'),
    recent_donations: recentDonations,
  });
});

router.get('/scholars/pending', (_req, res) => {
  const rows = db.all('scholars', (s) => s.status === 'pending').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(rows.map((r) => ({ ...formatScholarPublic(r), ...r, certificate_urls: r.certificate_urls || [] })));
});

router.get('/pathasalas/pending', (_req, res) => {
  res.json(db.all('pathasalas', (p) => p.status === 'pending').map(formatPathasalaPublic));
});

router.put('/scholars/:id/approve', (req, res) => {
  const scholar = db.get('scholars', (s) => s.id === parseInt(req.params.id, 10));
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  db.update('scholars', scholar.id, { status: 'approved', rejection_reason: null });
  db.update('users', scholar.user_id, { is_active: true });
  res.json({ message: 'Approved' });
});

router.put('/pathasalas/:id/approve', (req, res) => {
  const p = db.get('pathasalas', (x) => x.id === parseInt(req.params.id, 10));
  if (!p) return res.status(404).json({ message: 'Not found' });
  db.update('pathasalas', p.id, { status: 'approved', rejection_reason: null });
  db.update('users', p.user_id, { is_active: true });
  res.json({ message: 'Approved' });
});

router.put('/scholars/:id/reject', (req, res) => {
  const scholar = db.get('scholars', (s) => s.id === parseInt(req.params.id, 10));
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  db.update('scholars', scholar.id, { status: 'rejected', rejection_reason: req.body?.reason || null });
  db.update('users', scholar.user_id, { is_active: false });
  res.json({ message: 'Rejected' });
});

router.put('/pathasalas/:id/reject', (req, res) => {
  const p = db.get('pathasalas', (x) => x.id === parseInt(req.params.id, 10));
  if (!p) return res.status(404).json({ message: 'Not found' });
  db.update('pathasalas', p.id, { status: 'rejected', rejection_reason: req.body?.reason || null });
  db.update('users', p.user_id, { is_active: false });
  res.json({ message: 'Rejected' });
});

router.get('/events', (_req, res) => {
  res.json(db.all('events', () => true).sort((a, b) => (b.date || '').localeCompare(a.date || '')).map((r) => formatEvent(r)));
});

router.post('/events', (req, res) => {
  const b = req.body || {};
  if (!b.title || !b.date || !b.location) {
    return res.status(422).json({ message: 'Title, date and location required' });
  }
  res.status(201).json(formatEvent(db.insert('events', {
    title: b.title,
    description: b.description || null,
    date: b.date,
    time: b.time || null,
    location: b.location,
    event_type: b.event_type || 'offline',
    featured: !!b.featured,
    registration_link: b.registration_link || null,
    created_by_role: 'admin',
    created_by_id: null,
  })));
});

router.put('/events/:id', (req, res) => {
  const existing = db.get('events', (e) => e.id === parseInt(req.params.id, 10));
  if (!existing) return res.status(404).json({ message: 'Not found' });
  const b = req.body || {};
  const updated = db.update('events', existing.id, {
    title: b.title ?? existing.title,
    description: b.description ?? existing.description,
    date: b.date ?? existing.date,
    time: b.time ?? existing.time,
    location: b.location ?? existing.location,
    event_type: b.event_type ?? existing.event_type,
    featured: b.featured !== undefined ? !!b.featured : existing.featured,
    registration_link: b.registration_link ?? existing.registration_link,
  });
  const notified = db.count('event_subscriptions', (s) => s.event_id === existing.id);
  res.json({ ...formatEvent(updated), notified });
});

router.delete('/events/:id', (req, res) => {
  db.remove('events', (e) => e.id === parseInt(req.params.id, 10));
  res.json({ message: 'Deleted' });
});

router.get('/donations', (req, res) => {
  let rows = db.all('donations', () => true);
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    rows = rows.filter((d) => d.donor_name?.toLowerCase().includes(q) || d.donor_email?.toLowerCase().includes(q));
  }
  res.json({ data: rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 100) });
});

router.get('/cms', (_req, res) => {
  res.json(db.all('cms_pages', () => true).sort((a, b) => a.title.localeCompare(b.title)));
});

router.post('/cms', (req, res) => {
  const { title, slug, content, is_published } = req.body || {};
  if (!title || !slug) return res.status(422).json({ message: 'Title and slug required' });
  if (db.get('cms_pages', (p) => p.slug === slug)) {
    return res.status(422).json({ message: 'Slug already exists' });
  }
  res.status(201).json(db.insert('cms_pages', { title, slug, content: content || '', is_published: is_published !== false }));
});

router.put('/cms/:id', (req, res) => {
  const page = db.get('cms_pages', (p) => p.id === parseInt(req.params.id, 10));
  if (!page) return res.status(404).json({ message: 'Not found' });
  const { title, slug, content, is_published } = req.body || {};
  res.json(db.update('cms_pages', page.id, {
    title: title ?? page.title,
    slug: slug ?? page.slug,
    content: content ?? page.content,
    is_published: is_published !== undefined ? !!is_published : page.is_published,
  }));
});

router.delete('/cms/:id', (req, res) => {
  db.remove('cms_pages', (p) => p.id === parseInt(req.params.id, 10));
  res.json({ message: 'Deleted' });
});

router.get('/users', (_req, res) => {
  const rows = db.all('users', () => true).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json({
    data: rows.map((u) => ({
      id: u.id, email: u.email, name: u.name, role: u.role, phone_number: u.phone_number, is_active: !!u.is_active, created_at: u.created_at,
    })),
  });
});

router.patch('/users/:id', (req, res) => {
  const user = db.get('users', (u) => u.id === parseInt(req.params.id, 10));
  if (!user) return res.status(404).json({ message: 'Not found' });
  const updated = db.update('users', user.id, { is_active: !!req.body?.is_active });
  res.json({ id: updated.id, email: updated.email, name: updated.name, role: updated.role, is_active: !!updated.is_active });
});

export default router;
