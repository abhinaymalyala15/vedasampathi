import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const uploadsDir = path.join(__dirname, '..', 'uploads');
const storePath = path.join(dataDir, 'store.json');

[dataDir, uploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

export { uploadsDir };

const emptyStore = () => ({
  users: [],
  scholars: [],
  pathasalas: [],
  qualifications: [],
  experiences: [],
  documents: [],
  events: [],
  event_subscriptions: [],
  gallery_items: [],
  donations: [],
  contacts: [],
  cms_pages: [],
  otp_codes: [],
  password_resets: [],
  _counters: {},
});

let store = emptyStore();

function loadStore() {
  if (fs.existsSync(storePath)) {
    try {
      store = { ...emptyStore(), ...JSON.parse(fs.readFileSync(storePath, 'utf8')) };
    } catch {
      store = emptyStore();
    }
  }
}

function saveStore() {
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

export function initDb() {
  loadStore();
}

export function resetStore() {
  store = emptyStore();
  saveStore();
}

function nextId(table) {
  store._counters[table] = (store._counters[table] || 0) + 1;
  saveStore();
  return store._counters[table];
}

export const db = {
  all(table, filter = () => true) {
    return (store[table] || []).filter(filter);
  },
  get(table, filter) {
    return (store[table] || []).find(filter);
  },
  insert(table, row) {
    const id = nextId(table);
    const record = { ...row, id, created_at: row.created_at || new Date().toISOString() };
    store[table].push(record);
    saveStore();
    return record;
  },
  update(table, id, patch) {
    const idx = store[table].findIndex((r) => r.id === id);
    if (idx === -1) return null;
    store[table][idx] = { ...store[table][idx], ...patch };
    saveStore();
    return store[table][idx];
  },
  remove(table, filter) {
    const before = store[table].length;
    store[table] = store[table].filter((r) => !filter(r));
    if (store[table].length !== before) saveStore();
  },
  count(table, filter = () => true) {
    return db.all(table, filter).length;
  },
  sum(table, field, filter = () => true) {
    return db.all(table, filter).reduce((acc, r) => acc + (Number(r[field]) || 0), 0);
  },
};

export function parseJson(value, fallback = null) {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    full_name: row.name,
    role: row.role,
    phone_number: row.phone_number,
    is_active: !!row.is_active,
  };
}

export function formatScholarPublic(row) {
  if (!row) return null;
  const specs = parseJson(row.specialisations, []);
  if (!specs.length && row.primary_veda) specs.push(row.primary_veda);
  return {
    id: row.id,
    user_id: row.user_id,
    full_name: row.full_name,
    photo: row.photo || row.profile_photo_url,
    profile_photo_url: row.profile_photo_url,
    city: row.city,
    state: row.state,
    specialisations: specs,
    languages: parseJson(row.languages, ['Sanskrit', 'Telugu']),
    primary_veda: row.primary_veda,
    current_level: row.current_level,
    status: row.status,
  };
}

export function formatScholarFull(row) {
  if (!row) return null;
  const base = formatScholarPublic(row);
  const qualifications = db.all('qualifications', (q) => q.scholar_id === row.id);
  const experiences = db.all('experiences', (e) => e.scholar_id === row.id);
  const documents = db.all('documents', (d) => d.scholar_id === row.id);
  return {
    ...base,
    bio: row.bio,
    email: row.email,
    phone_number: row.phone_number,
    date_of_birth: row.date_of_birth,
    gender: row.gender,
    shakha: row.shakha,
    years_of_study: row.years_of_study,
    pathasala_name: row.pathasala_name,
    pathasala_location: row.pathasala_location,
    enrollment_year: row.enrollment_year,
    study_status: row.study_status,
    guru_name: row.guru_name,
    param_guru: row.param_guru,
    sampradaya: row.sampradaya,
    guru_location: row.guru_location,
    certificate_urls: parseJson(row.certificate_urls, []),
    qualifications,
    experiences,
    documents,
  };
}

export function formatPathasalaPublic(row) {
  if (!row) return null;
  return {
    id: row.id,
    user_id: row.user_id,
    institution_name: row.institution_name,
    photo: row.photo,
    city: row.city,
    state: row.state,
    address: row.address,
    description: row.description,
    contact_email: row.contact_email,
    contact_phone: row.contact_phone,
    website: row.website,
    status: row.status,
  };
}

export function formatPathasalaFull(row) {
  if (!row) return null;
  return {
    ...formatPathasalaPublic(row),
    pincode: row.pincode,
    faculty: parseJson(row.faculty_json, []),
  };
}

export function formatEvent(row, userId = null) {
  if (!row) return null;
  const isSubscribed = userId
    ? db.all('event_subscriptions', (s) => s.user_id === userId && s.event_id === row.id).length > 0
    : false;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    time: row.time,
    location: row.location,
    event_type: row.event_type,
    featured: !!row.featured,
    registration_link: row.registration_link,
    image: row.image,
    created_by_role: row.created_by_role,
    created_by_id: row.created_by_id,
    is_subscribed: isSubscribed,
  };
}

export function getScholarByUserId(userId) {
  return db.get('scholars', (s) => s.user_id === userId);
}

export function getPathasalaByUserId(userId) {
  return db.get('pathasalas', (p) => p.user_id === userId);
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
