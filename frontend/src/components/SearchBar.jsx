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

        <div>

            <h2>Search Resume</h2>

            <input
                type="text"
                placeholder="Search by Name, Email or Skill"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />

            <button
                onClick={searchResume}
            >
                Search
            </button>

        </div>

    );

}

export default SearchBar;