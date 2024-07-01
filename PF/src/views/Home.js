import React from 'react';
import ContactList from '../components/ContactList';
import { getContacts } from '../controllers/contactController';

const Home = () => {
    const contacts = getContacts();

    return (
        <div>
            <h1>Alumnos Recomendados</h1>
            <ContactList contacts={contacts} />
            <div className="add-button">
                <button><h3>Agregar Intercoins +</h3></button>
            </div>
        </div>
    );
};

export default Home;
