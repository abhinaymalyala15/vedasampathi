import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const LOGO_URL = 'https://media.base44.com/images/public/user_6a0f22d640b2c359109c75b9/7254333b3_ChatGPTImageJun15202608_36_50PM.png';

export default function PortalShell({ title, navItems, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-gradient-sacred z-50 transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="absolute inset-0 opacity-[0.04] sacred-pattern pointer-events-none" />

        <div className="relative flex items-center gap-3 p-6 border-b border-white/10">
          <img src={LOGO_URL} alt="" className="w-10 h-10 rounded-full ring-2 ring-secondary/40 object-cover" />
          <span className="font-heading text-lg font-bold text-primary-foreground">{title}</span>
        </div>

        <nav className="relative flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-secondary text-secondary-foreground shadow-glow'
                    : 'text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative p-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-primary-foreground/70 hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Back to Site
          </Link>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-300 hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-card/90 backdrop-blur-xl border-b border-border/40">
          <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading text-lg font-bold text-primary">{title}</span>
          <div className="w-10" />
        </div>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
