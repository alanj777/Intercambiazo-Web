import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import TodoForm from './components/todoForm';
import TodoList from './components/todoList';
import './style.css';

const App = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      const { data: todos, error } = await supabase
        .from('todos')
        .select();

      if (error) {
        console.error('Error fetching todos:', error);
      } else {
        setTodos(todos);
      }
    };

    getTodos();
  }, []);

  const handleAdd = (todo) => {
    setTodos([...todos, todo]);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="app">
      <h1>Intercambiazo - Tareas</h1>
      <TodoForm onAdd={handleAdd} />
      <TodoList todos={todos} onDelete={handleDelete} />
    </div>
  );
};

export default App;
