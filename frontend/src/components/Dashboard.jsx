import { useEffect, useState } from "react";
import api from "../services/api";

const initialStats = {
    total_resumes: 0,
    highest_score: 0,
    lowest_score: 0,
    average_score: 0,
    selected_candidates: 0,
    rejected_candidates: 0
};

function Dashboard({ resetKey, onResumeDataClear }) {

    const [stats, setStats] = useState(initialStats);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setStats({ ...initialStats });
        loadDashboard();
    }, [resetKey]);

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

    async function handleResetClick() {
        try {
            setLoading(true);
            await api.delete("/resumes/reset");
            const res = await api.get("/dashboard");
            setStats(res.data);
            if (onResumeDataClear) onResumeDataClear();
        } catch (err) {
            console.error("Clear resume data failed", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Dashboard</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleResetClick}
                        style={{ padding: '10px 18px', fontSize: '14px' }}
                    >
                        Clear Resume Data
                    </button>
                    {loading && <div className="spinner" style={{ width: '16px', height: '16px', borderThickness: '2px' }}></div>}
                </div>
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