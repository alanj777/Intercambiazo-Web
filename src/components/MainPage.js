// src/components/MainPage.js
import React from 'react';
import { Container, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'; // Asegúrate de crear y ajustar este archivo de CSS

const MainPage = () => {
  const navigate = useNavigate();

  const handleTiendaPuntos = () => {
    alert('Error, página en proceso de creación (laburantes sobreexplotados)');
  };

  return (
    <Container className="text-center my-4">
      <h1 className="mb-4">Bienvenido a la Página Principal</h1>
      <div className="d-flex flex-column align-items-center">
        <Button
          variant="primary"
          className="my-3 main-button"
          onClick={() => navigate('/create-class')}
        >
          Crear Clases
        </Button>
        <Button
          variant="primary"
          className="my-3 main-button"
          onClick={() => navigate('/BuscarClase')}
          
        >
          Buscar Clases
        </Button>
        <Button
          variant="primary"
          className="my-3 main-button"
          onClick={handleTiendaPuntos}
        >
          Administrar Clases
        </Button>
        <Button
          variant="primary"
          className="my-3 main-button"
          onClick={handleTiendaPuntos}
        >
          Clases Tomadas
        </Button>
        <Button
          variant="primary"
          className="my-3 main-button"
          onClick={() => window.location.href = 'http://localhost:3000/wallet'}
        >
          Billetera
        </Button>
        <Button
          variant="primary"
          className="my-3 main-button"
          onClick={() => navigate('/')}
        >
          Usuarios
        </Button>
      </div>
    </Container>
  );
};

export default MainPage;
