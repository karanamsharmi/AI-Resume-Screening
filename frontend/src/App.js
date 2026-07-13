import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("job_description", jobDescription);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/screen-resume",
        formData
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error while screening resume.");
    }
  };

  return (
    <div className="container">
      <h1>AI Resume Screening Platform</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter Job Description"
          rows="6"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <br />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button type="submit">
          Analyze Resume
        </button>
      </form>

      {result && (
        <div className="result">
          <h2>Result</h2>

          <p>
            <b>Filename:</b> {result.filename}
          </p>

          <p>
            <b>Match Score:</b> {result.match_score}%
          </p>

          <p>
            <b>Matched Skills:</b>
          </p>

          <ul>
            {result.matched_skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <p>
            <b>Missing Skills:</b>
          </p>

          <ul>
            {result.missing_skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;