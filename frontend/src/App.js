import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Dashboard from "./components/Dashboard";
import SearchBar from "./components/SearchBar";
import UploadResume from "./components/UploadResume";
import ResultCard from "./components/ResultCard";
import Leaderboard from "./components/Leaderboard";
import Filter from "./components/Filter";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

import api from "./services/api";

function App() {
    const [result, setResult] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);
    const [dashboardResetKey, setDashboardResetKey] = useState(0);
    const [filterResetKey, setFilterResetKey] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setIsAuthenticated(true);
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    }

    function handleReset() {
        setResult(null);
        setSearchResults([]);
        setDashboardResetKey((prev) => prev + 1);
        setFilterResetKey((prev) => prev + 1);
    }

    async function handleAnalyzeComplete(responseData) {
        // refresh resume history and signal leaderboard to reload
        try {
            const res = await api.get('/resumes');
            setSearchResults(res.data);
        } catch (e) {
            console.warn('Failed to refresh resume history after analysis', e);
        } finally {
            setLeaderboardRefreshKey((k) => k + 1);
        }
    }

    function handleResumeDataClear() {
        setResult(null);
        setSearchResults([]);
        setFilterResetKey((prev) => prev + 1);
    }

    const DashboardPage = () => (
        <div>
            <h1 align="center" className="gradient-text" style={{ fontSize: "3rem", marginBottom: "40px" }}>
                AI Resume Screening System
            </h1>

            <Dashboard resetKey={dashboardResetKey} onResumeDataClear={handleResumeDataClear} />

            <SearchBar setSearchResults={setSearchResults} />
            <Filter setSearchResults={setSearchResults} resetKey={filterResetKey} />

            <UploadResume setResult={setResult} onReset={handleReset} onAnalyzeComplete={handleAnalyzeComplete} />

            <ResultCard result={result} />

            <Leaderboard resumes={searchResults} refreshKey={leaderboardRefreshKey} />
        </div>
    );

    return (
        <BrowserRouter>
            <div className="App">
                <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLogin={(val) => setIsAuthenticated(val)} />} />
                    <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;