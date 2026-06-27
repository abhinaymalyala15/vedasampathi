import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Qualifications() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-primary mb-6">Qualifications</h1>
      <Card>
        <CardHeader><CardTitle>Academic & Vedic Qualifications</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Add your educational qualifications and certifications here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
