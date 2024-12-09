import axios from "axios";

// URL base para la API
const apiUrl = "https://api-nomad.onrender.com/api";

// Función para solicitar el restablecimiento de contraseña
export const requestPasswordReset = async ({ email }) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/reset-password`, { email });
    return response.data;
  } catch (error) {
    console.log("Error response data:", error.response?.data);
    throw new Error(error.response?.data?.message || "Error al solicitar el restablecimiento de contraseña.");
  }
};

// Función para restablecer la contraseña
export const resetPassword = async ({ token, newPassword }) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/reset-password/${token}`, { newPassword });
    return response.data;
  } catch (error) {
    console.log("Error response data:", error.response?.data);
    throw new Error(error.response?.data?.message || "Error al restablecer la contraseña.");
  }
};

export const registerUser = async ({ nombre, email, password }) => {
  try {
    // Usar la URL absoluta para las solicitudes a la API
    const response = await axios.post(
      `${apiUrl}/auth/register`, // URL completa
      { nombre, email, password }
    );
    return response.data;
  } catch (error) {
    console.log("Error response data:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Error al registrar usuario"
    );
  }
};

const loginUser = async ({ email, password }) => {
  try {
    // Usar la URL absoluta para las solicitudes a la API
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log("Error response data:", error.response?.data);  // Para depurar
    throw new Error(error.response?.data?.message || "Error al iniciar sesión.");
  }
};

export { loginUser };
