import React, { useEffect, useState } from "react";


const Recordatorios = () => {
    const API_URL = "https://playground.4geeks.com/todo";
    const USER = "Alberto";

    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");

    // Obtener usuario o crearlo
    const getUser = async () => {
        const response = await fetch(`${API_URL}/users/${USER}`);

        if (!response.ok) {
            await createUser();
            return;
        }

        const data = await response.json();
        setTodos(data.todos || []);
    };

    // Crear usuario
    const createUser = async () => {
        await fetch(`${API_URL}/users/${USER}`, {
            method: "POST",
        });
        setTodos([]);
    };

    // Agregar tarea
    const agregarTarea = async (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const nuevaTarea = {
                label: inputValue,
                is_done: false,
            };

            await fetch(`${API_URL}/todos/${USER}`, {
                method: "POST",
                body: JSON.stringify(nuevaTarea),
                headers: { "Content-Type": "application/json" },
            });

            await cargarTareas();
            setInputValue("");
        }
    };

    // Cargar tareas
    const cargarTareas = async () => {
        const response = await fetch(`${API_URL}/users/${USER}`);
        const data = await response.json();
        setTodos(data.todos || []);
    };

    // Eliminar tarea
    const eliminarTarea = async (todoId) => {
        await fetch(`${API_URL}/todos/${todoId}`, {
            method: "DELETE",
        });
        await cargarTareas();
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">

                    {/* Header */}
                    <div className="text-center mb-4">
                        <h2 className="display-6 fw-bold text-primary mb-2">
                            <i className="fas fa-bell me-2"></i>
                            Mis Recordatorios
                        </h2>
                        <p className="text-muted">
                            Organiza tus tareas y citas importantes
                        </p>
                    </div>

                    {/* Card principal */}
                    <div className="card shadow border-0">
                        <div className="card-body p-4">

                            {/* Input para nueva tarea */}
                            <div className="mb-4">
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-primary text-white">
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Escribe tu recordatorio aquí..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={agregarTarea}
                                    />
                                </div>
                                <small className="text-muted fst-italic d-block mt-2">
                                    Presiona Enter para añadir
                                </small>
                            </div>

                            {/* Lista de tareas */}
                            <ul className="list-group">
                                {todos.length === 0 ? (
                                    <div className="alert alert-light text-center" role="alert">
                                        <i className="fas fa-clipboard-list fa-3x text-muted mb-3 d-block"></i>
                                        <p className="text-muted mb-0">
                                            No hay recordatorios. ¡Añade uno nuevo!
                                        </p>
                                    </div>
                                ) : (
                                    todos.map((todo) => (
                                        <li
                                            key={todo.id}
                                            className="list-group-item d-flex justify-content-between align-items-center mb-2"
                                        >
                                            <div>
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                {todo.label}
                                            </div>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarTarea(todo.id)}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>

                            {/* Contador de tareas */}
                            {todos.length > 0 && (
                                <div className="mt-3 text-center">
                                    <span className="badge bg-primary px-3 py-2">
                                        {todos.length} {todos.length === 1 ? 'recordatorio' : 'recordatorios'}
                                    </span>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Recordatorios;