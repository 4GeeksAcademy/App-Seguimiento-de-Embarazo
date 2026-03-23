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
      },
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

export const LoginUser = async (user) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Invalid mail or password");
  }

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Login successful!");
    return data;
  }
};

export const createRegistroEmbarazo = async (registro, navigate) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/registro-embarazo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registro),
      },
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
      navigate("/dashboard");
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
      },
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

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};


export const fetchNoticiasSalud = async () => {
  try {
    const API_KEY = import.meta.env.VITE_CORS_API_KEY;
    
    const baseUrl = 'https://corsproxy.io/';
    const targetUrl = 'https://www.cuidadodesalud.gov/api/index.json';
    
    const proxyUrl = `${baseUrl}?key=${API_KEY}&url=${encodeURIComponent(targetUrl)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    const palabrasClave = [
      'embarazo', 'pregnancy', 'materno', 'maternal', 'prenatal','bebé', 'baby', 'nacimiento', 'birth', 'parto', 'childbirth',
      'lactancia', 'breastfeeding', 'recién nacido', 'newborn', 'obstetricia', 'obstetrics', 'gestación', 'gestation', 'fetal','postparto', 'postpartum'
    ];
    
    const contenidoFiltrado = data.filter(item => {
      const titulo = (item.title || '').toLowerCase();
      const tituloEs = (item['es-title'] || '').toLowerCase();
      const bite = (item.bite || '').toLowerCase();
      
      return palabrasClave.some(palabra => 
        titulo.includes(palabra) || 
        tituloEs.includes(palabra) || 
        bite.includes(palabra)
      );
    });
    
    const imagenesEmbarazo = [
      {
        tema: "Ecografía",
        url: "https://images.pexels.com/photos/1556652/pexels-photo-1556652.jpeg"
      },
      {
        tema: "Embarazo",
        url: "https://www.babyfresh.co/cdn/shop/articles/Como-conectar-con-tu-bebe-durante-el-embarazo_e3a8ea7a-bf43-464c-ac01-63e496c1ca58.jpg?v=1765291713"
      },
      {
        tema: "Doctores",
        url: "https://cdn.prod.website-files.com/66bd394eedeb9d6ee29898c6/682f5450a046c241920c1e6f_Three%20doctors%20standing%20side%20by%20side%2C%20crossing%20their%20arms.jpg"
      },
      {
        tema: "Control médico",
        url: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg"
      },
      {
        tema: "Bebé recién nacido",
        url: "https://mcpress.mayoclinic.org/uploads/2022/08/NewbornScreeningxGettyImagesx583992212-1120x640.jpg"
      },
    ];
    
    const noticiasFormateadas = contenidoFiltrado.slice(0, 9).map((item, index) => {
      const titulo = item['es-title'] || item.title || 'Título no disponible';
      
      return {
        id: index,
        titulo: titulo,
        descripcion: item.bite || item['es-bite'] || 'Contenido educativo sobre salud materna',
        imagen: imagenesEmbarazo[index % imagenesEmbarazo.length].url,
        fecha: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        urlOriginal: item.url ? `https://www.cuidadodesalud.gov${item.url}` : null
      };
    });
    
    console.log(`Se encontraron ${contenidoFiltrado.length} noticias, mostrando ${noticiasFormateadas.length}`);
    
    return { success: true, data: noticiasFormateadas };
    
  } catch (error) {
    console.error("Error:", error);
    
    return { 
      success: false, 
      error: error.message,
      data: datosRespaldo
    };
  }
};
