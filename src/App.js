import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import ContactList from './components/ContactList';
import TodoForm from './components/todoForm';
import TodoList from './components/todoList';
import './style.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [contacts, setContacts] = useState([
    {
      name: "Jose Angel Rosello",
      subject: "Clase de Matemática",
      imageUrl: "https://campus.ort.edu.ar/static/archivos/usuarioperfil/87149"
    },
    {
      name: "Casimiro Saavedra",
      subject: "Clase de Lengua",
      imageUrl: "https://campus.ort.edu.ar/static/archivos/usuarioperfil/85026"
    },
    {
      name: "Jesus Manuel Hidalgo",
      subject: "Clase de Química",
      imageUrl: "https://campus.ort.edu.ar/static/archivos/usuarioperfil/87174"
    },
    {
      name: "Juan Gabriel Coronado",
      subject: "Clase de Filosofía",
      imageUrl: "https://campus.ort.edu.ar/static/archivos/usuarioperfil/86796"
    },
    {
      name: "Juan Maria Ferre",
      subject: "Clase de Educación Judía",
      imageUrl: "https://campus.ort.edu.ar/static/archivos/usuarioperfil/81170"
    }
  ]);

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
    <div>
      <h1>Intercambiazo</h1>
      <h2>Alumnos Recomendados</h2>
      <ContactList contacts={contacts} />
      <div className="add-button">
        <button><h3>Agregar Intercoins +</h3></button>
      </div>
      <h2>Tareas</h2>
      <TodoForm onAdd={handleAdd} />
      <TodoList todos={todos} onDelete={handleDelete} />
    </div>
  );
};

export default App;
