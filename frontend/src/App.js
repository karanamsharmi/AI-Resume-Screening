import { useState } from "react";

import "./App.css";

import Dashboard from "./components/Dashboard";
import SearchBar from "./components/SearchBar";
import UploadResume from "./components/UploadResume";
import ResultCard from "./components/ResultCard";
import Leaderboard from "./components/Leaderboard";
import Filter from "./components/Filter";

function App() {

    const [result, setResult] = useState(null);

    const [searchResults, setSearchResults] = useState([]);

    return (

        <div className="App">

            <div className="container">

                <h1 align="center">
                    AI Resume Screening System
                </h1>

                <Dashboard />

                <SearchBar
                    setSearchResults={setSearchResults}
                />
                <Filter
    setSearchResults={setSearchResults}
/>

                <UploadResume
                    setResult={setResult}
                />

                <ResultCard
                    result={result}
                />

                <Leaderboard
                    resumes={searchResults}
                />

            </div>

        </div>

    );

}

export default App;