function ResultCard({ result }) {

  if (!result) return null;

  return (
    <div className="result-card">

      <h2>Resume Analysis Result</h2>

      <div className="score">
        {result.match_score}%
      </div>

      <hr />

      <h3>Candidate Details</h3>

      <p><b>Name:</b> {result.resume_details.name}</p>
      <p><b>Email:</b> {result.resume_details.email}</p>
      <p><b>Phone:</b> {result.resume_details.phone}</p>
      <p>
        <b>Education:</b>{" "}
        {result.resume_details.education.join(", ")}
      </p>

      <hr />

      <h3>Matched Skills</h3>

      {result.matched_skills.map((skill, index) => (
        <span key={index} className="skill">
          {skill}
        </span>
      ))}

      <hr />

      <h3>Missing Skills</h3>

      {result.missing_skills.map((skill, index) => (
        <span key={index} className="skill missing">
          {skill}
        </span>
      ))}

      <hr />

      <h3>AI Recommendations</h3>

      <ul>
        {result.recommendations.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

    </div>
  );
}

export default ResultCard;