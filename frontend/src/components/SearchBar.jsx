import { useState } from "react";
import api from "../services/api";

function SearchBar({ setSearchResults }) {

    const [keyword, setKeyword] = useState("");
    const [loadingHistory, setLoadingHistory] = useState(false);

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

    async function loadHistory() {
        try {
            setLoadingHistory(true);
            const res = await api.get("/resumes");
            setSearchResults(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingHistory(false);
        }
    }

    return (
        <div className="glass-panel" style={{ marginBottom: '20px' }}>
            <h2 style={{ marginBottom: '15px' }}>Search Resumes</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search by Name, Email or Skill..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{ flex: 1, minWidth: '220px', padding: '12px 15px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', outline: 'none' }}
                />
                <button
                    className="btn-primary"
                    style={{ marginTop: 0 }}
                    onClick={searchResume}
                >
                    Search
                </button>
                <button
                    className="btn-primary"
                    style={{ marginTop: 0, background: 'rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    type="button"
                    onClick={loadHistory}
                    disabled={loadingHistory}
                >
                    {loadingHistory && <div className="spinner" style={{ width: '14px', height: '14px' }}></div>}
                    Load History
                </button>
            </div>
        </div>
    );

}

export default SearchBar;