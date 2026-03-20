import { useState, useContext } from "react"; // 1. Importamos useContext
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../services/backendServices";
import { Context } from "../appContext";

export const Login = () => {
    const { actions } = useContext(Context); // 3. Traemos las actions del estado global
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Capturamos la respuesta de la función
            const data = await LoginUser(user);

            if (data && data.token) {
                // 4. VITAL: Actualizamos el estado global para que la Navbar reaccione
                // (Asegúrate de que esta acción exista en tu appContext)
                actions.setToken(data.token);

                // Decidimos la ruta basada en si tiene o no embarazo registrado:
                if (data.tiene_embarazo) {
                    navigate("/dashboard");
                } else {
                    navigate("/registroEmbarazo");
                }
            }
        } catch (error) {
            setError("Invalid mail or password");
        }
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <div className="container mt-2 mb-2">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="fas fa-sign-in-alt fa-4x text-primary mb-3"></i>
                            </div>
                            <h3 className="text-center mb-4">Log in</h3>
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        <i className="fas fa-envelope me-2"></i>Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Ingresa tu email"
                                        className="form-control"
                                        value={user.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">
                                        <i className="fas fa-lock me-2"></i>Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        className="form-control"
                                        value={user.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100 mb-3">
                                    <i className="fas fa-sign-in-alt me-2"></i>Log in
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <p className="text-muted mb-2">¿No tienes una cuenta?</p>
                                <button
                                    onClick={handleRegisterClick}
                                    className="btn btn-outline-primary w-100">
                                    <i className="fas fa-user-plus me-2"></i>Regístrate aquí
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};