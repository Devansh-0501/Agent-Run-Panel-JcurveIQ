const randomDelay = (minMs = 500, maxMs = 1200) =>
  Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

export const createMockEmitter = (events) => {
  let index = 0;
  let activeTimer = null;
  let stopped = false;

  const scheduleNext = (onEvent, onFinish) => {
    if (stopped) {
      return;
    }
    if (index >= events.length) {
      onFinish?.();
      return;
    }

    const event = events[index];
    const delayMs = event.delayMs ?? randomDelay();
    activeTimer = setTimeout(() => {
      onEvent(event);
      index += 1;
      scheduleNext(onEvent, onFinish);
    }, delayMs);
  };

  return {
    start(onEvent, onFinish) {
      scheduleNext(onEvent, onFinish);
    },
    stop() {
      stopped = true;
      if (activeTimer) {
        clearTimeout(activeTimer);
      }
    },
  };
};
