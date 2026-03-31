import { getTaskRows } from '../utils/taskSelectors';
import ParallelGroup from './ParallelGroup';
import TaskCard from './TaskCard';

function TaskList({ tasksById }) {
  const rows = getTaskRows(tasksById);

  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {rows.map((row) => {
        if (row.type === 'parallel') {
          return <ParallelGroup key={row.id} groupId={row.id} tasks={row.tasks} />;
        }
        return <TaskCard key={row.id} task={row.task} />;
      })}
    </section>
  );
}

export default TaskList;
