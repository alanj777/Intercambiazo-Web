import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './utils/supabase';
import ContactCard from './components/ContactCard';
import HomePage from './components/HomePage';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import CreateClass from './components/CreateClass';
import PriceClass from './components/PriceClass';
import CreateForm from './components/fsssdfdgesgr'

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

  return (
    <Router>
      <header>
        <Header />
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <div>
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
          }
        />
        <Route path="/create-class" element={<CreateForm />} />
        <Route path="/price-class/:idClase" element={<PriceClass />} />
      </Routes>
    </Router>
  );
};

export default App;
