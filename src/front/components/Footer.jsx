import { useState } from 'react';

export const Footer = () => {
  const [idiomaSeleccionado, setIdiomaSeleccionado] = useState('Español');
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  return (
    <footer className="bg-light py-4 mt-auto">
      <div className="container">
        <div className="row align-items-start">

          <div className="col-12 col-md-3 mb-4 mb-md-0">
            <div className="text-center text-md-start">
              <h6 className="mb-2 fw-bold">Idioma</h6>
              <div className="mb-3 d-flex justify-content-center justify-content-md-start">
                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle btn-sm" type="button"
                    onClick={() => setDropdownAbierto(!dropdownAbierto)}
                    aria-expanded={dropdownAbierto}>
                    {idiomaSeleccionado}
                  </button>
                  {dropdownAbierto && (
                    <ul className="dropdown-menu show">
                      <li>
                        <button className="dropdown-item"
                          onClick={() => {
                            setIdiomaSeleccionado('Español');
                            setDropdownAbierto(false);
                          }}>
                          Español
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setIdiomaSeleccionado('English');
                            setDropdownAbierto(false);
                          }}>

                          English
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setIdiomaSeleccionado('Português');
                            setDropdownAbierto(false);
                          }}>
                          Português
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
              <div className="text-muted small">
                <p className="mb-1">© Copyright 2026</p>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-md-3 mb-4 mb-md-0">
            <div className="d-flex flex-column align-items-center align-items-md-start">
              <h6 className="mb-2 fw-bold">Redes Sociales</h6>
              <div className="d-flex gap-3 flex-wrap justify-content-center justify-content-md-start">
                <a href="https://facebook.com" target="_blank" className="text-dark fs-4" rel="noreferrer">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://instagram.com" target="_blank" className="text-dark fs-4" rel="noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="https://twitter.com" target="_blank" className="text-dark fs-4" rel="noreferrer">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="https://youtube.com" target="_blank" className="text-dark fs-4" rel="noreferrer">
                  <i className="bi bi-youtube"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" className="text-dark fs-4" rel="noreferrer">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-3 mb-4 mb-md-0">
            <div className="text-center text-md-start">
              <h6 className="fw-bold mb-2">Sobre Nosotros</h6>
              <nav className="d-flex flex-column align-items-center align-items-md-start">
                <a href="/informacion" className="text-dark text-decoration-none mb-1">
                  Información
                </a>
                <a href="/contact" className="text-dark text-decoration-none mb-1">
                  Contacto
                </a>
              </nav>
            </div>
          </div>

          <div className="col-12 col-md-3">
            
            <div className="text-center text-md-start">
              <h6 className="fw-bold mb-2">Noticias Médicas</h6>
              <nav className="d-flex flex-column align-items-center align-items-md-start">
                <a href="/noticias" className="text-dark text-decoration-none mb-1">
                  Noticias Sobre el Parto
                </a>
                <a href="/noticiasEm" className="text-dark text-decoration-none mb-1">
                  Noticias Sobre el Embarazo
                </a>
                <a href="/avances" className="text-dark text-decoration-none mb-1">
                  Avances Médicos
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="text-center">
              <h6 className="text-muted mb-2">Desarrollado por</h6>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <a href="https://github.com/Contreras486" target="_blank" rel="noreferrer" className="text-decoration-none">
                  <span className="badge bg-secondary px-3 py-2">Alberto</span>
                </a>
                <a href="https://github.com/StivGav" target="_blank" rel="noreferrer" className="text-decoration-none">
                  <span className="badge bg-secondary px-3 py-2">Brandon</span>
                </a>
                <a href="https://github.com/NachoRocchia" target="_blank" rel="noreferrer" className="text-decoration-none">
                  <span className="badge bg-secondary px-3 py-2">Nacho</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-4 mb-0" />
        <div className="row mt-2">
          <div className="col-12 text-center text-muted small">
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 gap-sm-3">
              <span>Información legal</span>
              <span>Términos y condiciones</span>
              <span>Política de privacidad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
