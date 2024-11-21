import axios from "axios";

export const registerUser = async ({ nombre, email, password }) => {
  try {
    const response = await axios.post(
      "https://api-nomad.onrender.com/api/auth/register",
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
    const response = await axios.post("https://api-nomad.onrender.com/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al iniciar sesión. Verifica tus credenciales.");
  }
};

export { loginUser };
