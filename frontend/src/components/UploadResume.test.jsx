import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import api from "../services/api";
import UploadResume from "./UploadResume";

// ─── Mock api ──────────────────────────────────────────────────────
jest.mock("../services/api");

// ─── Helpers ───────────────────────────────────────────────────────
const createMockFile = (name = "resume.pdf", type = "application/pdf") => {
  return new File(["fake pdf content"], name, { type });
};

const mockSuccessResponse = {
  data: {
    success: true,
    filename: "resume.pdf",
    resume_details: { name: "John Doe", email: "john@test.com", education: [], experience: [] },
    match_score: 85,
    matched_skills: ["python", "git"],
    missing_skills: ["docker"],
    recommendations: ["Learn Docker Basics"],
  },
};

// ─── Tests ─────────────────────────────────────────────────────────
describe("UploadResume Component", () => {
  let mockSetResult;

  beforeEach(() => {
    mockSetResult = jest.fn();
    jest.clearAllMocks();
  });

  // --- Rendering ---------------------------------------------------
  test("renders the upload form correctly", () => {
    render(<UploadResume setResult={mockSetResult} />);

    expect(
      screen.getByPlaceholderText("Paste Job Description here...")
    ).toBeInTheDocument();
    expect(screen.getByText("Analyze Resume")).toBeInTheDocument();
    expect(screen.getByText("Screen a New Candidate")).toBeInTheDocument();
  });

  test("renders a file input that accepts .pdf", () => {
    render(<UploadResume setResult={mockSetResult} />);

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute("accept", ".pdf");
  });

  // --- Validation --------------------------------------------------
  test("alerts when no file is selected", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<UploadResume setResult={mockSetResult} />);

    fireEvent.click(screen.getByText("Analyze Resume"));

    expect(alertSpy).toHaveBeenCalledWith("Please select a resume.");
    expect(api.post).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  // --- File selection ----------------------------------------------
  test("allows selecting a PDF file", async () => {
    render(<UploadResume setResult={mockSetResult} />);

    const fileInput = document.querySelector('input[type="file"]');
    const file = createMockFile();

    await userEvent.upload(fileInput, file);

    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  // --- Job description input ---------------------------------------
  test("allows typing a job description", async () => {
    render(<UploadResume setResult={mockSetResult} />);

    const textarea = screen.getByPlaceholderText(
      "Paste Job Description here..."
    );
    await userEvent.type(textarea, "Python developer needed");

    expect(textarea.value).toBe("Python developer needed");
  });

  // --- Successful upload -------------------------------------------
  test("calls api.post with form data on successful upload", async () => {
    api.post.mockResolvedValueOnce(mockSuccessResponse);

    render(<UploadResume setResult={mockSetResult} />);

    // Fill in job description
    const textarea = screen.getByPlaceholderText(
      "Paste Job Description here..."
    );
    await userEvent.type(textarea, "Python developer");

    // Select a file
    const fileInput = document.querySelector('input[type="file"]');
    const file = createMockFile();
    await userEvent.upload(fileInput, file);

    // Click upload
    fireEvent.click(screen.getByText("Analyze Resume"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    const [url, formData, config] = api.post.mock.calls[0];
    expect(url).toBe("/screen-resume");
    expect(formData).toBeInstanceOf(FormData);
    expect(config.headers["Content-Type"]).toBe("multipart/form-data");
  });

  test("sends multiple files to bulk endpoint when several resumes are selected", async () => {
    const multiResponse = {
      data: {
        success: true,
        results: [
          mockSuccessResponse.data,
          {
            ...mockSuccessResponse.data,
            filename: "resume2.pdf",
            resume_details: { ...mockSuccessResponse.data.resume_details, name: "Jane Doe", email: "jane@test.com" }
          }
        ]
      }
    };
    api.post.mockResolvedValueOnce(multiResponse);

    render(<UploadResume setResult={mockSetResult} />);

    const textarea = screen.getByPlaceholderText("Paste Job Description here...");
    await userEvent.type(textarea, "Python developer");

    const fileInput = document.querySelector('input[type="file"]');
    const file1 = createMockFile("resume1.pdf");
    const file2 = createMockFile("resume2.pdf");
    await userEvent.upload(fileInput, [file1, file2]);

    fireEvent.click(screen.getByText("Analyze Resume"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    const [url, formData] = api.post.mock.calls[0];
    expect(url).toBe("/screen-resumes");
    expect(formData.getAll("files")).toHaveLength(2);
    expect(formData.get("job_description")).toBe("Python developer");
    expect(mockSetResult).toHaveBeenCalledWith(multiResponse.data.results[0]);
  });

  test("calls setResult with response data on success", async () => {
    api.post.mockResolvedValueOnce(mockSuccessResponse);

    render(<UploadResume setResult={mockSetResult} />);

    const textarea = screen.getByPlaceholderText(
      "Paste Job Description here..."
    );
    await userEvent.type(textarea, "Python developer");

    const fileInput = document.querySelector('input[type="file"]');
    await userEvent.upload(fileInput, createMockFile());

    fireEvent.click(screen.getByText("Analyze Resume"));

    await waitFor(() => {
      expect(mockSetResult).toHaveBeenCalledWith(mockSuccessResponse.data);
    });
  });

  // --- Upload failure ----------------------------------------------
  test("shows alert on upload failure", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    api.post.mockRejectedValueOnce(new Error("Network Error"));

    render(<UploadResume setResult={mockSetResult} />);

    const textarea = screen.getByPlaceholderText(
      "Paste Job Description here..."
    );
    await userEvent.type(textarea, "Python developer");

    const fileInput = document.querySelector('input[type="file"]');
    await userEvent.upload(fileInput, createMockFile());

    fireEvent.click(screen.getByText("Analyze Resume"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Upload Failed");
    });

    alertSpy.mockRestore();
  });

  test("does not call setResult on failure", async () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    api.post.mockRejectedValueOnce(new Error("Server Error"));

    render(<UploadResume setResult={mockSetResult} />);

    const textarea = screen.getByPlaceholderText(
      "Paste Job Description here..."
    );
    await userEvent.type(textarea, "Python");

    const fileInput = document.querySelector('input[type="file"]');
    await userEvent.upload(fileInput, createMockFile());

    fireEvent.click(screen.getByText("Analyze Resume"));

    await waitFor(() => {
      expect(mockSetResult).not.toHaveBeenCalled();
    });
  });

  // --- FormData structure ------------------------------------------
  test("FormData contains file and job_description", async () => {
    api.post.mockResolvedValueOnce(mockSuccessResponse);

    render(<UploadResume setResult={mockSetResult} />);

    const textarea = screen.getByPlaceholderText(
      "Paste Job Description here..."
    );
    await userEvent.type(textarea, "Docker expert needed");

    const fileInput = document.querySelector('input[type="file"]');
    await userEvent.upload(fileInput, createMockFile());

    fireEvent.click(screen.getByText("Analyze Resume"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    const formData = api.post.mock.calls[0][1];
    expect(formData.get("job_description")).toBe("Docker expert needed");
    expect(formData.get("file")).toBeInstanceOf(File);
  });
});
