// components/dashboard/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export default function StatCard({ label, value, icon, color = 'primary' }: StatCardProps) {
  const colorClass = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  }[color];

  return (
    <div className="card p-4">
      <div className="text-sm text-muted mb-2">{label}</div>
      <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
    </div>
  );
}
