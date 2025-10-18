/**
 * AthleteCardSkeleton Component
 * 
 * Loading skeleton for AthleteCard component
 */

export default function AthleteCardSkeleton({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 shadow-sm border border-transparent animate-pulse">
        <div className="flex items-center gap-3">
          {/* Avatar skeleton */}
          <div className="size-12 rounded-full bg-muted" />
          
          {/* Info skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>

          {/* Action skeleton */}
          <div className="size-8 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow border border-transparent animate-pulse">
      <div className="flex items-center gap-4">
        {/* Avatar skeleton */}
        <div className="size-16 rounded-full bg-muted shrink-0" />

        {/* Info skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-2/3" />
          <div className="flex gap-3 mt-2">
            <div className="h-3 bg-muted rounded w-20" />
            <div className="h-3 bg-muted rounded w-24" />
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="h-9 w-28 bg-muted rounded" />
          <div className="h-9 w-28 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
