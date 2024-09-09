// src/components/PriceClass.js
import React, { useState } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Alert, Button, Form, Container } from 'react-bootstrap';

const PriceClass = () => {
  const { idClase } = useParams();
  const [total, setTotal] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        
        console.log("si");
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

      // Actualizar saldo de la billetera
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
      <h1>Agregar Precio a la Clase</h1>
      <Form onSubmit={handleSubmit}>
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
          Confirmar
        </Button>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
      </Form>
    </Container>
  );
};

export default PriceClass;
