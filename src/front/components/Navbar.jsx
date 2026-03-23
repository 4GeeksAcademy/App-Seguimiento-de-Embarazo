import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../appContext";
import "../styles/navbar.css";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleLogout = () => {
		actions.logout(); 
		setMenuOpen(false);
		navigate("/"); 
	};

	return (
		<nav className={`navbar navbar-expand-lg bg-white fixed-top ${scrolled ? "scrolled" : ""}`}>
			<div className="container navbar-inner">

				<Link to="/">
					<img src="/logo.png" width="70" alt="logo" />
				</Link>
				<h6 className="fw-bold">
					BabyFlow
				</h6>

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
							<Link className="nav-link custom-link" to="/informacion" onClick={() => setMenuOpen(false)}>Información</Link>
						</li>

						<li className="nav-item">
							<Link className="nav-link custom-link" to="/contact" onClick={() => setMenuOpen(false)}>Contacto</Link>
						</li>
						

						<li className="nav-item">
							{store.token && (
								<Link className="nav-link custom-link" to="/dashboard" onClick={() => setMenuOpen(false)}>
									Panel Personal
								</Link>
							)}
						</li>
						<li className="nav-item nav-button">
							{!store.token ? (
								<Link className="custom-btn" to="/Login" onClick={() => setMenuOpen(false)}>
									Login
								</Link>
							) : (
								<button className="custom-btn" onClick={handleLogout} style={{ border: 'none', cursor: 'pointer', background: 'transparent' }}>
									Log Out
								</button>
							)}
						</li>

					</ul>
				</div>

			</div>
		</nav>
	);
};