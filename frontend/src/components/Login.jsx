import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/login", { username, password });
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        onLogin(true);
        navigate('/dashboard');
      }
    } catch (err) {
      alert("Login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ marginBottom: '20px', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Login</h2>
      <div style={{ display: 'grid', gap: '12px' }}>
        <input 
          type="text"
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--panel-border)',
            background: 'rgba(0, 0, 0, 0.2)',
            color: 'var(--text-primary)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent-primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--panel-border)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--panel-border)',
            background: 'rgba(0, 0, 0, 0.2)',
            color: 'var(--text-primary)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent-primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--panel-border)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button className="btn-primary" onClick={submit} disabled={loading} style={{ marginTop: '15px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}

export default Login;
