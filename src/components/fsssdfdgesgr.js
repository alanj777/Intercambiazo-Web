// src/components/CreateClass.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { supabase } from '../utils/supabase';

const CreateClass = () => {
  const [usuarioReceptor, setUsuarioReceptor] = useState('');
  const [fecha, setFecha] = useState('');
  const [materia, setMateria] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook para redireccionar

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Buscar IDUsuarioEmisor basado en el usuario actual
      const usernameEmisor = 'current_user'; // Cambia esto según la lógica de autenticación
      const { data: userEmisor, error: errorEmisor } = await supabase
        .from('Usuario')
        .select('IDUsuario')
        .eq('Username', usernameEmisor)
        .single();

      if (errorEmisor) throw errorEmisor;
      const IDUsuarioEmisor = userEmisor.IDUsuario;

      // Buscar IDUsuarioReceptor basado en el nombre de usuario receptor
      const { data: userReceptor, error: errorReceptor } = await supabase
        .from('Usuario')
        .select('IDUsuario')
        .eq('Username', usuarioReceptor)
        .single();

      if (errorReceptor) throw errorReceptor;
      const IDUsuarioReceptor = userReceptor.IDUsuario;

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
            IDUsuarioReceptor,
            Fecha: new Date(fecha).toISOString(),
            IDMateria
          }
        ])
        .select('IDClase') // Seleccionar el IDClase del registro insertado
        .single(); // Asegúrate de que sea un solo registro

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
