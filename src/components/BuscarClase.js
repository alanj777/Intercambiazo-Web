import React, {useEffect, useState} from "react";
import { supabase } from "../utils/supabase";

function BuscarClase()
{
    const [clases, setClases] = useState([]);
    var UserLogged = 2; //Esto decide el ID de quién trae las clases

    useEffect (() => {
        
        const getData = async () => {
        // Obtener las clases con IDUsuarioReceptor = 2
        let { data: clasesData, error: clasesError } = await supabase
          .from('Clase')
          .select('*')
          .eq('IDUsuarioReceptor', UserLogged);

        if (clasesError) {
          console.error(clasesError);
        } else {
            setClases(clasesData)
            }  
        }

        getData();
    });

    return(
        <div>
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
                            <p><strong>Hora:</strong> {clase.Hora}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </div>
    );
}

export default BuscarClase