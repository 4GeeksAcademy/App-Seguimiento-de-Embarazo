import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUser } from "../services/backendServices.js";


export const Register = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState({
        email: "",
        password: "",
        nombre: "",
        apellido: ""

    })


    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createUser(user, navigate);
    }




    return (
        <div className="home-hero">
            <div className="container mt-5 mb-2">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <i className="fas fa-user-plus fa-4x text-primary mb-3"></i>
                                </div>


                                <h3>Create a user</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label" >Email</label>
                                        <input type="text"
                                            name="email"
                                            placeholder="Enter your email"
                                            className="form-control" value={user.email}
                                            onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            className="form-control" value={user.password}
                                            onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre</label>
                                        <input type="text"
                                            name="nombre"
                                            placeholder="Tu nombre"
                                            className="form-control" value={user.nombre}
                                            onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="apellido" className="form-label">Apellido</label>
                                        <input type="text"
                                            name="apellido"
                                            placeholder="Tu apellido"
                                            className="form-control" value={user.apellido}
                                            onChange={handleChange} />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" >Create a user</button>
                                </form>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


}