import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import { MapPin, Lock, Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import FilterBar, { FilterSelect } from '@/components/ui/FilterBar';
import EmptyState from '@/components/ui/EmptyState';
import { PathasalaCardSkeleton } from '@/components/ui/skeleton';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function Pathasalas() {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');

  const { data: res = {}, isLoading } = useQuery({
    queryKey: ['pathasalas', 'directory'],
    queryFn: () => api.get('/pathasalas?per_page=100'),
  });
  const pathasalas = res?.data ?? [];

  const allStates = useMemo(() => {
    const set = new Set();
    pathasalas.forEach((p) => p.state && set.add(p.state));
    return Array.from(set).sort();
  }, [pathasalas]);

  const filtered = useMemo(() => {
    return pathasalas.filter((p) => {
      const matchSearch =
        !search ||
        p.institution_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.toLowerCase().includes(search.toLowerCase());
      const matchState = stateFilter === 'all' || p.state === stateFilter;
      return matchSearch && matchState;
    });
  }, [pathasalas, search, stateFilter]);

  return (
    <div>
      <PageHeader
        badge="Institutions"
        title="Pathasala Directory"
        subtitle="Explore traditional Sanskrit learning institutions across India"
      />

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search by name or city...">
        <FilterSelect value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="sm:min-w-[200px]">
          <option value="all">All States</option>
          {allStates.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      <div className="py-section-sm bg-background">
        <div className="container-premium">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <PathasalaCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              variant="pathasalas"
              title="No Pathasalas Found"
              description="No institutions match your search criteria."
              actionLabel="Clear Search"
              onAction={() => { setSearch(''); setStateFilter('all'); }}
            />
          ) : (
            <motion.div {...staggerContainer(0.06)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pathasala) => (
                <motion.div key={pathasala.id} variants={staggerItem}>
                  <Link to={`/pathasalas/${pathasala.id}`} className="group block premium-card overflow-hidden h-full hover:shadow-glow-gold">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={pathasala.photo || '/vedic_pathasala.png'}
                        alt={pathasala.institution_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {pathasala.institution_name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-primary/60" />
                        {pathasala.city}, {pathasala.state}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{pathasala.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                        {pathasala.student_count && (
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {pathasala.student_count} students</span>
                        )}
                        {pathasala.teacher_count && (
                          <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {pathasala.teacher_count} teachers</span>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-muted/60">
                        <Lock className="w-3 h-3" /> Login to view full details
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
