import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import ContactCard from './components/ContactCard'
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';

const App = () => { 
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase
        .from('Usuario')
        .select('*')
        .neq('IDUsuario', 2);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setUsuarios(data);
      }
    };

    fetchUsuarios();
  }, []);
//https://drive.google.com/file/d/1tPqroLiTqaBtuZV2pr_PKydhAMpaUuE1/view?usp=sharing
  return (
    <div>
      <header>
        <Header />
      </header>
      <h1>Intercambiazo</h1>
      <h2>Alumnos Recomendados</h2>
      <div className="container">
      {usuarios.map((usuario) => (
        <ContactCard 
          key={usuario.IDUsuario}
          usuario={usuario}
        />
      ))}
    </div>
      <div className="add-button">
        <button><h3>Agregar Intercoins +</h3></button>
      </div>
    </div>
  );
  
  /*
  return (
    <div>
      <h1>Intercambiazo</h1>
      <h2>Alumnos Recomendados</h2>
      <ContactList contacts={contacts} />
      <div className="add-button">
        <button><h3>Agregar Intercoins +</h3></button>
      </div>
    </div>
  );
   */

};

export default App;
