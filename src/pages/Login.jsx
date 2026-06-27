import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name || user.full_name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'pathasala') navigate('/pathasala/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-sacred">
        <div className="absolute inset-0 opacity-10 sacred-pattern" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <h2 className="font-heading text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-primary-foreground/65 leading-relaxed max-w-md">
            Sign in to access your scholar portal, manage events, and connect with the Vedic community.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-background px-5 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-[20px] bg-primary/10 mb-5">
              <LogIn className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-primary mb-2">Vedasampatti</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <div className="premium-card p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-secondary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading && (
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                )}
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
