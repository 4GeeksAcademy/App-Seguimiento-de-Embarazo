import React from 'react';

export const BlogCard = ({ noticia }) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100 shadow border-0">
                <img src={noticia.imagen} 
                    className="card-img-top" 
                    alt={noticia.titulo}
                    style={{ height: '200px', objectFit: 'cover' }}/>
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{noticia.titulo}</h5>
                    <p className="card-text text-secondary flex-grow-1">{noticia.descripcion}</p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        {noticia.urlOriginal && (
                            <a href={noticia.urlOriginal} target="_blank" alt="" className="btn btn-outline-primary btn-sm">
                                Ver original
                            </a>)}
                    </div>
                </div>
            </div>
        </div>
    );
};