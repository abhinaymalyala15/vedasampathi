import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-primary mb-6">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Manage your account preferences and settings here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
