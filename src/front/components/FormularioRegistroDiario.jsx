import React, { useState } from "react";

export const FormularioRegistroDiario = ({ onRegistroExitoso }) => {
    const [registro, setRegistro] = useState({
        peso: "",
        notas: "",
        estado_animo: "Feliz", 
        nivel_energia: 5
    });

    const handleChange = (e) => {
        setRegistro({ ...registro, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const savedUser = JSON.parse(localStorage.getItem("user"));
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registro-diario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...registro,
                usuario_id: savedUser.id,
                fecha: new Date().toISOString().split('T')[0] // Fecha de hoy
            })
        });

        if (response.ok) {
            alert("¡Registro guardado!");
            setRegistro({ peso: "", notas: "", estado_animo: "Feliz", nivel_energia: 5 });
            if (onRegistroExitoso) onRegistroExitoso(); // Para recargar el Dashboard
        }
    };

    return (
        <div className="card p-4 shadow-sm mb-4">
            <h4 className="mb-3 text-success">¿Cómo te sientes hoy?</h4>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Peso (kg)</label>
                        <input type="number" step="0.1" name="peso" className="form-control" 
                               value={registro.peso} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Ánimo</label>
                        <select name="estado_animo" className="form-select" onChange={handleChange}>
                            <option value="Feliz">Feliz </option>
                            <option value="Cansada">Cansada </option>
                            <option value="Ansiosa">Ansiosa </option>
                        </select>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Notas del día</label>
                    <textarea name="notas" className="form-control" rows="2" 
                              value={registro.notas} onChange={handleChange}></textarea>
                </div>
                <button type="submit" className="btn btn-success w-100">Guardar Registro</button>
            </form>
        </div>
    );
};