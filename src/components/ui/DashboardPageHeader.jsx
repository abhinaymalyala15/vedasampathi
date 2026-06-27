import { Link } from 'react-router-dom';

export function DashboardPageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
      <div>
        <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mb-2">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, color = 'text-primary', to }) {
  const className = 'premium-card p-6 hover:shadow-glow-gold transition-all duration-300 block';
  const inner = (
    <>
      <div className="w-12 h-12 rounded-[16px] bg-secondary/15 flex items-center justify-center mb-4">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </>
  );

  if (to) return <Link to={to} className={className}>{inner}</Link>;
  return <div className={className}>{inner}</div>;
}
