import React from 'react';

const ContactCard = ({ usuario }) => {
  const materias = usuario.ClaseText ? usuario.ClaseText.split(',').map(materia => materia.trim()) : [];
  return (
    <div className="user-box">
      <div className="text">
        <h1>{usuario.Nombre + " " + usuario.Apellido}</h1>
        <div className="materias">
          <h4>Materias:</h4>
          <ul>
            {materias.length > 0 ? (
              materias.map((materia, index) => (
                <li key={index}>{materia}</li>
              ))
            ) : (
              <li>No hay materias disponibles</li>
            )}
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
