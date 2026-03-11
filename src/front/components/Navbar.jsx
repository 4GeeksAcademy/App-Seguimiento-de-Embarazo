import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					onClick={() => setMenuOpen(!menuOpen)}
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className={`navbar-collapse collapse justify-content-end ${menuOpen ? "show" : ""}`}>
					<ul className="navbar-nav align-items-lg-center">

						<li className="nav-item">
							<Link className="nav-link custom-link" to="/" onClick={() => setMenuOpen(false)}>Home</Link>
						</li>

						<li className="nav-item">
							<Link className="nav-link custom-link" to="/Servicios" onClick={() => setMenuOpen(false)}>Servicios</Link>
						</li>

						<li className="nav-item">
							<Link className="nav-link custom-link" to="/contact" onClick={() => setMenuOpen(false)}>Contacto</Link>
						</li>

						<li className="nav-item">
							<Link className="nav-link custom-link" to="/Blog" onClick={() => setMenuOpen(false)}>Blog de Noticias</Link>
						</li>

						<li className="nav-item nav-button">
							<Link className="custom-btn" to="/Login" onClick={() => setMenuOpen(false)}>
								Login
							</Link>
						</li>

					</ul>
				</div>
			</div>
		</nav>
	);
};