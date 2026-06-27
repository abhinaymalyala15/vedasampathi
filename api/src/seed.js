import { initDb, db, hashPassword, resetStore } from './db.js';

initDb();

if (db.count('users', () => true) > 0) {
  console.log('Database already seeded — skipping.');
  process.exit(0);
}

resetStore();
initDb();

const admin = db.insert('users', {
  email: 'admin@vedasampatti.org',
  password_hash: hashPassword('Admin@123'),
  role: 'admin',
  name: 'Portal Admin',
  phone_number: '+919999999999',
  is_active: true,
});

const scholarUser = db.insert('users', {
  email: 'scholar@vedasampatti.org',
  password_hash: hashPassword('Scholar@123'),
  role: 'scholar',
  name: 'Pandit Ramesh Sharma',
  phone_number: '+919876543210',
  is_active: true,
});

db.insert('scholars', {
  user_id: scholarUser.id,
  full_name: 'Pandit Ramesh Sharma',
  email: 'scholar@vedasampatti.org',
  phone_number: '+919876543210',
  city: 'Chennai',
  state: 'Tamil Nadu',
  bio: 'Dedicated Vedic scholar with over 15 years of study in Yajurveda traditions.',
  status: 'approved',
  primary_veda: 'Yajurveda',
  shakha: 'Shukla Yajurveda',
  years_of_study: 15,
  current_level: 'Advanced',
  guru_name: 'Sri Guru Venkateswara',
  sampradaya: 'Smartha',
  specialisations: ['Yajurveda', 'Rituals'],
  languages: ['Sanskrit', 'Telugu', 'Tamil'],
});

const scholar2User = db.insert('users', {
  email: 'lakshmi@vedasampatti.org',
  password_hash: hashPassword('Scholar@123'),
  role: 'scholar',
  name: 'Dr. Lakshmi Devi',
  phone_number: '+919876543211',
  is_active: true,
});

const scholar2 = db.insert('scholars', {
  user_id: scholar2User.id,
  full_name: 'Dr. Lakshmi Devi',
  email: 'lakshmi@vedasampatti.org',
  phone_number: '+919876543211',
  city: 'Hyderabad',
  state: 'Telangana',
  bio: 'Expert in Rigveda chanting and Vedic phonetics.',
  status: 'approved',
  primary_veda: 'Rigveda',
  current_level: 'Graduate',
  specialisations: ['Rigveda', 'Mantras'],
  languages: ['Sanskrit', 'Telugu'],
});

db.insert('qualifications', { scholar_id: scholar2.id, degree: 'Vidwan', institution: 'Sri Veda Pathasala', year: '2018', description: 'Advanced Vedic studies' });

const pathUser = db.insert('users', {
  email: 'pathasala@vedasampatti.org',
  password_hash: hashPassword('Pathasala@123'),
  role: 'pathasala',
  name: 'Sri Veda Pathasala',
  phone_number: '+919876543212',
  is_active: true,
});

db.insert('pathasalas', {
  user_id: pathUser.id,
  institution_name: 'Sri Veda Pathasala',
  address: '12 Temple Road',
  city: 'Kanchipuram',
  state: 'Tamil Nadu',
  pincode: '631501',
  description: 'A traditional institution preserving Vedic oral traditions since 1952.',
  contact_email: 'pathasala@vedasampatti.org',
  contact_phone: '+919876543212',
  website: 'https://vedasampatti.org',
  status: 'approved',
  faculty_json: [{ name: 'Sri Venkatacharya', role: 'Senior Guru', bio: '40 years of teaching experience' }],
});

[
  ['Vedic Chanting Workshop', 'Learn traditional Vedic chanting techniques from certified scholars.', '2026-07-15', '09:00 AM', 'Chennai', 'offline', true],
  ['Guru Purnima Celebration', 'Annual celebration honoring Vedic gurus and scholars.', '2026-07-20', '06:00 PM', 'Kanchipuram', 'offline', true],
  ['Online Upanishad Study', 'Weekly study session on principal Upanishads.', '2026-07-10', '07:00 PM', 'Online', 'online', false],
  ['Pathasala Open Day', 'Visit traditional Vedic schools and meet scholars.', '2026-08-05', '10:00 AM', 'Hyderabad', 'offline', false],
].forEach(([title, description, date, time, location, event_type, featured]) => {
  db.insert('events', { title, description, date, time, location, event_type, featured, created_by_role: 'admin', created_by_id: null });
});

db.insert('cms_pages', {
  title: 'Privacy Policy',
  slug: 'privacy-policy',
  content: 'Your privacy is important to us. This page will be updated by the admin team.',
  is_published: true,
});

console.log('Seed complete.');
console.log('Admin:     admin@vedasampatti.org / Admin@123');
console.log('Scholar:   scholar@vedasampatti.org / Scholar@123');
console.log('Pathasala: pathasala@vedasampatti.org / Pathasala@123');
