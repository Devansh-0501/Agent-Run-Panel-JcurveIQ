import TaskCard from './TaskCard';

function ParallelGroup({ groupId, tasks }) {
  return (
    <section className="space-y-3 rounded-xl border border-blue-500/30 bg-blue-500/5 p-3">
      <p className="text-xs uppercase tracking-wide text-blue-200">Parallel execution group: {groupId}</p>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}

export default ParallelGroup;
