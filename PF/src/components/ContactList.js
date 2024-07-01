import React from 'react';
import ContactCard from './ContactCard';

const ContactList = ({ contacts }) => {
    return (
        <div className="container">
            {contacts.map((contact, index) => (
                <ContactCard 
                    key={index}
                    name={contact.name}
                    subject={contact.subject}
                    imageUrl={contact.imageUrl}
                />
            ))}
        </div>
    );
};

export default ContactList;
