import supabase from './supabaseClient'; // Asegúrate de ajustar la ruta según tu estructura de archivos

async function loginUser(username, contraseña) {
    // Primero, recupera el usuario con el nombre de usuario dado
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('Username', username)
        .single();

    if (error || !users) {
        console.error('Error en el inicio de sesión:', error);
        return null;
    }

    // Compara la contraseña proporcionada con la almacenada
    const isPasswordValid = await verifyPassword(contraseña, users.Contraseña);

    if (!isPasswordValid) {
        console.error('Contraseña incorrecta');
        return null;
    }
return(
<div>
<div>
<h1>Inicio de Sesión</h1>
<form id="login-form">
    <label for="username">Nombre de Usuario:</label>
    <br><input type="text" id="username" name="username" required></input></br>

    <label for="contraseña">Contraseña:</label>
   <br><input type="password" id="contraseña" name="contraseña" required> </input></br>

    <button type="submit">Iniciar Sesión</button>
</form>
<p id="login-message"></p>
<a href="register.html">¿No tienes cuenta? Regístrate aquí.</a>
</div>
</div>
);
    
}

// Simulación de verificación (usa bcrypt o similar en producción)
async function verifyPassword(password, hashedPassword) {
    // Aquí deberías usar una librería de verificación en un entorno seguro
    return password === hashedPassword; // Esto no es seguro, solo para demostración
}

export default loginUser;