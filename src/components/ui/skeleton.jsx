import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('rounded-2xl shimmer', className)}
      {...props}
    />
  );
}

export function ScholarCardSkeleton() {
  return (
    <div className="premium-card p-6 space-y-4">
      <Skeleton className="w-24 h-24 rounded-full mx-auto" />
      <Skeleton className="h-5 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-2/3 mx-auto" />
    </div>
  );
}

export function PathasalaCardSkeleton() {
  return (
    <div className="premium-card overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="premium-card overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export { Skeleton };
