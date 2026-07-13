import { useState } from "react";
import axios from "axios";

function UploadResume({ setResult }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post(
        "http://107.20.129.72:8000/screen-resume",
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
    }
  };

  return (
    <div>
      <h2>AI Resume Screening</h2>

      <textarea
        rows="8"
        cols="70"
        placeholder="Paste Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <br />
      <br />

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={uploadResume}>Analyze Resume</button>
    </div>
  );
}

export default UploadResume;