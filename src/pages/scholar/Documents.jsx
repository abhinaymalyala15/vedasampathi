import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Documents() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-primary mb-6">Documents</h1>
      <Card>
        <CardHeader><CardTitle>Upload Documents</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Upload your certificates, IDs and supporting documents here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
