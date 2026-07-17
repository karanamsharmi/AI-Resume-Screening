import { useState, useEffect } from "react";
import api from "../services/api";

function Filter({ setSearchResults, resetKey }) {
    const [activeFilter, setActiveFilter] = useState("");

    useEffect(() => {
        setActiveFilter("");
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
        loadFilter(min, max);
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
        </div>
    );

}

export default Filter;