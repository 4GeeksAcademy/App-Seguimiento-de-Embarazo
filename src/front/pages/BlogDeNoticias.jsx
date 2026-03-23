import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { BlogCard } from '../components/BlogCard';
import { fetchNoticiasSalud } from '../services/backendServices.js';

export const BlogDeNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarNoticias = async () => {
      setCargando(true);
      
      const resultado = await fetchNoticiasSalud();
      
      if (resultado.success) {
        setNoticias(resultado.data);
        setError(null);
      } else {
        setError('Error');
        setNoticias(resultado.data);
      }
      
    };

    cargarNoticias();
  }, []);

  return (
    <div className="container mt-5 mb-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          <i className="fas fa-newspaper me-3"></i>
          Blog de Noticias 
        </h1>
        <p className="lead text-muted">
          Información de CuidadoDeSalud.gov
        </p>
        {error && (<div className="alert alert-warning mt-3" role="alert">{error}</div>)}
      </div>
      <div className="row">
        {noticias.map(noticia => (<BlogCard key={noticia.id} noticia={noticia} />))}
      </div>
      <div className="text-center mt-5">
        <button className="btn btn-primary btn-lg px-5 py-3 rounded-pill"
          onClick={() => navigate("/contact")}>
          <i className="fas fa-envelope me-2"></i>
          Contáctanos
        </button>
      </div>
    </div>
  );
};