import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import "./ResumePreview.css"; // Ensure this CSS file is styled to your preference

function ResumePreview() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/resume/fetch-latest-user-info/");
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setLoading(false);
        } else {
          setError("Failed to fetch user data.");
          setLoading(false);
        }
      } catch (err) {
        setError("Error: " + err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const downloadResume = () => {
    const element = document.querySelector(".resume-container");
    const downloadButton = document.querySelector(".download-btn");

    // Temporarily hide the download button
    downloadButton.style.display = "none";

    const options = {
      margin: [10, 10, 10, 10],
      filename: "ATS_Resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        // Restore the download button after PDF generation
        downloadButton.style.display = "block";
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="resume-container">
      {/* Header Section */}
      <div className="resume-header">
        <h1>{userData.personalInfo?.name || "N/A"}</h1>
        <p>
          {userData.personalInfo?.email || "N/A"} | {userData.personalInfo?.phone || "N/A"} |{" "}
          {userData.personalInfo?.address || "N/A"}
        </p>
        <p>
          LinkedIn: {userData.socialLinks?.linkedIn || "N/A"} | GitHub: {userData.socialLinks?.github || "N/A"} | Twitter:{" "}
          {userData.socialLinks?.twitter || "N/A"}
        </p>
      </div>



      {/* Professional Summary */}
      <div className="resume-section">
        <h2>Professional Summary</h2>
        <p>{userData.professionalSummary || "No professional summary provided."}</p>
      </div>

      {/* Education Section */}
      <div className="resume-section">
        <h2>Education</h2>
        <ul>
          {userData.education && userData.education.length > 0 ? (
            userData.education.map((edu, index) => (
              <li key={index}>
                {edu.degree} at {edu.institution} ({edu.year})
              </li>
            ))
          ) : (
            <li>No education details available.</li>
          )}
        </ul>
      </div>

      {/* Certifications Section */}
      <div className="resume-section">
        <h2>Certifications</h2>
        <ul>
          {userData.certifications && userData.certifications.length > 0 ? (
            userData.certifications.map((cert, index) => (
              <li key={index}>
                {cert.title} ({cert.date})
              </li>
            ))
          ) : (
            <li>No certifications listed.</li>
          )}
        </ul>
      </div>

      {/* Achievements Section */}
      <div className="resume-section">
        <h2>Achievements</h2>
        <ul>
          {userData.achievements && userData.achievements.length > 0 ? (
            userData.achievements.map((achievement, index) => (
              <li key={index}>
                {achievement.title} ({achievement.year})
              </li>
            ))
          ) : (
            <li>No achievements listed.</li>
          )}
        </ul>
      </div>

      {/* Languages Known Section */}
      <div className="resume-section">
        <h2>Languages Known</h2>
        <ul>
          {userData.languages && userData.languages.length > 0 ? (
            userData.languages.map((lang, index) => (
              <li key={index}>
                {lang.language} - Proficiency: {lang.proficiency}
              </li>
            ))
          ) : (
            <li>No languages listed.</li>
          )}
        </ul>
      </div>

      {/* Projects Section */}
      <div className="resume-section">
        <h2>Projects</h2>
        <ul>
          {userData.projects && userData.projects.length > 0 ? (
            userData.projects.map((project, index) => (
              <li key={index}>
                <strong>{project.title || "Untitled Project"}</strong> -{" "}
                {project.duration || "Duration not provided"}
                <p>{project.description || "No description available."}</p>
              </li>
            ))
          ) : (
            <li>No projects listed.</li>
          )}
        </ul>
      </div>

      {/* Work Experience Section */}
      <div className="resume-section">
        <h2>Work Experience</h2>
        <ul>
          {userData.experience && userData.experience.length > 0 ? (
            userData.experience.map((exp, index) => (
              <li key={index}>
                <strong>{exp.role}</strong> at {exp.company} ({exp.duration})
              </li>
            ))
          ) : (
            <li>No work experience available.</li>
          )}
        </ul>
      </div>

      {/* Skills Section */}
      <div className="resume-section">
        <h2>Skills</h2>
        <ul className="skills-list">
          {userData.skills && userData.skills.length > 0 ? (
            userData.skills.map((skill, index) => <li key={index}>{skill}</li>)
          ) : (
            <li>No skills listed.</li>
          )}
        </ul>
      </div>

      {/* Download Button */}
      <div className="button-container">
        <button className="download-btn" onClick={downloadResume}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default ResumePreview;
