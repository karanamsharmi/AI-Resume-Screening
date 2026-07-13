import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

    const [stats, setStats] = useState({
        total_resumes: 0,
        highest_score: 0,
        lowest_score: 0,
        average_score: 0,
        selected_candidates: 0,
        rejected_candidates: 0
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {

        try {

            const res = await api.get("/dashboard");

            setStats(res.data);

        } catch (err) {

            console.log(err);

        }

    }

    return (

        <div>

            <h2>Dashboard</h2>

            <p>Total Resumes : {stats.total_resumes}</p>

            <p>Highest Score : {stats.highest_score}</p>

            <p>Lowest Score : {stats.lowest_score}</p>

            <p>Average Score : {stats.average_score}</p>

            <p>Selected Candidates : {stats.selected_candidates}</p>

            <p>Rejected Candidates : {stats.rejected_candidates}</p>

        </div>

    );

}

export default Dashboard;