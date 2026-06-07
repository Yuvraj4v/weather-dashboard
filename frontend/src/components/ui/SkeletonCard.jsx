/**
 * SkeletonCard - Loading placeholder
 */

export default function SkeletonCard({ tall, small, wide }) {
  if (small) {
    return (
      <div className="glass rounded-2xl p-4 animate-pulse">
        <div className="skeleton rounded-lg h-4 w-16 mb-3" />
        <div className="skeleton rounded-lg h-7 w-20 mb-2" />
        <div className="skeleton rounded-lg h-3 w-24" />
      </div>
    );
  }

  if (wide) {
    return (
      <div className="glass rounded-3xl p-6 animate-pulse">
        <div className="skeleton rounded-lg h-4 w-32 mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-[72px] flex flex-col items-center gap-2 p-3">
              <div className="skeleton rounded h-3 w-10" />
              <div className="skeleton rounded-full w-10 h-10" />
              <div className="skeleton rounded h-5 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`glass rounded-3xl p-6 sm:p-8 animate-pulse ${tall ? 'min-h-64' : 'min-h-40'}`}>
      <div className="flex justify-between mb-6">
        <div>
          <div className="skeleton rounded-lg h-5 w-32 mb-2" />
          <div className="skeleton rounded h-3 w-24" />
        </div>
        <div className="skeleton rounded-xl w-10 h-10" />
      </div>
      <div className="skeleton rounded-lg h-20 w-40 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="skeleton rounded-full w-6 h-6" />
            <div className="skeleton rounded h-2.5 w-12" />
            <div className="skeleton rounded h-3.5 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
