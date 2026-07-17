import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

function Navbar({ isAuthenticated, onLogout }) {
	const navigate = useNavigate();

	function handleLogout() {
		if (onLogout) onLogout();
		navigate('/');
	}

	return (
		<nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', marginBottom: 18 }}>
			<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
				<Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
					<img src={logo} alt="AI Resume Screening" width="38" height="38" style={{ borderRadius: 12, background: '#0f172a' }} />
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div style={{ fontWeight: 700, fontSize: 18, color: 'white' }}>AI Resume Screening</div>
						<div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Smart candidate matching</div>
					</div>
				</Link>
			</div>
			<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
				<Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
				{isAuthenticated ? (
					<>
						<Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Dashboard</Link>
						<button className="btn-primary" onClick={handleLogout}>Logout</button>
					</>
				) : (
					<Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Login</Link>
				)}
			</div>
		</nav>
	);
}

export default Navbar;
