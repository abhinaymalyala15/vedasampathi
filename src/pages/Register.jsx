import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/api/apiClient';
import { toast } from 'sonner';
import {
  User, Mail, Phone, Lock, Key, HelpCircle, ArrowRight, ArrowLeft,
  CheckCircle2, BookOpen, School, Users, Upload, Eye, Calendar,
  MapPin, Star, FileText, Loader2
} from 'lucide-react';

/* ── Constants ─────────────────────────────────────────────────── */
const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "In what city were you born?",
  "What was the name of your first school?",
  "What is your favorite book?",
  "What is the name of your childhood best friend?",
];

const VEDAS = ['Rigveda', 'Yajurveda', 'Samaveda', 'Atharvaveda'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Graduate', 'Post-Graduate'];
const STUDY_STATUS = ['studying', 'graduated', 'other'];

const STEPS = [
  { label: 'Personal Details',    icon: User },
  { label: 'Password & Security', icon: Lock },
  { label: 'Veda Branch',         icon: BookOpen },
  { label: 'Pathasala',           icon: School },
  { label: 'Guru Lineage',        icon: Users },
  { label: 'Certificates',        icon: Upload },
  { label: 'Verify & Submit',     icon: Eye },
];

/* ── Helper components ──────────────────────────────────────────── */
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-primary mb-1.5">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 rounded-2xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-sm transition-all';
const iconInputCls = 'w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-sm transition-all';

/* ── Main Component ─────────────────────────────────────────────── */
export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const certInputRef = useRef(null);

  // Step 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [userState, setUserState] = useState('');

  // Step 2
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [otp, setOtp] = useState('');
  const [testOtp, setTestOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [q1, setQ1] = useState(SECURITY_QUESTIONS[0]);
  const [a1, setA1] = useState('');
  const [q2, setQ2] = useState(SECURITY_QUESTIONS[1]);
  const [a2, setA2] = useState('');

  // Step 3
  const [primaryVeda, setPrimaryVeda] = useState('');
  const [shakha, setShakha] = useState('');
  const [yearsStudy, setYearsStudy] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');

  // Step 4
  const [pathasalaName, setPathasalaName] = useState('');
  const [pathasalaLoc, setPathasalaLoc] = useState('');
  const [enrollYear, setEnrollYear] = useState('');
  const [studyStatus, setStudyStatus] = useState('');

  // Step 5
  const [guruName, setGuruName] = useState('');
  const [paramGuru, setParamGuru] = useState('');
  const [sampradaya, setSampradaya] = useState('');
  const [guruLocation, setGuruLocation] = useState('');

  // Step 6
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [certificateUrls, setCertificateUrls] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);

  /* ── OTP handlers ─────────────────────────────────────────────── */
  const handleSendOtp = async () => {
    if (!phone) { toast.error('Please enter your phone number first.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { phone_number: phone });
      toast.success('OTP sent to your phone!');
      if (res?.otp) {
        setTestOtp(res.otp);
        toast.info('Local Testing OTP: ' + res.otp, { duration: 10000 });
      }
      setOtpSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP. Number may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) { toast.error('Please enter the OTP.'); return; }
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { phone_number: phone, otp });
      toast.success('Phone verified!');
      setOtpVerified(true);
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  /* ── File upload handlers ─────────────────────────────────────── */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.postForm('/auth/upload', form);
      setProfilePhotoUrl(res.url || res.file_url);
      toast.success('Profile photo uploaded!');
    } catch {
      toast.error('Photo upload failed.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCertUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (certificateUrls.length + files.length > 5) { toast.error('Max 5 certificates.'); return; }
    setUploadingCert(true);
    try {
      const urls = [];
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
        const res = await api.postForm('/auth/upload', form);
        urls.push(res.url || res.file_url);
      }
      setCertificateUrls(prev => [...prev, ...urls]);
      toast.success(urls.length + ' certificate(s) uploaded!');
    } catch {
      toast.error('Certificate upload failed.');
    } finally {
      setUploadingCert(false);
    }
  };

  /* ── Step validation ──────────────────────────────────────────── */
  const canProceed = () => {
    if (step === 1) {
      if (!name.trim() || !email.trim() || !phone.trim()) {
        toast.error('Full name, email and phone are required.'); return false;
      }
      return true;
    }
    if (step === 2) {
      if (!otpVerified) { toast.error('Please verify your phone number first.'); return false; }
      if (!password || password.length < 8) { toast.error('Password must be at least 8 characters.'); return false; }
      if (password !== confirmPwd) { toast.error('Passwords do not match.'); return false; }
      if (!a1.trim() || !a2.trim()) { toast.error('Please answer both security questions.'); return false; }
      if (q1 === q2) { toast.error('Please choose two different security questions.'); return false; }
      return true;
    }
    return true;
  };

  const next = () => { if (canProceed()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  /* ── Final submit ─────────────────────────────────────────────── */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name, email, phone_number: phone,
        date_of_birth: dob || undefined,
        gender: gender || undefined,
        city: city || undefined,
        state: userState || undefined,
        password,
        password_confirmation: confirmPwd,
        security_question_1: q1, security_answer_1: a1,
        security_question_2: q2, security_answer_2: a2,
        primary_veda: primaryVeda || undefined,
        shakha: shakha || undefined,
        years_of_study: yearsStudy ? Number(yearsStudy) : undefined,
        current_level: currentLevel || undefined,
        pathasala_name: pathasalaName || undefined,
        pathasala_location: pathasalaLoc || undefined,
        enrollment_year: enrollYear || undefined,
        study_status: studyStatus || undefined,
        guru_name: guruName || undefined,
        param_guru: paramGuru || undefined,
        sampradaya: sampradaya || undefined,
        guru_location: guruLocation || undefined,
        profile_photo_url: profilePhotoUrl || undefined,
        certificate_urls: certificateUrls.length ? certificateUrls : undefined,
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ───────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="premium-card p-10 md:p-12 text-center">
            <div className="w-20 h-20 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-primary mb-3">Application Submitted!</h1>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Your scholar application has been received. Our admin team will review your details
              and <strong>approve your account</strong> shortly.
              You will be able to log in after approval.
            </p>
            <div className="bg-secondary/10 rounded-xl p-4 text-sm text-secondary font-medium mb-6 border border-secondary/20">
              Registered email: <span className="font-bold">{email}</span>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-all"
            >
              Go to Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Review helpers ───────────────────────────────────────────── */
  const ReviewRow = ({ label, value }) =>
    value ? (
      <div className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-primary text-right max-w-xs truncate">{value}</span>
      </div>
    ) : null;

  const ReviewSection = ({ title, icon: Icon, children }) => (
    <div className="bg-muted/40 rounded-xl p-4 mb-3">
      <h4 className="flex items-center gap-1.5 text-sm font-bold text-primary mb-3">
        <Icon className="w-4 h-4 text-secondary" /> {title}
      </h4>
      {children}
    </div>
  );

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="w-full max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary mb-1">Scholar Registration</h1>
          <p className="text-muted-foreground text-sm">Join the Vedasampatti community — Step {step} of {STEPS.length}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-start justify-between mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const num = i + 1;
            const Icon = s.icon;
            const done = step > num;
            const active = step === num;
            return (
              <div key={num} className="flex flex-col items-center flex-1 min-w-0">
                <div className="flex items-center w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                    done ? 'bg-secondary text-secondary-foreground' :
                    active ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 transition-all ${done ? 'bg-secondary' : 'bg-border'}`} />
                  )}
                </div>
                <span className={`text-[10px] mt-1 text-center leading-tight ${active ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="premium-card p-6 md:p-8">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <User className="w-4 h-4 text-secondary" /> Step 1: Personal Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input className={iconInputCls} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ramesh Sharma" />
                  </div>
                </Field>
                <Field label="Email Address" required>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" className={iconInputCls} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                </Field>
                <Field label="Phone Number" required>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="tel" className={iconInputCls} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+919876543210" />
                  </div>
                </Field>
                <Field label="Date of Birth">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="date" className={iconInputCls} value={dob} onChange={e => setDob(e.target.value)} />
                  </div>
                </Field>
                <Field label="Gender">
                  <select className={inputCls} value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </Field>
                <Field label="City">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input className={iconInputCls} value={city} onChange={e => setCity(e.target.value)} placeholder="Chennai" />
                  </div>
                </Field>
                <Field label="State">
                  <input className={inputCls} value={userState} onChange={e => setUserState(e.target.value)} placeholder="Tamil Nadu" />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <Lock className="w-4 h-4 text-secondary" /> Step 2: Password & Security
              </h2>

              {/* OTP */}
              <div className="bg-muted/40 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-secondary" /> Phone Verification
                </p>
                <p className="text-xs text-muted-foreground">Verifying: <strong>{phone}</strong></p>
                {!otpVerified ? (
                  <>
                    {!otpSent ? (
                      <button onClick={handleSendOtp} disabled={loading}
                        className="text-sm bg-secondary text-secondary-foreground font-semibold px-4 py-2 rounded-lg hover:bg-secondary/90 disabled:opacity-50 flex items-center gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Send OTP
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                            placeholder="6-digit OTP"
                            className="flex-1 text-center tracking-widest font-bold text-lg py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          <button onClick={handleVerifyOtp} disabled={loading}
                            className="bg-secondary text-secondary-foreground font-semibold text-sm px-4 py-2 rounded-xl hover:bg-secondary/90 disabled:opacity-50">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                          </button>
                        </div>
                        {testOtp && (
                          <div className="text-xs bg-secondary/10 rounded-lg p-2 text-secondary">
                            Dev OTP: <span className="font-bold select-all">{testOtp}</span>
                          </div>
                        )}
                        <button onClick={handleSendOtp} disabled={loading}
                          className="text-xs text-muted-foreground hover:text-primary underline">
                          Resend OTP
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-secondary text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Phone verified!
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Password" required>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="password" className={iconInputCls} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" />
                  </div>
                </Field>
                <Field label="Confirm Password" required>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="password" className={iconInputCls} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Repeat password" />
                  </div>
                </Field>
              </div>

              {/* Security Questions */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-secondary" /> Security Questions
                </p>
                {[
                  { q: q1, setQ: setQ1, a: a1, setA: setA1, other: q2, num: 1 },
                  { q: q2, setQ: setQ2, a: a2, setA: setA2, other: q1, num: 2 },
                ].map(({ q, setQ, a, setA, other, num }) => (
                  <div key={num} className="bg-muted/30 rounded-xl p-3 space-y-2">
                    <label className="text-xs font-semibold text-primary">Question {num}</label>
                    <select value={q} onChange={e => setQ(e.target.value)} className={inputCls}>
                      {SECURITY_QUESTIONS.map(sq => (
                        <option key={sq} value={sq} disabled={sq === other}>{sq}</option>
                      ))}
                    </select>
                    <input value={a} onChange={e => setA(e.target.value)} placeholder="Your answer" className={inputCls} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <BookOpen className="w-4 h-4 text-secondary" /> Step 3: Veda Branch
              </h2>
              <p className="text-xs text-muted-foreground">Optional — helps us match you with the right community.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Primary Veda">
                  <select className={inputCls} value={primaryVeda} onChange={e => setPrimaryVeda(e.target.value)}>
                    <option value="">Select Veda</option>
                    {VEDAS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Shakha / Branch">
                  <input className={inputCls} value={shakha} onChange={e => setShakha(e.target.value)} placeholder="e.g. Shukla Yajurveda" />
                </Field>
                <Field label="Years of Study">
                  <input type="number" min={0} max={50} className={inputCls} value={yearsStudy} onChange={e => setYearsStudy(e.target.value)} placeholder="e.g. 5" />
                </Field>
                <Field label="Current Level">
                  <select className={inputCls} value={currentLevel} onChange={e => setCurrentLevel(e.target.value)}>
                    <option value="">Select level</option>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <School className="w-4 h-4 text-secondary" /> Step 4: Pathasala Details
              </h2>
              <p className="text-xs text-muted-foreground">Details about the institution where you studied or are currently studying.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Pathasala Name">
                  <input className={inputCls} value={pathasalaName} onChange={e => setPathasalaName(e.target.value)} placeholder="e.g. Sri Veda Paatashaala" />
                </Field>
                <Field label="Pathasala Location">
                  <input className={inputCls} value={pathasalaLoc} onChange={e => setPathasalaLoc(e.target.value)} placeholder="City, State" />
                </Field>
                <Field label="Enrollment Year">
                  <input type="number" min={1900} max={new Date().getFullYear()} className={inputCls} value={enrollYear} onChange={e => setEnrollYear(e.target.value)} placeholder="e.g. 2015" />
                </Field>
                <Field label="Study Status">
                  <select className={inputCls} value={studyStatus} onChange={e => setStudyStatus(e.target.value)}>
                    <option value="">Select status</option>
                    {STUDY_STATUS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <Users className="w-4 h-4 text-secondary" /> Step 5: Guru Lineage
              </h2>
              <p className="text-xs text-muted-foreground">Help us understand your gurukula tradition and lineage.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Primary Guru Name">
                  <input className={inputCls} value={guruName} onChange={e => setGuruName(e.target.value)} placeholder="e.g. Pandit Shriram Sharma" />
                </Field>
                <Field label="Param-Guru (Guru's Guru)">
                  <input className={inputCls} value={paramGuru} onChange={e => setParamGuru(e.target.value)} placeholder="Optional" />
                </Field>
                <Field label="Sampradaya / Tradition">
                  <input className={inputCls} value={sampradaya} onChange={e => setSampradaya(e.target.value)} placeholder="e.g. Smartha, Vaishnava" />
                </Field>
                <Field label="Guru's Location">
                  <input className={inputCls} value={guruLocation} onChange={e => setGuruLocation(e.target.value)} placeholder="City, State" />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <Upload className="w-4 h-4 text-secondary" /> Step 6: Certificates & Photo
              </h2>
              <p className="text-xs text-muted-foreground">Upload your profile photo and any certificates/documents. Max 5 files.</p>

              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Profile Photo</label>
                <div onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all">
                  {profilePhotoUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={profilePhotoUrl} alt="Profile" className="w-24 h-24 object-cover rounded-full border-2 border-secondary" />
                      <span className="text-xs text-secondary font-semibold">Photo uploaded (click to replace)</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      {uploadingPhoto ? <Loader2 className="w-8 h-8 animate-spin" /> : <User className="w-8 h-8" />}
                      <span className="text-sm">{uploadingPhoto ? 'Uploading...' : 'Click to upload profile photo'}</span>
                      <span className="text-xs">JPG, PNG (max 5MB)</span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>

              {/* Certificates */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Certificates & Documents <span className="text-muted-foreground font-normal">({certificateUrls.length}/5)</span>
                </label>
                <div onClick={() => certInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all">
                  {uploadingCert ? (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <FileText className="w-7 h-7" />
                      <span className="text-sm">Click to upload certificates</span>
                      <span className="text-xs">PDF, JPG, PNG</span>
                    </div>
                  )}
                </div>
                <input ref={certInputRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleCertUpload} />
                {certificateUrls.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {certificateUrls.map((url, i) => (
                      <div key={i} className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2 text-xs">
                        <span className="flex items-center gap-1.5 text-secondary font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Certificate {i + 1}
                        </span>
                        <button onClick={() => setCertificateUrls(prev => prev.filter((_, j) => j !== i))}
                          className="text-destructive hover:underline">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 7 */}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-primary flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <Eye className="w-4 h-4 text-secondary" /> Step 7: Review & Submit
              </h2>
              <p className="text-xs text-muted-foreground mb-2">
                Please review your information. After submitting, an admin will verify and approve your account.
              </p>

              <ReviewSection title="Personal Details" icon={User}>
                <ReviewRow label="Name" value={name} />
                <ReviewRow label="Email" value={email} />
                <ReviewRow label="Phone" value={phone} />
                <ReviewRow label="Date of Birth" value={dob} />
                <ReviewRow label="Gender" value={gender} />
                <ReviewRow label="City" value={city} />
                <ReviewRow label="State" value={userState} />
              </ReviewSection>

              <ReviewSection title="Veda Branch" icon={BookOpen}>
                <ReviewRow label="Primary Veda" value={primaryVeda || 'Not provided'} />
                <ReviewRow label="Shakha" value={shakha} />
                <ReviewRow label="Years of Study" value={yearsStudy} />
                <ReviewRow label="Level" value={currentLevel} />
              </ReviewSection>

              <ReviewSection title="Pathasala" icon={School}>
                <ReviewRow label="Pathasala" value={pathasalaName || 'Not provided'} />
                <ReviewRow label="Location" value={pathasalaLoc} />
                <ReviewRow label="Enrollment Year" value={enrollYear} />
                <ReviewRow label="Status" value={studyStatus} />
              </ReviewSection>

              <ReviewSection title="Guru Lineage" icon={Users}>
                <ReviewRow label="Guru" value={guruName || 'Not provided'} />
                <ReviewRow label="Param-Guru" value={paramGuru} />
                <ReviewRow label="Sampradaya" value={sampradaya} />
                <ReviewRow label="Guru Location" value={guruLocation} />
              </ReviewSection>

              <ReviewSection title="Uploads" icon={Upload}>
                <ReviewRow label="Profile Photo" value={profilePhotoUrl ? 'Uploaded' : 'Not uploaded'} />
                <ReviewRow label="Certificates" value={certificateUrls.length ? certificateUrls.length + ' file(s)' : 'None'} />
              </ReviewSection>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                After submitting, your application will be reviewed by admin. You cannot log in until your account is approved.
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className={`flex gap-3 mt-8 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
            {step > 1 && (
              <button onClick={back}
                className="flex items-center gap-1.5 border border-border text-primary font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-muted transition-all">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 7 ? (
              <button onClick={next}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground font-bold text-sm px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground font-bold text-sm px-8 py-3 rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50 shadow-lg">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}