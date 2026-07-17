import { useState } from "react";
import api from "../services/api";

function UploadResume({ setResult, onReset, onAnalyzeComplete, requireAuth }) {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());
  // For tests and simpler UX, don't gate upload on token presence here.
  const token = localStorage.getItem("token");
  const requireAuthEffective = typeof requireAuth === 'boolean'
    ? requireAuth
    : (typeof window !== 'undefined' && typeof window.__REQUIRE_AUTH__ !== 'undefined')
      ? window.__REQUIRE_AUTH__
      : true;

  const uploadResume = async () => {
    if (!files || files.length === 0) {
      alert("Please select a resume.");
      return;
    }

    const formData = new FormData();
    let endpoint = "/screen-resume";

    if (files.length === 1) {
      formData.append("file", files[0]);
    } else {
      endpoint = "/screen-resumes";
      files.forEach((file) => formData.append("files", file));
    }

    formData.append("job_description", jobDescription);

    setLoading(true);
    try {
      const response = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data && response.data.results ? response.data.results[0] : response.data;
      setResult(data);

      // notify parent that analysis finished so leaderboard/history can refresh
      if (onAnalyzeComplete) {
        try {
          onAnalyzeComplete(response.data);
        } catch (e) {
          // swallow - parent handlers should manage their own errors
          console.warn('onAnalyzeComplete handler failed', e);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  function resetScreen() {
    setFiles([]);
    setJobDescription("");
    setInputKey(Date.now());
    if (onReset) onReset();
  }

  return (
    <div className="glass-panel" style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Screen a New Candidate</h2>
        {loading && <div className="spinner" style={{ width: '18px', height: '18px' }}></div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <textarea
          rows="6"
          placeholder="Paste Job Description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          style={{ width: '100%', minHeight: '140px', padding: '12px 15px', borderRadius: '12px', border: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.1)', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', border: '1px dashed var(--panel-border)', borderRadius: '12px', background: 'rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <input
          key={inputKey}
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          style={{ width: '100%', maxWidth: '300px' }}
        />

        {files && files.length > 0 && (
          <div style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>
            Selected: {files.map((f) => f.name).join(', ')}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
          {requireAuthEffective && !token && (
            <div style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>Please login to upload resumes.</div>
          )}
          <button
            className="btn-primary"
            type="button"
            onClick={resetScreen}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            Reset Screen
          </button>
          <button 
            className="btn-primary" 
            onClick={uploadResume} 
            disabled={loading || (requireAuthEffective && !token)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: loading || (requireAuthEffective && !token) ? 0.7 : 1, cursor: loading || (requireAuthEffective && !token) ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing Resume...
              </>
            ) : (
              "Analyze Resume"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadResume;