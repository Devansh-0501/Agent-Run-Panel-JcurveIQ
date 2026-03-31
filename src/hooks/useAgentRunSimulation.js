import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { createMockEmitter } from '../mock/emitter';
import { errorFlow } from '../mock/fixtures/errorFlow';
import { successFlow } from '../mock/fixtures/successFlow';
import { eventReducer, initialState } from '../utils/eventProcessor';

const FIXTURES = {
  success: successFlow,
  error: errorFlow,
};

export const useAgentRunSimulation = () => {
  const [state, dispatch] = useReducer(eventReducer, initialState);
  const [fixtureName, setFixtureName] = useState('success');
  const [isStreaming, setIsStreaming] = useState(false);
  const emitterRef = useRef(null);
  const timerRef = useRef(null);

  const selectedFixture = useMemo(() => FIXTURES[fixtureName] ?? successFlow, [fixtureName]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopRun = () => {
    emitterRef.current?.stop();
    emitterRef.current = null;
    clearTimer();
    setIsStreaming(false);
  };

  const startRun = () => {
    stopRun();
    dispatch({ type: 'RESET' });
    setIsStreaming(true);

    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 250);

    const emitter = createMockEmitter(selectedFixture);
    emitterRef.current = emitter;
    emitter.start(
      (event) => {
        dispatch({ type: 'EVENT', event });
        if (event.type === 'run_complete' || event.type === 'run_error') {
          stopRun();
        }
      },
      () => {
        stopRun();
      },
    );
  };

  const resetRun = () => {
    stopRun();
    dispatch({ type: 'RESET' });
  };

  useEffect(() => () => stopRun(), []);

  return {
    state,
    fixtureName,
    setFixtureName,
    isStreaming,
    startRun,
    stopRun,
    resetRun,
  };
};
