# Agent Run Panel

React + Vite frontend that simulates a real-time multi-agent workflow run with task orchestration, parallel steps, retries, cancellations, thoughts, and final synthesis output.

## How to run

1. Install dependencies:
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. Open the local URL shown in terminal.

## How to switch fixtures

- Use the `Fixture` dropdown in the panel toolbar:
  - `Success Flow`: full happy path with partial outputs, parallel tasks, failure/retry/cancel, and completion summary.
  - `Error Flow`: mixed progress ending with `run_error`.
- Click `Start` to stream the selected fixture.
- Click `Reset` to clear state and run again.

## Known limitations

- This is a frontend-only simulation; no backend persistence or true streaming transport.
- Dependency handling currently reveals tasks only when dependencies are `complete` (not merely terminal).
- Task ordering relies on fixture `sequence` values for deterministic rendering.
- Timing is randomized per event (500-1200ms), so exact playback cadence differs each run.
