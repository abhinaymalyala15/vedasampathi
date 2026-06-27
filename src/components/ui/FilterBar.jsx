import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function FilterBar({ search, onSearchChange, searchPlaceholder, children }) {
  return (
    <div className="sticky top-[72px] lg:top-20 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-5">
      <div className="container-premium">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-11 rounded-full h-12 bg-card"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function FilterSelect({ value, onChange, children, className = '' }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`h-12 px-5 rounded-full border border-input bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all ${className}`}
    >
      {children}
    </select>
  );
}
