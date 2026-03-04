import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

export const Navbar = () => {

	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav className={`navbar navbar-expand-lg bg-white fixed-top ${scrolled ? "scrolled" : ""}`}>
			<div className="container navbar-inner">

				<Link className="navbar-brand" to="/">
					Logo
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
							<Link className="nav-link custom-link" to="/Contacto" onClick={() => setMenuOpen(false)}>Contacto</Link>
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