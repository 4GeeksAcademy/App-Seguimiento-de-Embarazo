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
    
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = 'https://www.cuidadodesalud.gov/api/index.json';
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
    
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
      {
        tema: "embarazada 2",
        url: "https://img.freepik.com/fotos-premium/feliz-mujer-embarazada_256588-412.jpg"
      },
      {
        tema: "embarazada 3",
        url: "https://media.healthdirect.org.au/images/inline/original/pregnancy-in-pictures-96d1f2.png"
      },
      {
        tema: "embarazada 4",
        url: "https://marketplace.canva.com/0CzjA/MAG2mt0CzjA/1/tl/canva-cute-baby-lying-on-beige-carpet%2C-closeup-MAG2mt0CzjA.jpg"
      },
      {
        tema: "doctores obstetras",
        url: "https://d5tnfl9agh5vb.cloudfront.net/uploads/2020/08/upn_blog_sal_dia-int-obstetras_26-ago.jpg"
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

    const datosRespaldo = [
      {
        id: 1,
        titulo: "La importancia del control prenatal durante el embarazo",
        descripcion: "Los chequeos regulares durante el embarazo son fundamentales para garantizar la salud de la madre y el bebé. Descubre qué esperar en cada trimestre.",
        imagen: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg",
        urlOriginal: null
      },
      {
        id: 2,
        titulo: "Alimentación saludable para futuras mamás",
        descripcion: "Una nutrición adecuada durante el embarazo es esencial. Conoce los alimentos que no pueden faltar en tu dieta y cuáles debes evitar.",
        imagen: "https://images.pexels.com/photos/1556652/pexels-photo-1556652.jpeg",
        urlOriginal: null
      },
      {
        id: 3,
        titulo: "Beneficios de la lactancia materna para el recién nacido",
        descripcion: "La leche materna proporciona todos los nutrientes que tu bebé necesita en sus primeros meses, además de fortalecer su sistema inmunológico.",
        imagen: "https://mcpress.mayoclinic.org/uploads/2022/08/NewbornScreeningxGettyImagesx583992212-1120x640.jpg",
        urlOriginal: null
      },
      {
        id: 4,
        titulo: "Ejercicios seguros durante el embarazo",
        descripcion: "Mantenerse activa durante la gestación trae múltiples beneficios. Te mostramos las actividades más recomendadas por especialistas.",
        imagen: "https://cdn.prod.website-files.com/66bd394eedeb9d6ee29898c6/682f5450a046c241920c1e6f_Three%20doctors%20standing%20side%20by%20side%2C%20crossing%20their%20arms.jpg",
        urlOriginal: null
      },
      {
        id: 5,
        titulo: "Preparación para el parto: qué debes saber",
        descripcion: "Conoce las señales de trabajo de parto, los tipos de parto y cómo prepararte para este momento tan importante.",
        imagen: "https://www.babyfresh.co/cdn/shop/articles/Como-conectar-con-tu-bebe-durante-el-embarazo_e3a8ea7a-bf43-464c-ac01-63e496c1ca58.jpg?v=1765291713",
        urlOriginal: null
      },
      {
        id: 6,
        titulo: "Cuidados postparto: recuperación después del nacimiento",
        descripcion: "El periodo postparto es crucial para la recuperación física y emocional. Consejos para una recuperación saludable.",
        imagen: "https://img.freepik.com/fotos-premium/feliz-mujer-embarazada_256588-412.jpg",
        urlOriginal: null
      },
      {
        id: 7,
        titulo: "Primeros cuidados del recién nacido en casa",
        descripcion: "Todo lo que necesitas saber sobre baño, alimentación, sueño y cuidados básicos para tu bebé en sus primeros días.",
        imagen: "https://media.healthdirect.org.au/images/inline/original/pregnancy-in-pictures-96d1f2.png",
        urlOriginal: null
      },
      {
        id: 8,
        titulo: "Cómo elegir al pediatra adecuado para tu bebé",
        descripcion: "Factores a considerar al seleccionar al profesional que acompañará el crecimiento y desarrollo de tu hijo.",
        imagen: "https://marketplace.canva.com/0CzjA/MAG2mt0CzjA/1/tl/canva-cute-baby-lying-on-beige-carpet%2C-closeup-MAG2mt0CzjA.jpg",
        urlOriginal: null
      },
      {
        id: 9,
        titulo: "Vacunación durante el embarazo y primeros meses del bebé",
        descripcion: "Calendario de vacunación recomendado para proteger a la madre y al recién nacido.",
        imagen: "https://d5tnfl9agh5vb.cloudfront.net/uploads/2020/08/upn_blog_sal_dia-int-obstetras_26-ago.jpg",
        urlOriginal: null
      }
    ];
    
    
    return { 
      success: false, 
      error: error.message,
      data: datosRespaldo
    };
  }
};