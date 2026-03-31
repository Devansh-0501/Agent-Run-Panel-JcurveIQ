const isComplete = (task) => task?.status === 'complete';

const dependenciesMet = (task, tasksById) =>
  (task.dependsOn ?? []).every((depId) => isComplete(tasksById[depId]));

export const getOrderedVisibleTasks = (tasksById) =>
  Object.values(tasksById)
    .sort((a, b) => a.sequence - b.sequence)
    .filter((task) => dependenciesMet(task, tasksById));

export const getTaskRows = (tasksById) => {
  const tasks = getOrderedVisibleTasks(tasksById);
  const rows = [];
  const groupMap = new Map();

  tasks.forEach((task) => {
    if (task.parallelGroup) {
      if (!groupMap.has(task.parallelGroup)) {
        const row = { type: 'parallel', id: task.parallelGroup, tasks: [task] };
        rows.push(row);
        groupMap.set(task.parallelGroup, row);
      } else {
        groupMap.get(task.parallelGroup).tasks.push(task);
      }
      return;
    }
    rows.push({ type: 'single', id: task.id, task });
  });

  return rows;
};
