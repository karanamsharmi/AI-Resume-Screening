function ResultCard({ result }) {

  if (!result) return null;

  return (
    <div className="glass-panel" style={{ marginBottom: '40px', animation: 'fadeIn 0.5s ease-out' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Resume Analysis Result</h2>
        <div className="score-display">
          {result.match_score}%
        </div>
      </div>

      <hr />

      <h3>Candidate Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <p style={{ margin: 0 }}><b>Name:</b> <span style={{ color: 'var(--text-secondary)' }}>{result.resume_details.name}</span></p>
        <p style={{ margin: 0 }}><b>Email:</b> <span style={{ color: 'var(--text-secondary)' }}>{result.resume_details.email}</span></p>
        <p style={{ margin: 0 }}><b>Phone:</b> <span style={{ color: 'var(--text-secondary)' }}>{result.resume_details.phone}</span></p>
        <p style={{ margin: 0 }}><b>Education:</b> <span style={{ color: 'var(--text-secondary)' }}>{result.resume_details.education.join(", ")}</span></p>
      </div>

      <hr />

      <h3>Matched Skills</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {result.matched_skills.map((skill, index) => (
          <span key={index} className="skill-badge">
            {skill}
          </span>
        ))}
      </div>

      <hr />

      <h3>Missing Skills</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {result.missing_skills.map((skill, index) => (
          <span key={index} className="skill-badge missing">
            {skill}
          </span>
        ))}
      </div>

      <hr />

      <h3>AI Recommendations</h3>
      <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
        {result.recommendations.map((item, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>{item}</li>
        ))}
      </ul>

    </div>
  );
}

export default ResultCard;