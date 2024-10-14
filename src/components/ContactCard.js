import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase'; // Asegúrate de que la ruta sea correcta

const ContactCard = ({ usuario }) => {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    const fetchMaterias = async () => {
      // Log para mostrar la información completa del usuario
      console.log('Usuario:', usuario);

      // Obtener IDMateria de MateriaQueDa usando IDUsuario
      const { data: materiasQueDa, error: errorMateriasQueDa } = await supabase
        .from('MateriaQueDa')
        .select('IDMateria')
        .eq('IDUsuario', usuario.IDUsuario);

      if (errorMateriasQueDa) {
        console.error('Error fetching MateriaQueDa:', errorMateriasQueDa);
        return;
      }

      if (materiasQueDa.length > 0) {
        const idsMateria = materiasQueDa.map(materia => materia.IDMateria);
        
        // Obtener la información de las materias desde la tabla "Materia"
        const { data: materiasData, error: errorMaterias } = await supabase
          .from('Materia') // Asegúrate de que el nombre de la tabla es correcto
          .select('*') // Obtén todos los campos
          .in('IDMateria', idsMateria);

        if (errorMaterias) {
          console.error('Error fetching Materias:', errorMaterias);
          return;
        }

        setMaterias(materiasData);
      }
    };

    fetchMaterias();
  }, [usuario]); // Dependencia en usuario para volver a llamar si cambia

  const materiasList = materias.length > 0 
    ? materias.map((materia) => (
        <li key={materia.IDMateria}>{materia.Nombre}</li> // Muestra el nombre de la materia desde la columna "Nombre"
      ))
    : <li>No hay materias disponibles</li>;

  return (
    <div className="user-box">
      <div className="text">
        <h1>{usuario.Nombre + " " + usuario.Apellido}</h1>
        <div className="materias">
          <h4>Materias:</h4>
          <ul>
            {materiasList}
          </ul>
        </div>
        <div className="contact-info">
          <button>Contactar</button>
        </div>
      </div>
      <img src={usuario.Foto} alt={`Imagen de ${usuario.Nombre}`} />
    </div>
  );
};

export default ContactCard;
