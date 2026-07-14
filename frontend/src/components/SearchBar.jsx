import { useState } from "react";
import api from "../services/api";

function SearchBar({ setSearchResults }) {

    const [keyword, setKeyword] = useState("");

    async function searchResume() {

        if (keyword.trim() === "") return;

        try {

            const res = await api.get(
                `/search?keyword=${keyword}`
            );

            setSearchResults(res.data);

        } catch (err) {

            console.log(err);

        }

    }

    return (
        <div className="glass-panel" style={{ marginBottom: '20px' }}>
            <h2 style={{ marginBottom: '15px' }}>Search Resumes</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Search by Name, Email or Skill..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{ flex: 1, padding: '12px 15px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', outline: 'none' }}
                />
                <button
                    className="btn-primary"
                    style={{ marginTop: 0 }}
                    onClick={searchResume}
                >
                    Search
                </button>
            </div>
        </div>
    );

}

export default SearchBar;