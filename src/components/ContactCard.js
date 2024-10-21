import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase'; // Asegúrate de que la ruta sea correcta

const ContactCard = ({ usuario }) => {
  const [materias, setMaterias] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const fetchMaterias = async () => {
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
        
        const { data: materiasData, error: errorMaterias } = await supabase
          .from('Materia')
          .select('*')
          .in('IDMateria', idsMateria);

        if (errorMaterias) {
          console.error('Error fetching Materias:', errorMaterias);
          return;
        }

        setMaterias(materiasData);
      }
    };

    fetchMaterias();
  }, [usuario]);

  const materiasList = materias.length > 0 
    ? materias.map((materia) => (
        <li key={materia.IDMateria}>{materia.Nombre}</li>
      ))
    : <li>No hay materias disponibles</li>;

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
    if (!isChatVisible) {
      setMessages([{ sender: 'usuario', text: 'Hola, ¿En qué te puedo ayudar?' }]);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'me', text: inputMessage }
      ]);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
      e.preventDefault();
    }
  };

  const closeChat = () => {
    setIsChatVisible(false);
    setMessages([]);
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMinimizedClick = () => {
    setIsMinimized(false);
    setIsChatVisible(true);
  };

  return (
    <div>
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
            <button onClick={toggleChat}>Contactar</button>
          </div>
        </div>
        <img src={usuario.Foto} alt={`Imagen de ${usuario.Nombre}`} />
      </div>

      {isChatVisible && (
        <div
          className="chat-box"
          style={{ 
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            border: '1px solid #ccc',
            padding: '10px',
            backgroundColor: 'white',
            zIndex: 1000,
            width: isMinimized ? '200px' : '400px', // Aumentar el ancho
            height: isMinimized ? '50px' : 'auto',
            overflow: 'hidden',
          }}
        >
          {!isMinimized ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4>Chat con {usuario.Nombre}</h4>
                <div>
                  <button onClick={minimizeChat}>_</button>
                  <button onClick={closeChat}>X</button>
                </div>
              </div>
              <div className="chat-messages" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    style={{
                      backgroundColor: msg.sender === 'me' ? '#007BFF' : '#00aae4', // Celeste para el usuario y azul para 'me'
                      color: 'white',
                      borderRadius: '5px',
                      padding: '10px',
                      margin: '5px',
                      textAlign: msg.sender === 'me' ? 'right' : 'left',
                      maxWidth: '80%', // Para que los mensajes no sean demasiado anchos
                      alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', // Alinear según el remitente
                    }}
                  >
                    <strong>{msg.sender === 'me' ? 'Tú' : usuario.Nombre}:</strong> {msg.text}
                  </div>
                ))}
              </div>
              <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..." 
                style={{ width: '100%', marginTop: '10px' }} // Hacer el input más ancho
              />
              <button onClick={handleSendMessage}>Enviar</button>
            </>
          ) : (
            <div 
              style={{ textAlign: 'center', cursor: 'pointer' }} 
              onClick={handleMinimizedClick}
            >
              <strong>{usuario.Nombre}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactCard;
