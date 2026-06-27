
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicLayout from '@/components/PublicLayout';
import ScholarPortalLayout from '@/components/ScholarPortalLayout';
import PathasalaPortalLayout from '@/components/PathasalaPortalLayout';
import AdminLayout from '@/components/AdminLayout';
// Static pages
import VedasPage from './pages/static/VedasPage';
import UpanishadsPage from './pages/static/UpanishadsPage';
import PuranasPage from './pages/static/PuranasPage';
import RitualsPage from './pages/static/RitualsPage';
import YagasPage from './pages/static/YagasPage';
import MantrasPage from './pages/static/MantrasPage';
import GalleryPage from './pages/static/GalleryPage';
import NewsPage from './pages/static/NewsPage';
// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Scholars from './pages/Scholars';
import ScholarDetail from './pages/ScholarDetail';
import Pathasalas from './pages/Pathasalas';
import PathasalaDetail from './pages/PathasalaDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import CMSPage from './pages/CMSPage';
// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// Scholar portal
import ScholarDashboard from './pages/scholar/Dashboard';
import ScholarProfile from './pages/scholar/Profile';
import ScholarQualifications from './pages/scholar/Qualifications';
import ScholarExperience from './pages/scholar/Experience';
import ScholarDocuments from './pages/scholar/Documents';
import ScholarMyEvents from './pages/scholar/MyEvents';
import ScholarSettings from './pages/scholar/Settings';
// Pathasala portal
import PathasalaDashboard from './pages/pathasala/Dashboard';
import PathasalaDetails from './pages/pathasala/Details';
import PathasalaFaculty from './pages/pathasala/Faculty';
import PathasalaGallery from './pages/pathasala/Gallery';
import PathasalaEvents from './pages/pathasala/Events';
// Admin panel
import AdminDashboard from './pages/admin/Dashboard';
import AdminApprovals from './pages/admin/Approvals';
import AdminEvents from './pages/admin/Events';
import AdminDonations from './pages/admin/Donations';
import AdminCMS from './pages/admin/CMS';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Public website with navbar + footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/scholars" element={<Scholars />} />
        <Route path="/scholars/:id" element={<ScholarDetail />} />
        <Route path="/pathasalas" element={<Pathasalas />} />
        <Route path="/pathasalas/:id" element={<PathasalaDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pages/vedas" element={<VedasPage />} />
        <Route path="/pages/upanishads" element={<UpanishadsPage />} />
        <Route path="/pages/puranas" element={<PuranasPage />} />
        <Route path="/pages/rituals" element={<RitualsPage />} />
        <Route path="/pages/yagas" element={<YagasPage />} />
        <Route path="/pages/mantras" element={<MantrasPage />} />
        <Route path="/pages/gallery" element={<GalleryPage />} />
        <Route path="/pages/news" element={<NewsPage />} />
        <Route path="/pages/:slug" element={<CMSPage />} />
      </Route>

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Scholar portal (auth required) */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<ScholarPortalLayout />}>
          <Route path="/dashboard" element={<ScholarDashboard />} />
          <Route path="/profile" element={<ScholarProfile />} />
          <Route path="/profile/qualifications" element={<ScholarQualifications />} />
          <Route path="/profile/experience" element={<ScholarExperience />} />
          <Route path="/profile/documents" element={<ScholarDocuments />} />
          <Route path="/my-events" element={<ScholarMyEvents />} />
          <Route path="/settings" element={<ScholarSettings />} />
        </Route>
      </Route>

      {/* Pathasala portal (auth required) */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<PathasalaPortalLayout />}>
          <Route path="/pathasala/dashboard" element={<PathasalaDashboard />} />
          <Route path="/pathasala/details" element={<PathasalaDetails />} />
          <Route path="/pathasala/faculty" element={<PathasalaFaculty />} />
          <Route path="/pathasala/gallery" element={<PathasalaGallery />} />
          <Route path="/pathasala/events" element={<PathasalaEvents />} />
        </Route>
      </Route>

      {/* Admin panel (auth required) */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/approvals" element={<AdminApprovals />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          <Route path="/admin/cms" element={<AdminCMS />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App