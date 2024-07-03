import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

const TodoForm = ({ onAdd }) => {
  const [task, setTask] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (task.trim() === '') return;

    const { data, error } = await supabase
      .from('todos')
      .insert([{ task }]);

    if (error) {
      console.error('Error adding todo:', error);
    } else {
      onAdd(data[0]);
      setTask('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default TodoForm;
