import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardPageHeader } from '@/components/ui/DashboardPageHeader';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <DashboardPageHeader
        title="Scholar Dashboard"
        description={`Welcome back${user?.full_name ? `, ${user.full_name}` : ''}!`}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-glow-gold">
          <CardHeader><CardTitle>Profile Status</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground leading-relaxed">Complete your profile to get approved.</p></CardContent>
        </Card>
        <Card className="hover:shadow-glow-gold">
          <CardHeader><CardTitle>My Events</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground leading-relaxed">No events registered yet.</p></CardContent>
        </Card>
        <Card className="hover:shadow-glow-gold">
          <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground leading-relaxed">Upload required documents.</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
