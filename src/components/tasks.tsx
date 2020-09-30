import React from 'react';
import {gql, useMutation, useQuery} from "@apollo/client";

const TASKS_QUERY = gql`
    query Tasks {
        tasks {
            id
            description
            status
        }
    }
`;

const CREATE_TASK_MUTATION = gql`
    mutation CreateTask($description: String!) {
        createTask(description: $description) {
            description
        }
    }
`;

const CHANGE_TASK_STATUS_MUTATION = gql`
    mutation ChangeTaskStatus($taskId: Int!) {
        changeTaskStatus(taskId: $taskId) {
            status
        }
    }
`;

type Task = {
  id: number
  description: string
  status: 'TODO'|'COMPLETED'|'REOPENED'
}

export const TasksComponent = () => {

  const newTaskInput = React.useRef<HTMLInputElement|null>(null);
  const { data, loading, refetch } = useQuery<{ tasks: Array<Task> }>(TASKS_QUERY);
  const [createTask] = useMutation(CREATE_TASK_MUTATION);
  const [changeTaskStatus] = useMutation(CHANGE_TASK_STATUS_MUTATION);

  React.useEffect(() => {
    console.log(data);
  }, [data]);

  const handleCreate = React.useCallback(async () => {
    if (newTaskInput.current) {
      const description = newTaskInput.current.value;
      await createTask({ variables: { description }});
      newTaskInput.current.value = '';
      await refetch();
    }
  }, [createTask]);

  const handleToggle = React.useCallback((taskId: number) => {
    return async () => {
      await changeTaskStatus({ variables: { taskId } });
      await refetch();
    };
  }, [changeTaskStatus, refetch]);


  return (
    <div className="box panel" style={{
      position: 'relative',
      overflow: 'hidden',
    }}>
      {loading && (
        <progress className="progress is-medium is-info" style={{
          position: 'absolute',
          left: 0, top: 0, borderRadius: 0,
        }} />
      )}
      <div className="field has-addons">
        <div className="control has-icons-right is-expanded">
          <input ref={newTaskInput} type="text"
                 placeholder="Nova tarefa"
                 className="input is-info"
          />
        </div>
        <div className="control">
          <button className="button is-info" onClick={handleCreate}>Criar</button>
        </div>
      </div>
      <nav style={{ width: 480, maxWidth: '100%' }}>
        {data?.tasks.map(({ id, description, status }) =>
          <p className="panel-block">
            <label className="checkbox">
              <input type="checkbox" checked={status === 'COMPLETED'} onClick={handleToggle(id)}/>
              <span style={{
                textDecoration: status === 'COMPLETED' ? 'line-through' : undefined,
                color: status === 'COMPLETED' ? 'lightgray' : undefined,
              }}>{description}</span>
            </label>
          </p>
        )}
      </nav>
    </div>
  );
};