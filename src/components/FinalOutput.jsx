function FinalOutput({ output }) {
  if (!output) {
    return null;
  }

  return (
    <section className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-4">
      <h2 className="mb-2 text-lg font-semibold text-emerald-200">Final Synthesized Output</h2>
      <p className="mb-3 text-sm text-emerald-50">{output.summary}</p>
      <div>
        <p className="mb-1 text-xs uppercase tracking-wide text-emerald-200">Citations</p>
        <ul className="list-inside list-disc space-y-1 text-sm text-emerald-100">
          {(output.citations ?? []).map((citation) => (
            <li key={citation}>{citation}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FinalOutput;
