import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <section style={{ display: "flex", alignItems: "center", gap: "40px", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h1 className="gradient-text" style={{ fontSize: "3.2rem", marginBottom: "12px" }}>Smarter, Faster Hiring</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "18px", marginBottom: "20px" }}>
              AI-powered resume screening that surfaces the best candidates and saves hours of manual review.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link to="/login" className="btn-primary" style={{ textDecoration: "none" }}>Get Started</Link>
              <a href="#features" className="glass-panel" style={{ display: "inline-flex", alignItems: "center", padding: "12px 18px", borderRadius: 10, textDecoration: "none", color: "var(--text-primary)" }}>Learn more</a>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="glass-panel" style={{ padding: "28px 24px" }}>
              <h3 style={{ marginTop: 0 }}>Quick Snapshot</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>Upload a resume and get an instant score, skill highlights, and fit recommendations.</p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <div style={{ flex: 1 }} className="glass-panel">
                  <strong style={{ fontSize: 20, color: "var(--accent-primary)" }}>90%</strong>
                  <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>Avg accuracy</div>
                </div>
                <div style={{ flex: 1 }} className="glass-panel">
                  <strong style={{ fontSize: 20, color: "var(--accent-success)" }}>5 min</strong>
                  <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>Avg review time saved</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" style={{ marginTop: 30, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
          <div className="glass-panel">
            <h4>Automated Scoring</h4>
            <p style={{ color: "var(--text-secondary)" }}>Consistent, explainable scores for every resume.</p>
          </div>
          <div className="glass-panel">
            <h4>Skill Extraction</h4>
            <p style={{ color: "var(--text-secondary)" }}>Highlight required and missing skills at a glance.</p>
          </div>
          <div className="glass-panel">
            <h4>Team Collaboration</h4>
            <p style={{ color: "var(--text-secondary)" }}>Share shortlists and notes with hiring teams.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
