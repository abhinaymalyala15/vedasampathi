import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyEvents() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-primary mb-6">My Events</h1>
      <Card>
        <CardHeader><CardTitle>Registered Events</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your registered events will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
