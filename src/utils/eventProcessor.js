const makeInitialState = () => ({
  run: {
    runId: null,
    query: '',
    status: 'idle',
    startTime: null,
    duration: 0,
    output: null,
    error: null,
  },
  tasksById: {},
  thoughts: {
    coordinator: [],
    system: [],
    byTask: {},
  },
});

export const initialState = makeInitialState();

const ensureTask = (tasksById, event) => {
  const current = tasksById[event.task_id] ?? {
    id: event.task_id,
    label: event.label ?? event.task_id,
    agent: event.agent ?? 'agent',
    status: 'running',
    parallelGroup: event.parallel_group ?? null,
    dependsOn: event.depends_on ?? [],
    toolCalls: [],
    outputs: [],
    thoughts: [],
    retries: 0,
    error: null,
    reason: null,
    sequence: event.sequence ?? Number.MAX_SAFE_INTEGER,
  };
  return { ...current };
};

const addThought = (state, event) => {
  const thought = {
    id: event.id ?? `${Date.now()}-${Math.random()}`,
    text: event.text,
    agent: event.agent ?? null,
    scope: event.scope ?? null,
    timestamp: event.timestamp ?? Date.now(),
  };

  if (event.task_id) {
    const task = ensureTask(state.tasksById, event);
    task.thoughts = [...task.thoughts, thought];
    return {
      ...state,
      tasksById: {
        ...state.tasksById,
        [task.id]: task,
      },
    };
  }

  if (event.scope === 'coordinator') {
    return {
      ...state,
      thoughts: {
        ...state.thoughts,
        coordinator: [...state.thoughts.coordinator, thought],
      },
    };
  }

  return {
    ...state,
    thoughts: {
      ...state.thoughts,
      system: [...state.thoughts.system, thought],
    },
  };
};

const applyEvent = (state, event) => {
  switch (event.type) {
    case 'run_started':
      return {
        ...state,
        run: {
          ...state.run,
          runId: event.run_id,
          query: event.query,
          status: 'running',
          startTime: event.timestamp ?? Date.now(),
          duration: 0,
          output: null,
          error: null,
        },
      };
    case 'agent_thought':
      return addThought(state, event);
    case 'task_spawned': {
      const task = ensureTask(state.tasksById, event);
      task.id = event.task_id;
      task.label = event.label;
      task.agent = event.agent;
      task.status = event.status ?? 'running';
      task.parallelGroup = event.parallel_group ?? null;
      task.dependsOn = event.depends_on ?? [];
      task.sequence = event.sequence ?? task.sequence;
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [task.id]: task,
        },
      };
    }
    case 'tool_call': {
      const task = ensureTask(state.tasksById, event);
      const toolCall = {
        id: event.call_id,
        name: event.tool_name,
        inputSummary: event.input_summary,
        outputSummary: null,
        status: 'running',
      };
      task.toolCalls = [...task.toolCalls, toolCall];
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [task.id]: task,
        },
      };
    }
    case 'tool_result': {
      const task = ensureTask(state.tasksById, event);
      task.toolCalls = task.toolCalls.map((call) =>
        call.id === event.call_id
          ? { ...call, outputSummary: event.output_summary, status: 'complete' }
          : call,
      );
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [task.id]: task,
        },
      };
    }
    case 'partial_output': {
      const task = ensureTask(state.tasksById, event);
      task.outputs = [
        ...task.outputs,
        {
          id: event.output_id ?? `${Date.now()}-${Math.random()}`,
          text: event.text,
          isFinal: !!event.is_final,
          timestamp: event.timestamp ?? Date.now(),
        },
      ];
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [task.id]: task,
        },
      };
    }
    case 'task_update': {
      const task = ensureTask(state.tasksById, event);
      task.status = event.status ?? task.status;
      task.error = event.error ?? null;
      task.retries = event.retries ?? task.retries;
      task.reason = event.reason ?? null;
      return {
        ...state,
        tasksById: {
          ...state.tasksById,
          [task.id]: task,
        },
      };
    }
    case 'run_complete':
      return {
        ...state,
        run: {
          ...state.run,
          status: 'complete',
          duration: event.duration ?? state.run.duration,
          output: event.output,
          error: null,
        },
      };
    case 'run_error':
      return {
        ...state,
        run: {
          ...state.run,
          status: 'failed',
          error: event.error ?? 'Run failed unexpectedly.',
        },
      };
    default:
      return state;
  }
};

export const eventReducer = (state, action) => {
  switch (action.type) {
    case 'RESET':
      return makeInitialState();
    case 'EVENT':
      return applyEvent(state, action.event);
    case 'TICK': {
      if (state.run.status !== 'running' || !state.run.startTime) {
        return state;
      }
      return {
        ...state,
        run: {
          ...state.run,
          duration: Date.now() - state.run.startTime,
        },
      };
    }
    default:
      return state;
  }
};
