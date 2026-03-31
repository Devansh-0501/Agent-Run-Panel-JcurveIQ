function EmptyState() {
  return (
    <section className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
      <h2 className="mb-2 text-lg font-semibold text-white">No run active</h2>
      <p className="text-sm text-slate-300">
        Start a simulation to watch task orchestration, parallel execution, retries, and final synthesis unfold in real time.
      </p>
    </section>
  );
}

export default EmptyState;
