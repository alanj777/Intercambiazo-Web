import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { supabase } from '../utils/supabase';

const CreateClass = () => {
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('Clases')
      .insert([
        { nombre: className, materia: subject, fecha: date, horario: time }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Class created:', data);
      // Clear form fields after successful submission
      setClassName('');
      setSubject('');
      setDate('');
      setTime('');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-50">
        <Col>
          <h1 className="text-center mb-4">Crear Clase</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la Clase</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de la clase"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Materia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la materia"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Horario</Form.Label>
              <Form.Control
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Crear Clase
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateClass;
