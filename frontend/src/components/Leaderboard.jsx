import { useEffect, useState } from "react";
import api from "../services/api";

function Leaderboard({ resumes, refreshKey }) {

    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [candidateLimit, setCandidateLimit] = useState(10);

    useEffect(() => {
        loadLeaderboard();
    }, [candidateLimit, refreshKey]);

    async function loadLeaderboard() {
        try {
            setLoading(true);
            const res = await api.get(`/leaderboard?limit=${candidateLimit}`);
            setLeaderboard(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const data = resumes == null
        ? leaderboard
        : resumes.slice(0, candidateLimit);

    return (
        <div className="glass-panel" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Leaderboard</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Show Top:</label>
                    <select 
                        value={candidateLimit} 
                        onChange={(e) => setCandidateLimit(parseInt(e.target.value))}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--panel-border)',
                            background: 'rgba(0, 0, 0, 0.2)',
                            color: 'var(--text-primary)',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'border-color 0.3s ease'
                        }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                        <option value="30">30</option>
                    </select>
                </div>
                {loading && <div className="spinner" style={{ width: '16px', height: '16px', borderThickness: '2px' }}></div>}
            </div>
            {loading ? (
                <div className="loading-bar-container">
                    <div className="loading-bar-indeterminate"></div>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '15px 10px' }}>Rank</th>
                                <th style={{ padding: '15px 10px' }}>Name</th>
                                <th style={{ padding: '15px 10px' }}>Email</th>
                                <th style={{ padding: '15px 10px' }}>Job</th>
                                <th style={{ padding: '15px 10px' }}>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        {resumes === null ? "Screen reset. No data to display." : "No Resume Found"}
                                    </td>
                                </tr>
                            ) : (
                                data.map((resume, index) => (
                                    <tr key={resume.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.02)' } }}>
                                        <td style={{ padding: '15px 10px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>#{index + 1}</td>
                                        <td style={{ padding: '15px 10px' }}>{resume.name}</td>
                                        <td style={{ padding: '15px 10px', color: 'var(--text-secondary)' }}>{resume.email}</td>
                                        <td style={{ padding: '15px 10px', color: 'var(--text-secondary)' }}>{resume.job_description || resume.jd || '-'}</td>
                                        <td style={{ padding: '15px 10px' }}>
                                            <span className="skill-badge" style={{ margin: 0 }}>{resume.score}%</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

}

export default Leaderboard;