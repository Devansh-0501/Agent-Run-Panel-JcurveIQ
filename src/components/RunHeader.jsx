const statusStyles = {
  idle: 'bg-slate-700/50 text-slate-200 border-slate-600',
  running: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
  complete: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  failed: 'bg-red-500/20 text-red-200 border-red-400/40',
};

const formatDuration = (ms) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const seconds = String(totalSec % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

function RunHeader({ run }) {
  return (
    <header className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/30">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-white md:text-2xl">Agent Run Panel</h1>
        <span className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide ${statusStyles[run.status]}`}>
          {run.status}
        </span>
      </div>
      <p className="mb-2 text-sm text-slate-300">
        <span className="text-slate-400">Query:</span> {run.query || 'No active query yet.'}
      </p>
      <p className="text-sm text-slate-300">
        <span className="text-slate-400">Elapsed:</span> {formatDuration(run.duration)}
      </p>
      {run.error ? <p className="mt-3 rounded border border-red-500/40 bg-red-500/10 p-2 text-sm text-red-200">{run.error}</p> : null}
    </header>
  );
}

export default RunHeader;
