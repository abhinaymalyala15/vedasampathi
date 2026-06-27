import { Router } from 'express';
import {
  db,
  formatEvent,
  formatScholarFull,
  getScholarByUserId,
  hashPassword,
  parseJson,
  verifyPassword,
} from '../db.js';
import { authRequired, requireRole } from '../middleware/auth.js';
import { upload } from '../upload.js';

const router = Router();
router.use(authRequired, requireRole('scholar', 'admin'));

function getScholar(req) {
  return getScholarByUserId(req.user.id);
}

router.get('/profile', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Scholar profile not found' });
  res.json(formatScholarFull(scholar));
});

router.put('/profile', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Scholar profile not found' });
  const b = req.body || {};
  db.update('scholars', scholar.id, {
    full_name: b.full_name || b.name || scholar.full_name,
    bio: b.bio ?? scholar.bio,
    city: b.city ?? scholar.city,
    state: b.state ?? scholar.state,
    photo: b.photo || b.profile_photo_url || scholar.photo,
    profile_photo_url: b.profile_photo_url || b.photo || scholar.profile_photo_url,
    primary_veda: b.primary_veda ?? scholar.primary_veda,
    shakha: b.shakha ?? scholar.shakha,
    years_of_study: b.years_of_study ?? scholar.years_of_study,
    current_level: b.current_level ?? scholar.current_level,
    pathasala_name: b.pathasala_name ?? scholar.pathasala_name,
    pathasala_location: b.pathasala_location ?? scholar.pathasala_location,
    guru_name: b.guru_name ?? scholar.guru_name,
    sampradaya: b.sampradaya ?? scholar.sampradaya,
    specialisations: b.specialisations ?? scholar.specialisations,
    languages: b.languages ?? scholar.languages,
  });
  if (b.full_name || b.name) db.update('users', req.user.id, { name: b.full_name || b.name });
  res.json(formatScholarFull(getScholarByUserId(req.user.id)));
});

router.get('/qualifications', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  res.json(db.all('qualifications', (q) => q.scholar_id === scholar.id));
});

router.post('/qualifications', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  const { degree, institution, year, description } = req.body || {};
  if (!degree) return res.status(422).json({ message: 'Degree is required' });
  res.status(201).json(db.insert('qualifications', {
    scholar_id: scholar.id, degree, institution: institution || null, year: year || null, description: description || null,
  }));
});

router.put('/qualifications/:id', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  const row = db.get('qualifications', (q) => q.id === parseInt(req.params.id, 10) && q.scholar_id === scholar.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  const { degree, institution, year, description } = req.body || {};
  res.json(db.update('qualifications', row.id, { degree, institution, year, description }));
});

router.delete('/qualifications/:id', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  db.remove('qualifications', (q) => q.id === parseInt(req.params.id, 10) && q.scholar_id === scholar.id);
  res.json({ message: 'Deleted' });
});

router.get('/experiences', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  res.json(db.all('experiences', (e) => e.scholar_id === scholar.id));
});

router.post('/experiences', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  const { role, organisation, from_year, to_year, description } = req.body || {};
  if (!role) return res.status(422).json({ message: 'Role is required' });
  res.status(201).json(db.insert('experiences', {
    scholar_id: scholar.id, role, organisation: organisation || null, from_year: from_year || null, to_year: to_year || null, description: description || null,
  }));
});

router.put('/experiences/:id', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  const row = db.get('experiences', (e) => e.id === parseInt(req.params.id, 10) && e.scholar_id === scholar.id);
  if (!row) return res.status(404).json({ message: 'Not found' });
  const { role, organisation, from_year, to_year, description } = req.body || {};
  res.json(db.update('experiences', row.id, { role, organisation, from_year, to_year, description }));
});

router.delete('/experiences/:id', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  db.remove('experiences', (e) => e.id === parseInt(req.params.id, 10) && e.scholar_id === scholar.id);
  res.json({ message: 'Deleted' });
});

router.get('/documents', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  res.json(db.all('documents', (d) => d.scholar_id === scholar.id));
});

router.post('/documents', upload.single('file'), (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  const baseUrl = process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 8001}`;
  let fileUrl = req.body?.file_url;
  if (req.file) fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
  if (!fileUrl) return res.status(422).json({ message: 'File required' });
  const { title, type } = req.body || {};
  res.status(201).json(db.insert('documents', {
    scholar_id: scholar.id, title: title || 'Document', file_url: fileUrl, type: type || 'certificate',
  }));
});

router.delete('/documents/:id', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  db.remove('documents', (d) => d.id === parseInt(req.params.id, 10) && d.scholar_id === scholar.id);
  res.json({ message: 'Deleted' });
});

router.get('/events', (req, res) => {
  const subs = db.all('event_subscriptions', (s) => s.user_id === req.user.id);
  const events = subs.map((s) => db.get('events', (e) => e.id === s.event_id)).filter(Boolean);
  res.json(events.map((r) => formatEvent(r, req.user.id)));
});

router.get('/dashboard', (req, res) => {
  const scholar = getScholar(req);
  if (!scholar) return res.status(404).json({ message: 'Not found' });
  res.json({
    status: scholar.status,
    profile_complete: !!(scholar.bio && scholar.photo),
    qualifications_count: db.count('qualifications', (q) => q.scholar_id === scholar.id),
    experiences_count: db.count('experiences', (e) => e.scholar_id === scholar.id),
    documents_count: db.count('documents', (d) => d.scholar_id === scholar.id),
    events_count: db.count('event_subscriptions', (s) => s.user_id === req.user.id),
    certificate_urls: parseJson(scholar.certificate_urls, []),
  });
});

router.put('/settings', (req, res) => {
  const { current_password, password, password_confirmation } = req.body || {};
  if (password) {
    if (!current_password || !verifyPassword(current_password, req.user.password_hash)) {
      return res.status(422).json({ message: 'Current password is incorrect' });
    }
    if (password !== password_confirmation) {
      return res.status(422).json({ message: 'Password confirmation does not match' });
    }
    db.update('users', req.user.id, { password_hash: hashPassword(password) });
  }
  res.json({ message: 'Settings updated' });
});

export default router;
