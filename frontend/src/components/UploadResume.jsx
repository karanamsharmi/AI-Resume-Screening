import { useState } from "react";
import api from "../services/api";

function UploadResume({ setResult }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    setLoading(true);
    try {
      const response = await api.post(
        "/screen-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ marginBottom: '40px' }}>
      <h2 style={{ marginBottom: '20px' }}>Screen a New Candidate</h2>

      <div style={{ marginBottom: '20px' }}>
        <textarea
          rows="6"
          placeholder="Paste Job Description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', border: '1px dashed var(--panel-border)', borderRadius: '12px', background: 'rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ width: '100%', maxWidth: '300px' }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          className="btn-primary" 
          onClick={uploadResume} 
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
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
  );
}

export default UploadResume;