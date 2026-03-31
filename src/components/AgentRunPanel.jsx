import { useAgentRunSimulation } from '../hooks/useAgentRunSimulation';
import EmptyState from './EmptyState';
import FinalOutput from './FinalOutput';
import RunHeader from './RunHeader';
import TaskList from './TaskList';

function AgentRunPanel() {
  const { state, fixtureName, setFixtureName, isStreaming, startRun, stopRun, resetRun } = useAgentRunSimulation();
  const hasRunData = state.run.status !== 'idle' || Object.keys(state.tasksById).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
        <label className="text-sm text-slate-300" htmlFor="fixture-select">
          Fixture
        </label>
        <select
          id="fixture-select"
          value={fixtureName}
          onChange={(e) => setFixtureName(e.target.value)}
          className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100"
          disabled={isStreaming}
        >
          <option value="success">Success Flow</option>
          <option value="error">Error Flow</option>
        </select>
        <button onClick={startRun} disabled={isStreaming} className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40">
          Start
        </button>
        <button onClick={stopRun} disabled={!isStreaming} className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40">
          Stop
        </button>
        <button onClick={resetRun} className="rounded bg-slate-700 px-3 py-1.5 text-sm font-medium text-white">
          Reset
        </button>
      </div>

      <RunHeader run={state.run} />

      {state.thoughts.coordinator.length > 0 || state.thoughts.system.length > 0 ? (
        <details className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
          <summary className="cursor-pointer text-sm text-slate-300">Coordinator / System thoughts</summary>
          <div className="mt-3 space-y-2">
            {[...state.thoughts.coordinator, ...state.thoughts.system].map((thought) => (
              <p key={thought.id} className="rounded border border-slate-700 bg-slate-800/60 p-2 text-xs italic text-slate-300">
                {thought.text}
              </p>
            ))}
          </div>
        </details>
      ) : null}

      {!hasRunData ? <EmptyState /> : <TaskList tasksById={state.tasksById} />}

      {state.run.status === 'complete' ? <FinalOutput output={state.run.output} /> : null}
    </div>
  );
}

export default AgentRunPanel;
