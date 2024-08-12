// src/components/CreateClass.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, ListGroup } from 'react-bootstrap';
import { supabase } from '../utils/supabase';

const CreateClass = () => {
  const [usuarioReceptor, setUsuarioReceptor] = useState('');
  const [fecha, setFecha] = useState('');
  const [materia, setMateria] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  // Función para buscar usuarios en Supabase
  const fetchSuggestions = async (query) => {
    if (query.length > 2) { // Solo buscar si el texto tiene más de 2 caracteres
      try {
        const { data, error } = await supabase
          .from('Usuario')
          .select('IDUsuario, Username')
          .ilike('Username', `%${query}%`) // Búsqueda insensible a mayúsculas/minúsculas
          .limit(5); // Limitar la cantidad de sugerencias

        if (error) throw error;
        setSuggestions(data);
      } catch (err) {
        console.error(err);
        setError('Error al buscar usuarios.');
      }
    } else {
      setSuggestions([]);
    }
  };

  // Efecto para actualizar sugerencias en función del texto ingresado
  useEffect(() => {
    fetchSuggestions(usuarioReceptor);
  }, [usuarioReceptor]);

  const handleSuggestionClick = (username, userId) => {
    setUsuarioReceptor(username);
    setSelectedUserId(userId);
    setSuggestions([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!selectedUserId) {
        throw new Error('Debe seleccionar un usuario receptor.');
      }

      // Buscar IDUsuarioEmisor basado en el usuario actual
      const usernameEmisor = 'Casimiro Saavedra'; // Cambia esto según la lógica de autenticación
      const { data: userEmisor, error: errorEmisor } = await supabase
        .from('Usuario')
        .select('IDUsuario')
        .eq('Username', usernameEmisor)
        .single();

      if (errorEmisor) throw errorEmisor;
      const IDUsuarioEmisor = userEmisor.IDUsuario;

      // IDUsuarioReceptor ya se tiene como `selectedUserId`

      // Buscar IDMateria basado en el nombre de materia
      const { data: materiaData, error: errorMateria } = await supabase
        .from('Materia')
        .select('IDMateria')
        .eq('Nombre', materia)
        .single();

      if (errorMateria) throw errorMateria;
      const IDMateria = materiaData.IDMateria;

      // Insertar en la tabla Clase y obtener el IDClase
      const { data: claseData, error: insertError } = await supabase
        .from('Clase')
        .insert([
          {
            IDUsuarioEmisor,
            IDUsuarioReceptor: selectedUserId, // Usar selectedUserId
            Fecha: new Date(fecha).toISOString(),
            IDMateria
          }
        ])
        .select('IDClase')
        .single();

      if (insertError) throw insertError;

      // Extraer IDClase del resultado
      const IDClase = claseData.IDClase;

      setSuccess('Clase agregada exitosamente.');

      // Redireccionar a la página de PriceClass con el ID de la clase recién creada
      navigate(`/price-class/${IDClase}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <h1>Agregar Clase</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsuarioReceptor">
          <Form.Label>Usuario receptor</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre de usuario del receptor"
            value={usuarioReceptor}
            onChange={(e) => setUsuarioReceptor(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ListGroup className="mt-2">
              {suggestions.map(user => (
                <ListGroup.Item
                  key={user.IDUsuario}
                  onClick={() => handleSuggestionClick(user.Username, user.IDUsuario)}
                  style={{ cursor: 'pointer' }}
                >
                  {user.Username}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>

        <Form.Group controlId="formFecha">
          <Form.Label>Fecha y hora</Form.Label>
          <Form.Control
            type="datetime-local"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formMateria">
          <Form.Label>Materia</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre de la materia"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Enviar
        </Button>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      </Form>
    </Container>
  );
};

export default CreateClass;
