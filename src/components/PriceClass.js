// src/components/PriceClass.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Alert, Button, Form, Container } from 'react-bootstrap';

const PriceClass = ({ idClase }) => {
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
      const { data: billeteraData, error: billeteraError } = await supabase
        .from('Billetera')
        .select('*')
        .single();

      if (billeteraError) throw billeteraError;
      const { IDBilletera, Saldo } = billeteraData;

      if (Saldo < total) {
        throw new Error('Saldo insuficiente en la billetera.');
      }

      // Insertar en la tabla Compra
      const { error: insertError } = await supabase
        .from('Compra')
        .insert([
          {
            IDClase: idClase,
            IDBilletera,
            Total: total
          }
        ]);

      if (insertError) throw insertError;

      // Actualizar saldo de la billetera
      const newSaldo = Saldo - total;
      const { error: updateError } = await supabase
        .from('Billetera')
        .update({ Saldo: newSaldo })
        .eq('IDBilletera', IDBilletera);

      if (updateError) throw updateError;

      setSuccess('Compra realizada exitosamente.');
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
