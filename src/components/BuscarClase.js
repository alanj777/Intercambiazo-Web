import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import './CssBusqueda.css';
function BuscarClase() {
    const [clases, setClases] = useState([]);
    const [materiasMap, setMateriasMap] = useState({});
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
                console.log('IDs de materias obtenidos:', materiaIds); // Depuración

                // Obtener las materias correspondientes
                let { data: materiasData, error: materiasError } = await supabase
                    .from('Materia')
                    .select('*');

                if (materiasError) {
                    console.error('Error al obtener materias:', materiasError);
                } else {
                    console.log('Datos de materias obtenidos:', materiasData); // Depuración
                    
                    // Crear un objeto para acceder a los nombres de las materias por ID
                    const materiasMap = materiasData.reduce((acc, materia) => {
                        acc[materia.IDMateria] = materia.Nombre; // Ajustar nombre del campo si es necesario
                        return acc;
                    }, {});

                    console.log('Mapa de materias:', materiasMap); // Depuración
                    setMateriasMap(materiasMap);
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
                    {clases.map((clase) => {
                        // Verificar los datos de cada clase
                        console.log('Clase:', clase);
                        console.log('Nombre de Materia:', materiasMap[clase.IDMateria]);

                        return (
                            <li key={clase.IdClase}>
                                <h2>{clase.NombreClase}</h2>
                                <p>{clase.Descripcion}</p>
                                <p><strong>Fecha:</strong> {clase.Fecha}</p>
                                <p><strong>Materia:</strong> {materiasMap[clase.IDMateria] || 'Desconocida'}</p>
                                <button variant="primary" className="my-3 main-button"> Tomar Clase</button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default BuscarClase;
