export const createUser = async (user, navigate) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/register`,  
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Error al crear usuario:", data.error);
      alert(data.error || "Error al crear usuario");  
      return;
    }
    
    console.log("Usuario creado exitosamente:", data);
    alert("Usuario creado exitosamente. Ahora puedes iniciar sesión.");
    navigate("/login");  
    
  } catch (error) {
    console.error("Error de red:", error);
    alert("Error al conectar con el servidor");
  }
};




export const LoginUser = async (user, navigate) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/login`,  
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );
  
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 400) {
      alert("Email or password invalid");
      return;
    }
  }
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  alert("Login successful!");
  navigate("/registroEmbarazo");
};



export const createRegistroEmbarazo = async (registro, navigate) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/registroEmbarazo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registro),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error al crear registro de embarazo:", data.error);
      alert(data.error || "Error al crear registro");
      return;
    }

    console.log("Registro de embarazo creado:", data);
    alert("Registro de embarazo creado correctamente");

      if (navigate) {
      navigate("/panelPersonal");  
    }

  } catch (error) {
    console.error("Error de red:", error);
    alert("Error al conectar con el servidor");
  }
};


export const sendContactMessage = async (contactData, navigate) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      alert(data.error || "Error al enviar el mensaje");
      return false;
    }
    
    alert("¡Mensaje enviado con éxito! Te responderemos a la brevedad.");
    
    if (navigate) {
      navigate("/");
    }
    
    return true;
    
  } catch (error) {
    alert("Error al conectar con el servidor");
    return false;
  }
};