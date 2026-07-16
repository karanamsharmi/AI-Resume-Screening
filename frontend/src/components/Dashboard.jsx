import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

    const [stats, setStats] = useState({
        total_resumes: 0,
        highest_score: 0,
        lowest_score: 0,
        average_score: 0,
        selected_candidates: 0,
        rejected_candidates: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            setLoading(true);
            const res = await api.get("/dashboard");
            setStats(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Dashboard</h2>
                {loading && <div className="spinner" style={{ width: '16px', height: '16px', borderThickness: '2px' }}></div>}
            </div>
            {loading ? (
                <div className="loading-bar-container">
                    <div className="loading-bar-indeterminate"></div>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px'
                }}>
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '20px' }}>
                        <h3 style={{ color: 'var(--text-secondary)', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>Total Resumes</h3>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{stats.total_resumes}</div>
                    </div>
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '20px' }}>
                        <h3 style={{ color: 'var(--text-secondary)', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>Highest Score</h3>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-success)' }}>{stats.highest_score}</div>
                    </div>
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '20px' }}>
                        <h3 style={{ color: 'var(--text-secondary)', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>Average Score</h3>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{stats.average_score}</div>
                    </div>
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '20px' }}>
                        <h3 style={{ color: 'var(--text-secondary)', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>Selected</h3>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{stats.selected_candidates}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;