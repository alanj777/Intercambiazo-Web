// src/components/CreateClass.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, ListGroup } from 'react-bootstrap';
import { supabase } from '../utils/supabase';

const CreateClass = () => {
  const [usuarioReceptor, setUsuarioReceptor] = useState('');
  const [fecha, setFecha] = useState('');
  const [materia, setMateria] = useState('');
  const [total, setTotal] = useState(''); // Estado para el total
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  const fetchSuggestions = async (query) => {
    if (query.length > 2) {
      try {
        const { data, error } = await supabase
          .from('Usuario')
          .select('IDUsuario, Username')
          .ilike('Username', `%${query}%`)
          .limit(5);

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

      const usernameEmisor = 'Casimiro Saavedra'; // Cambia esto según la lógica de autenticación
      const { data: userEmisor, error: errorEmisor } = await supabase
        .from('Usuario')
        .select('IDUsuario')
        .eq('Username', usernameEmisor)
        .single();

      if (errorEmisor) throw errorEmisor;
      const IDUsuarioEmisor = userEmisor.IDUsuario;

      const { data: materiaData, error: errorMateria } = await supabase
        .from('Materia')
        .select('IDMateria')
        .eq('Nombre', materia)
        .single();

      if (errorMateria) throw errorMateria;
      const IDMateria = materiaData.IDMateria;

      const { data: claseData, error: insertError } = await supabase
        .from('Clase')
        .insert([
          {
            IDUsuarioEmisor,
            IDUsuarioReceptor: selectedUserId,
            Fecha: new Date(fecha).toISOString(),
            IDMateria
          }
        ])
        .select('IDClase')
        .single();

      if (insertError) throw insertError;

      const IDClase = claseData.IDClase;

      setSuccess('Clase agregada exitosamente.');

      // Lógica para agregar el precio
      await handlePriceSubmission(IDClase);

    } catch (err) {
      setError(err.message);
    }
  };

  const handlePriceSubmission = async (idClase) => {
    setError('');
    setSuccess('');

    try {
      // Buscar la billetera
      const today = new Date().toISOString();
      const { data: billeteraData, error: billeteraError } = await supabase
        .from('Billetera')
        .select('*')
        .eq('IDBilletera', 1)
        .single();

      if (billeteraError) throw billeteraError;
      const { IDBilletera } = billeteraData;

      // Insertar en la tabla Compra
      const { error: insertError } = await supabase
        .from('Compra')
        .insert([
          {
            IDClase: idClase,
            IDBilletera,
            Total: total,
            Fecha: today
          }
        ]);

      if (insertError) throw insertError;

      // Actualizar saldo de la billetera (si es necesario)
      const { error: updateError } = await supabase
        .from('Compra')
        .update({ Total: total })
        .eq('IDClase', idClase);

      if (updateError) throw updateError;

      setSuccess('Precio establecido.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
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

        {/* Integrando el formulario de PriceClass */}
        <Form.Group controlId="formTotal">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            min="0"
            placeholder="Ingrese el precio de la clase"
            value={total}
            onChange={(e) => setTotal(parseFloat(e.target.value))}
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
