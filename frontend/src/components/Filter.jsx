import api from "../services/api";

function Filter({ setSearchResults }) {

    async function loadFilter(min, max) {

        try {

            const res = await api.get(
                `/filter?min_score=${min}&max_score=${max}`
            );

            setSearchResults(res.data);

        } catch (err) {

            console.log(err);

        }

    }

    return (
        <div className="glass-panel" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '15px' }}>Filter By Score</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button className="skill-badge" style={{ cursor: 'pointer', border: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} onClick={() => loadFilter(80,100)}>
                    80 - 100
                </button>
                <button className="skill-badge" style={{ cursor: 'pointer', border: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} onClick={() => loadFilter(60,79)}>
                    60 - 79
                </button>
                <button className="skill-badge" style={{ cursor: 'pointer', border: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} onClick={() => loadFilter(40,59)}>
                    40 - 59
                </button>
                <button className="skill-badge" style={{ cursor: 'pointer', border: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} onClick={() => loadFilter(0,39)}>
                    Below 40
                </button>
                <button className="skill-badge" style={{ cursor: 'pointer', border: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }} onClick={() => loadFilter(0,100)}>
                    Show All
                </button>
            </div>
        </div>
    );

}

export default Filter;