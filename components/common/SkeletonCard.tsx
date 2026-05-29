'use client';

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-muted" />
      <div className="pt-4 space-y-2">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-5 bg-muted rounded w-1/2" />
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => <div key={i} className="w-4 h-4 rounded-full bg-muted" />)}
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonProductDetail() {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="aspect-square bg-muted rounded" />
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-4 bg-muted rounded" />)}
        </div>
        <div className="h-12 bg-muted rounded" />
      </div>
    </div>
  );
}
