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

        <div>

            <h2>Leaderboard</h2>

            <table
                border="1"
                width="100%"
                cellPadding="10"
            >

                <thead>

                    <tr>

                        <th>Rank</th>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Score</th>

                    </tr>

                </thead>

                <tbody>

                    {data.length === 0 ? (

                        <tr>

                            <td colSpan="4">

                                No Resume Found

                            </td>

                        </tr>

                    ) : (

                        data.map((resume, index) => (

                            <tr key={resume.id}>

                                <td>{index + 1}</td>

                                <td>{resume.name}</td>

                                <td>{resume.email}</td>

                                <td>{resume.score}%</td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default Leaderboard;