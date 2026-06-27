import { Outlet } from 'react-router-dom';
import { LayoutDashboard, User, GraduationCap, Briefcase, FileText, Calendar, Settings } from 'lucide-react';
import PortalShell from '@/components/PortalShell';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/profile', icon: User },
  { label: 'Qualifications', path: '/profile/qualifications', icon: GraduationCap },
  { label: 'Experience', path: '/profile/experience', icon: Briefcase },
  { label: 'Documents', path: '/profile/documents', icon: FileText },
  { label: 'My Events', path: '/my-events', icon: Calendar },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function ScholarPortalLayout() {
  return (
    <PortalShell title="Scholar Portal" navItems={navItems}>
      <Outlet />
    </PortalShell>
  );
}
