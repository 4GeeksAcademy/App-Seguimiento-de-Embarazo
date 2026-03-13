// services/backendServices.js

export const LoginUser = async (userData, navigate) => {
  try {
    // Usamos la URL de tu variable de entorno
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      },
    );

    const data = await response.json();

    if (response.ok) {
      // Guardamos sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigimos al Dashboard como pide tu Login.jsx
      navigate("/dashboard");
      return data;
    } else {
      // Esto lo captura el 'catch' de tu Login.jsx para mostrar el error
      throw new Error(data.error || "Invalid credentials");
    }
  } catch (error) {
    console.error("Error en LoginUser:", error);
    throw error; // Re-lanzamos para que el componente Login lo maneje
  }
};

export const createUser = async (userData, navigate) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      },
    );

    const data = await response.json();

    if (response.ok) {
      // Tras registrarse, lo mandamos a loguearse
      navigate("/login");
      return data;
    } else {
      alert(data.error || "Error al crear la cuenta");
    }
  } catch (error) {
    console.error("Error en createUser:", error);
  }
};

export const sendContactMessage = async (contactData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/contact`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      },
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al enviar");

    return true;
  } catch (error) {
    console.error("Error en contacto:", error);
    return false;
  }
};
