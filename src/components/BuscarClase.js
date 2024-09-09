import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

function BuscarClase() {
    const [clases, setClases] = useState([]);
    const [materias, setMaterias] = useState({});
    const UserLogged = 2; // Esto decide el ID de quién trae las clases

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

                // Obtener los IDs de materias de las clases
                const materiaIds = clasesData.map(clase => clase.IdMateria);
                console.log('IDs de materias:', materiaIds); // Debugging

                // Obtener las materias correspondientes
                let { data: materiasData, error: materiasError } = await supabase
                    .from('Materia') // Nombre correcto de la tabla
                    .select('*')

                if (materiasError) {
                    console.error('Error al obtener materias:', materiasError);
                } else {
                    console.log('Datos de materias:', materiasData); // Debugging
                    setMaterias(materiasData);

                    // Crear un objeto para acceder a los nombres de las materias por ID
                    const materiasMap = materiasData.reduce((acc, materia) => {
                        acc[materia.IdMateria] = materia.NombreMateria; // Ajustar nombre del campo si es necesario
                        return acc;
                    }, {});
                    
                    console.log('Mapa de materias:', materiasMap); // Debugging
                }
            }
        };

        getData();
    }, []);

    return (
        <div>
            <h1>Clases Disponibles</h1>
            {clases.length === 0 ? (
                <p>No hay clases disponibles.</p>
            ) : (
                <ul>
                    {clases.map((clase) => (
                        <li key={clase.IdClase}>
                            <h2>{clase.NombreClase}</h2>
                            <p>{clase.Descripcion}</p>
                            <p><strong>Fecha:</strong> {clase.Fecha}</p>
                            {console.log("Materia: " + materias[0].Nombre + " Clase ID: " + clase.IDMateria)}
                            <p><strong>Materia:</strong> {materias[clase.IdMateria] || 'Desconocida'}</p>
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default BuscarClase;
