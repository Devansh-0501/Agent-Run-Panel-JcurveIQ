# Architecture Decisions

## Agent thoughts visibility

- **Decision**: Render coordinator/system thoughts in a global collapsible section and task-level thoughts inside each task card as collapsible secondary content.
- **Reasoning**: Thoughts provide context but should not compete with primary run status and outputs; collapsible placement preserves clarity for non-technical users.
- **When to change**: If users need deep debugging traces by default, switch to expanded timeline mode or a dedicated diagnostics panel.

## Parallel layout approach

- **Decision**: Group tasks with the same `parallel_group` into a visually distinct container and render them side-by-side with a responsive grid.
- **Reasoning**: Side-by-side presentation makes parallel execution obvious without introducing graph complexity.
- **When to change**: If task counts per group become large or highly dynamic, move to a horizontally scrollable lane/timeline model.

## Partial output handling

- **Decision**: Show the latest output inline, while earlier outputs are hidden behind a collapsible details block.
- **Reasoning**: The latest output is usually what users need immediately; preserving older outputs keeps auditability without overwhelming the card.
- **When to change**: If chronological traceability becomes primary, present all outputs in a timestamped feed with filtering.

## Cancelled state UX

- **Decision**: Treat `cancelled` with reason `sufficient_data` as neutral/positive (`Stopped early (sufficient data)`) using muted amber/neutral styling rather than error red.
- **Reasoning**: This cancellation reflects optimization, not failure; positive framing improves trust and avoids false alarm.
- **When to change**: If additional cancellation reasons are introduced, map styling by reason taxonomy (expected, user-initiated, failure-adjacent).

## Dependency handling

- **Decision**: Do not render dependent tasks until every `depends_on` task is `complete`; keep order deterministic via fixture `sequence`.
- **Reasoning**: This enforces logical reveal order and prevents users from seeing tasks before prerequisites are visibly satisfied.
- **When to change**: If users need full pipeline visibility from start, render blocked tasks in a disabled state with explicit dependency badges.
