const statusStyles = {
  running: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
  complete: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  failed: 'bg-red-500/20 text-red-200 border-red-400/40',
  cancelled: 'bg-amber-500/20 text-amber-100 border-amber-300/40',
  pending: 'bg-slate-700/50 text-slate-200 border-slate-600',
};

function TaskCard({ task }) {
  const latestOutput = task.outputs[task.outputs.length - 1];
  const olderOutputs = task.outputs.slice(0, -1);
  const cancelledForSufficientData = task.status === 'cancelled' && task.reason === 'sufficient_data';

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900 p-4 transition duration-300 ease-out hover:border-slate-700">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{task.label}</h3>
          <p className="text-xs text-slate-400">Agent: {task.agent}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[task.status]}`}>
          {cancelledForSufficientData ? 'Stopped early (sufficient data)' : task.status}
        </span>
      </div>

      {task.retries > 0 ? (
        <p className="mb-2 text-xs text-amber-200">Retry attempts: {task.retries}</p>
      ) : null}

      {task.error ? (
        <p className="mb-2 rounded border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-200">Failure: {task.error}</p>
      ) : null}

      {latestOutput ? (
        <div className="mb-3 rounded border border-slate-700 bg-slate-800/80 p-3">
          <p className="mb-1 text-[11px] uppercase tracking-wide text-slate-400">
            {latestOutput.isFinal ? 'Final output' : 'Latest output'}
          </p>
          <p className="text-sm text-slate-100">{latestOutput.text}</p>
        </div>
      ) : null}

      {olderOutputs.length > 0 ? (
        <details className="mb-3">
          <summary className="cursor-pointer text-xs text-slate-400">Show previous outputs ({olderOutputs.length})</summary>
          <div className="mt-2 space-y-2">
            {olderOutputs.map((output) => (
              <p key={output.id} className="rounded border border-slate-700 bg-slate-800/70 p-2 text-xs text-slate-300">
                {output.text}
              </p>
            ))}
          </div>
        </details>
      ) : null}

      {task.toolCalls.length > 0 ? (
        <div className="mb-3">
          <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">Tool calls</p>
          <ul className="space-y-2">
            {task.toolCalls.map((call) => (
              <li key={call.id} className="rounded border border-slate-700 bg-slate-800/60 p-2 text-xs text-slate-300">
                <p className="font-medium text-slate-200">{call.name}</p>
                <p>Input: {call.inputSummary}</p>
                {call.outputSummary ? <p>Output: {call.outputSummary}</p> : <p>Output: Waiting...</p>}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {task.thoughts.length > 0 ? (
        <details>
          <summary className="cursor-pointer text-xs text-slate-400">Agent thoughts ({task.thoughts.length})</summary>
          <ul className="mt-2 space-y-2">
            {task.thoughts.map((thought) => (
              <li key={thought.id} className="rounded border border-slate-700 bg-slate-800/50 p-2 text-xs italic text-slate-300">
                {thought.text}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </article>
  );
}

export default TaskCard;
