import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, Image, CalendarDays } from 'lucide-react';
import PortalShell from '@/components/PortalShell';

const navItems = [
  { label: 'Dashboard', path: '/pathasala/dashboard', icon: LayoutDashboard },
  { label: 'Details', path: '/pathasala/details', icon: Building2 },
  { label: 'Faculty', path: '/pathasala/faculty', icon: Users },
  { label: 'Gallery', path: '/pathasala/gallery', icon: Image },
  { label: 'Events', path: '/pathasala/events', icon: CalendarDays },
];

export default function PathasalaPortalLayout() {
  return (
    <PortalShell title="Pathasala Portal" navItems={navItems}>
      <Outlet />
    </PortalShell>
  );
}
