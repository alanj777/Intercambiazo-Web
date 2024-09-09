import supabase from './supabaseClient'; // Asegúrate de ajustar la ruta según tu estructura de archivos

async function registerUser(nombre, apellido, username, contraseña, telefono) {
    // Primero, cifrar la contraseña antes de almacenarla (esto es solo un ejemplo básico)
    // En un entorno de producción, haz esto en el servidor y no en el cliente.
    const hashedPassword = await hashPassword(contraseña);

    const { data, error } = await supabase
        .from('users')
        .insert([
            { 
                Nombre: nombre,
                Apellido: apellido,
                Username: username,
                Contraseña: hashedPassword,
                Teléfono: telefono
            }
        ]);

    if (error) {
        console.error('Error en el registro:', error);
        return null;
    }

    return(
        <div>
            <div>

        <h1>Registro de Usuario</h1>
        <form id="register-form">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required/><br/>
    
            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" required/><br/>
    
            <label for="username">Nombre de Usuario:</label>
            <input type="text" id="username" name="username" required/><br/>
    
            <label for="contraseña">Contraseña:</label>
            <input type="password" id="contraseña" name="contraseña" required/><br/>
    
            <label for="telefono">Teléfono:</label>
            <input type="text" id="telefono" name="telefono" required/><br/>
    
            <button type="submit">Registrar</button>
        </form>
        <p id="register-message"></p>
        </div>
        </div>
    )
}

// Simulación de cifrado (usa bcrypt o similar en producción)
async function hashPassword(password) {
    // Aquí deberías usar una librería de hashing en un entorno seguro
    return password; // Esto no es seguro, solo para demostración
}
