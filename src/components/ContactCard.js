import React from 'react';

const ContactCard = ({ name, subject, imageUrl }) => {
    return (
        <div className="user-box">
            <div className="text">
                <h1>{name}</h1>
                <h4>{subject}</h4>
                <div className="contact-info">
                    <button>Contactar</button>
                </div>
            </div>
            <img src={imageUrl} alt={`Imagen de ${name}`} />
        </div>
    );
};

export default ContactCard;
