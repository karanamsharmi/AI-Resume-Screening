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

        <div>

            <h2>Filter By Score</h2>

            <button onClick={() => loadFilter(80,100)}>
                80 - 100
            </button>

            <button onClick={() => loadFilter(60,79)}>
                60 - 79
            </button>

            <button onClick={() => loadFilter(40,59)}>
                40 - 59
            </button>

            <button onClick={() => loadFilter(0,39)}>
                Below 40
            </button>

            <button onClick={() => loadFilter(0,100)}>
                Show All
            </button>

        </div>

    );

}

export default Filter;