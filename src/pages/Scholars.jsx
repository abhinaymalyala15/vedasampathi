import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { MapPin, Lock, Award, Languages } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import FilterBar, { FilterSelect } from '@/components/ui/FilterBar';
import EmptyState from '@/components/ui/EmptyState';
import { ScholarCardSkeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function Scholars() {
  const [search, setSearch] = useState('');
  const [specialisation, setSpecialisation] = useState('all');

  const { data: res = {}, isLoading } = useQuery({
    queryKey: ['scholars', 'directory'],
    queryFn: () => api.get('/scholars?per_page=100'),
  });
  const scholars = res?.data ?? [];

  const allSpecialisations = useMemo(() => {
    const set = new Set();
    scholars.forEach((s) => s.specialisations?.forEach((sp) => set.add(sp)));
    return Array.from(set);
  }, [scholars]);

  const filtered = useMemo(() => {
    return scholars.filter((s) => {
      const matchSearch =
        !search ||
        s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.city?.toLowerCase().includes(search.toLowerCase());
      const matchSpec = specialisation === 'all' || s.specialisations?.includes(specialisation);
      return matchSearch && matchSpec;
    });
  }, [scholars, search, specialisation]);

  return (
    <div>
      <PageHeader
        badge="Directory"
        title="Scholar Directory"
        subtitle="Discover verified Vedic scholars across India"
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or city..."
      >
        <FilterSelect
          value={specialisation}
          onChange={(e) => setSpecialisation(e.target.value)}
          className="sm:min-w-[220px]"
        >
          <option value="all">All Specialisations</option>
          {allSpecialisations.map((sp) => (
            <option key={sp} value={sp}>{sp}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      <div className="py-section-sm bg-background">
        <div className="container-premium">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => <ScholarCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              variant="scholars"
              title="No Scholars Found"
              description="No scholars match your search criteria. Try adjusting your filters."
              actionLabel="Clear Search"
              onAction={() => { setSearch(''); setSpecialisation('all'); }}
            />
          ) : (
            <motion.div
              {...staggerContainer(0.06)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((scholar) => (
                <motion.div key={scholar.id} variants={staggerItem}>
                  <Link
                    to={`/scholars/${scholar.id}`}
                    className="group block premium-card overflow-hidden h-full hover:shadow-glow-gold"
                  >
                    <div className="p-6 text-center">
                      <div className="w-24 h-24 rounded-[20px] mx-auto mb-4 overflow-hidden ring-2 ring-border/40 group-hover:ring-secondary/50 transition-all shadow-premium">
                        <img
                          src={scholar.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(scholar.full_name)}&background=6E1F27&color=fff&size=200`}
                          alt={scholar.full_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {scholar.full_name}
                      </h3>
                      <p className="text-sm text-secondary font-medium mb-2 flex items-center justify-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {scholar.specialisations?.[0] || 'Vedic Scholar'}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        {scholar.city || 'India'}
                      </p>
                      {scholar.languages?.length > 0 && (
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-3">
                          <Languages className="w-3 h-3" />
                          {scholar.languages.slice(0, 2).join(', ')}
                        </p>
                      )}
                      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-muted/60">
                        <Lock className="w-3 h-3" />
                        Login to view full profile
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
