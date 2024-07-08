import React from 'react';

const ContactCard = ({ usuario }) => {
  return (
    <div className="user-box">
      <div className="text">
        <h1>{usuario.Nombre + " " + usuario.Apellido}</h1>
        <h4>{usuario.ClaseText}</h4>
        <div className="contact-info">
          <button>Contactar</button>
        </div>
      </div>
      <img src={usuario.Foto} alt={`Imagen de ${usuario.Nombre}`} />
    </div>
  );
};

export default ContactCard;
