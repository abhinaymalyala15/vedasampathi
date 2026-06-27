import { Router } from 'express';
import {
  db,
  formatEvent,
  formatPathasalaFull,
  getPathasalaByUserId,
  parseJson,
} from '../db.js';
import { authRequired, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(authRequired, requireRole('pathasala', 'admin'));

function getPathasala(req) {
  return getPathasalaByUserId(req.user.id);
}

router.get('/profile', (req, res) => {
  const p = getPathasala(req);
  if (!p) return res.status(404).json({ message: 'Pathasala profile not found' });
  res.json(formatPathasalaFull(p));
});

router.put('/profile', (req, res) => {
  const p = getPathasala(req);
  if (!p) return res.status(404).json({ message: 'Pathasala profile not found' });
  const b = req.body || {};
  db.update('pathasalas', p.id, {
    institution_name: b.institution_name ?? p.institution_name,
    address: b.address ?? p.address,
    city: b.city ?? p.city,
    state: b.state ?? p.state,
    pincode: b.pincode ?? p.pincode,
    description: b.description ?? p.description,
    contact_email: b.contact_email ?? p.contact_email,
    contact_phone: b.contact_phone ?? p.contact_phone,
    website: b.website ?? p.website,
    photo: b.photo ?? p.photo,
  });
  res.json(formatPathasalaFull(getPathasalaByUserId(req.user.id)));
});

router.get('/faculty', (req, res) => {
  const p = getPathasala(req);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(parseJson(p.faculty_json, []));
});

router.put('/faculty', (req, res) => {
  const p = getPathasala(req);
  if (!p) return res.status(404).json({ message: 'Not found' });
  const faculty = req.body?.faculty || [];
  db.update('pathasalas', p.id, { faculty_json: faculty });
  res.json(faculty);
});

router.get('/gallery', (req, res) => {
  const p = getPathasala(req);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(db.all('gallery_items', (g) => g.pathasala_id === p.id).sort((a, b) => b.id - a.id));
});

router.post('/gallery', (req, res) => {
  const p = getPathasala(req);
  if (!p) return res.status(404).json({ message: 'Not found' });
  const { image_url, caption } = req.body || {};
  if (!image_url) return res.status(422).json({ message: 'image_url required' });
  res.status(201).json(db.insert('gallery_items', { pathasala_id: p.id, image_url, caption: caption || null }));
});

router.delete('/gallery/:id', (req, res) => {
  const p = getPathasala(req);
  if (!p) return res.status(404).json({ message: 'Not found' });
  db.remove('gallery_items', (g) => g.id === parseInt(req.params.id, 10) && g.pathasala_id === p.id);
  res.json({ message: 'Deleted' });
});

router.get('/events', (req, res) => {
  const p = getPathasala(req);
  if (!p) return res.status(404).json({ message: 'Not found' });
  const rows = db.all('events', (e) => e.created_by_role === 'pathasala' && e.created_by_id === p.user_id);
  res.json(rows.sort((a, b) => (a.date || '').localeCompare(b.date || '')).map((r) => formatEvent(r)));
});

router.post('/events', (req, res) => {
  const p = getPathasala(req);
  if (!p) return res.status(404).json({ message: 'Not found' });
  const b = req.body || {};
  if (!b.title || !b.date || !b.location) {
    return res.status(422).json({ message: 'Title, date and location are required' });
  }
  res.status(201).json(formatEvent(db.insert('events', {
    title: b.title,
    description: b.description || null,
    date: b.date,
    time: b.time || null,
    location: b.location,
    event_type: b.event_type || 'offline',
    registration_link: b.registration_link || null,
    featured: false,
    created_by_role: 'pathasala',
    created_by_id: p.user_id,
  })));
});

router.delete('/events/:id', (req, res) => {
  const p = getPathasala(req);
  if (!p) return res.status(404).json({ message: 'Not found' });
  db.remove('events', (e) => e.id === parseInt(req.params.id, 10) && e.created_by_role === 'pathasala' && e.created_by_id === p.user_id);
  res.json({ message: 'Deleted' });
});

export default router;
