import { useEffect, useState } from "react";
import api from "../services/api";

function Leaderboard({ resumes }) {

    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    async function loadLeaderboard() {

        try {

            const res = await api.get("/leaderboard");

            setLeaderboard(res.data);

        } catch (err) {

            console.log(err);

        }

    }

    const data =
        resumes && resumes.length > 0
            ? resumes
            : leaderboard;

    return (
        <div className="glass-panel" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px' }}>Leaderboard</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '15px 10px' }}>Rank</th>
                            <th style={{ padding: '15px 10px' }}>Name</th>
                            <th style={{ padding: '15px 10px' }}>Email</th>
                            <th style={{ padding: '15px 10px' }}>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No Resume Found
                                </td>
                            </tr>
                        ) : (
                            data.map((resume, index) => (
                                <tr key={resume.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.02)' } }}>
                                    <td style={{ padding: '15px 10px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>#{index + 1}</td>
                                    <td style={{ padding: '15px 10px' }}>{resume.name}</td>
                                    <td style={{ padding: '15px 10px', color: 'var(--text-secondary)' }}>{resume.email}</td>
                                    <td style={{ padding: '15px 10px' }}>
                                        <span className="skill-badge" style={{ margin: 0 }}>{resume.score}%</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default Leaderboard;