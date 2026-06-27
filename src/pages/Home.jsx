import { useQuery } from '@tanstack/react-query';
import api from '@/api/apiClient';
import HeroSection from '@/components/home/HeroSection';
import HighlightCards from '@/components/home/HighlightCards';
import AboutSection from '@/components/home/AboutSection';
import FeaturedScholars from '@/components/home/FeaturedScholars';
import FeaturedPathasalas from '@/components/home/FeaturedPathasalas';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import VedicKnowledgeSection from '@/components/home/VedicKnowledgeSection';
import DonateSection from '@/components/home/DonateSection';

export default function Home() {
  const { data: scholarData, isLoading: scholarsLoading } = useQuery({
    queryKey: ['scholars', 'approved'],
    queryFn: () => api.get('/scholars?per_page=6'),
  });
  const scholars = scholarData?.data ?? [];

  const { data: pathasalaData, isLoading: pathasalasLoading } = useQuery({
    queryKey: ['pathasalas', 'approved'],
    queryFn: () => api.get('/pathasalas?per_page=6'),
  });
  const pathasalas = pathasalaData?.data ?? [];

  const { data: eventData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', 'home'],
    queryFn: () => api.get('/events?upcoming=1&per_page=4'),
  });
  const events = eventData?.data ?? [];

  return (
    <>
      <HeroSection />
      <HighlightCards />
      <AboutSection />
      <FeaturedScholars scholars={scholars} isLoading={scholarsLoading} />
      <FeaturedPathasalas pathasalas={pathasalas} isLoading={pathasalasLoading} />
      <VedicKnowledgeSection />
      <UpcomingEvents events={events} isLoading={eventsLoading} />
      <DonateSection />
    </>
  );
}