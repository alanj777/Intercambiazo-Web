import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import './CssBusqueda.css';

function GestionarClases() {
    const [clases, setClases] = useState([]);
    const [materiasMap, setMateriasMap] = useState({});
    const UserLogged = 2; // ID del usuario que trae las clases

    useEffect(() => {
        const getData = async () => {
            // Obtener las clases con IDUsuarioReceptor = 2
            let { data: clasesData, error: clasesError } = await supabase
                .from('Clase')
                .select('*')
                .eq('IDUsuarioReceptor', UserLogged);

            if (clasesError) {
                console.error('Error al obtener clases:', clasesError);
                return;
            }

            if (clasesData) {
                setClases(clasesData);

                // Obtener las materias correspondientes
                let { data: materiasData, error: materiasError } = await supabase
                    .from('Materia')
                    .select('*');

                if (materiasError) {
                    console.error('Error al obtener materias:', materiasError);
                } else {
                    // Crear un objeto para acceder a los nombres de las materias por ID
                    const materiasMap = materiasData.reduce((acc, materia) => {
                        acc[materia.IDMateria] = materia.Nombre;
                        return acc;
                    }, {});
                    setMateriasMap(materiasMap);
                }
            }
        };

        getData();
    }, []);

    const handleDeleteClass = async (idClase) => {
        const { error } = await supabase
            .from('Clase')
            .delete()
            .eq('IDClase', idClase);

        if (error) {
            console.error('Error al eliminar clase:', error);
        } else {
            // Actualizar el estado para eliminar la clase de la lista
            setClases(clases.filter(clase => clase.IDClase !== idClase));
        }
    };

    return (
        <div>
            <h1>Gestionar Clases</h1>
            {clases.length === 0 ? (
                <p>No hay clases disponibles.</p>
            ) : (
                <ul>
                    {clases.map((clase) => (
                        <li key={clase.IDClase}>
                            <h2>{clase.NombreClase}</h2>
                            <p>{clase.Descripcion}</p>
                            <p><strong>Fecha:</strong> {new Date(clase.Fecha).toLocaleString()}</p>
                            <p><strong>Materia:</strong> {materiasMap[clase.IDMateria] || 'Desconocida'}</p>
                            <button
                                className="my-3 main-button"
                                onClick={() => handleDeleteClass(clase.IDClase)}
                            >
                                Eliminar Clase
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GestionarClases;
