import { Outlet } from 'react-router-dom';
import { LayoutDashboard, UserCheck, CalendarDays, IndianRupee, FileText, Users, Settings } from 'lucide-react';
import PortalShell from '@/components/PortalShell';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Approvals', path: '/admin/approvals', icon: UserCheck },
  { label: 'Events', path: '/admin/events', icon: CalendarDays },
  { label: 'Donations', path: '/admin/donations', icon: IndianRupee },
  { label: 'CMS Pages', path: '/admin/cms', icon: FileText },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  return (
    <PortalShell title="Admin Panel" navItems={navItems}>
      <Outlet />
    </PortalShell>
  );
}
