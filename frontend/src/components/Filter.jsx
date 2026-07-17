import { useState, useEffect } from "react";
import api from "../services/api";

function Filter({ setSearchResults, resetKey }) {
    const [activeFilter, setActiveFilter] = useState("");
    const [minScore, setMinScore] = useState(0);
    const [maxScore, setMaxScore] = useState(100);

    useEffect(() => {
        setActiveFilter("");
        setMinScore(0);
        setMaxScore(100);
    }, [resetKey]);

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

    function handleFilter(label, min, max) {
        setActiveFilter(label);
        setMinScore(min);
        setMaxScore(max);
        loadFilter(min, max);
    }

    function handleCustomFilter() {
        setActiveFilter("custom");
        loadFilter(minScore, maxScore);
    }

    return (
        <div className="glass-panel" style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '15px' }}>Filter By Score</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" className={`filter-button ${activeFilter === '80-100' ? 'active' : ''}`} onClick={() => handleFilter('80-100', 80, 100)}>
                    80 - 100
                </button>
                <button type="button" className={`filter-button ${activeFilter === '60-79' ? 'active' : ''}`} onClick={() => handleFilter('60-79', 60, 79)}>
                    60 - 79
                </button>
                <button type="button" className={`filter-button ${activeFilter === '40-59' ? 'active' : ''}`} onClick={() => handleFilter('40-59', 40, 59)}>
                    40 - 59
                </button>
                <button type="button" className={`filter-button ${activeFilter === 'below-40' ? 'active' : ''}`} onClick={() => handleFilter('below-40', 0, 39)}>
                    Below 40
                </button>
                <button type="button" className={`filter-button ${activeFilter === 'show-all' ? 'active' : ''}`} onClick={() => handleFilter('show-all', 0, 100)}>
                    Show All
                </button>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginTop: '15px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Min score
                    <input
                        type="number"
                        value={minScore}
                        min={0}
                        max={100}
                        onChange={(e) => setMinScore(Math.max(0, Number(e.target.value)))}
                        style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'rgba(0, 0, 0, 0.2)', color: 'var(--text-primary)', width: '120px' }}
                    />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Max score
                    <input
                        type="number"
                        value={maxScore}
                        min={0}
                        max={100}
                        onChange={(e) => setMaxScore(Math.min(100, Number(e.target.value)))}
                        style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--panel-border)', background: 'rgba(0, 0, 0, 0.2)', color: 'var(--text-primary)', width: '120px' }}
                    />
                </label>
                <button type="button" className={`filter-button ${activeFilter === 'custom' ? 'active' : ''}`} onClick={handleCustomFilter} style={{ minWidth: '120px' }}>
                    Apply
                </button>
            </div>
        </div>
    );

}

export default Filter;