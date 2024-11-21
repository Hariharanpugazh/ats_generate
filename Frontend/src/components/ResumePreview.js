import React, { useState, useEffect } from "react";
import "./ResumePreview.css"; // Add a CSS file for styling

function ResumePreview() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/resume/fetch-latest-user-info/");
        if (!response.ok) {
          throw new Error("Failed to fetch user data. Status: " + response.status);
        }
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
        <h1>{userData.personalInfo?.name}</h1>
        <p>
          {userData.personalInfo?.email} | {userData.personalInfo?.phone} | {userData.personalInfo?.address}
        </p>
      </div>

      {/* Professional Summary */}
      <div className="resume-section">
        <h2>Professional Summary</h2>
        <p>{userData.professionalSummary}</p>
      </div>

      {/* Education */}
      <div className="resume-section">
        <h2>Education</h2>
        {userData.education && userData.education.length > 0 ? (
          <ul>
            {userData.education.map((edu, index) => (
              <li key={index}>
                <strong>{edu.degree}</strong>, {edu.institution} ({edu.year})
              </li>
            ))}
          </ul>
        ) : (
          <p>No education details available.</p>
        )}
      </div>

      {/* Projects */}
      {userData.fresherOrProfessional === "fresher" && (
        <div className="resume-section">
          <h2>Projects</h2>
          {userData.projects && userData.projects.length > 0 ? (
            <ul>
              {userData.projects.map((project, index) => (
                <li key={index}>
                  <strong>{project.title}</strong> - {project.duration}
                  <p>{project.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No project details available.</p>
          )}
        </div>
      )}

      {/* Work Experience */}
      {userData.fresherOrProfessional === "professional" && (
        <div className="resume-section">
          <h2>Work Experience</h2>
          {userData.experience && userData.experience.length > 0 ? (
            <ul>
              {userData.experience.map((exp, index) => (
                <li key={index}>
                  <strong>{exp.role}</strong> at {exp.company} ({exp.duration})
                </li>
              ))}
            </ul>
          ) : (
            <p>No work experience details available.</p>
          )}
        </div>
      )}

      {/* Skills */}
      <div className="resume-section">
        <h2>Skills</h2>
        {userData.skills && userData.skills.length > 0 ? (
          <ul className="skills-list">
            {userData.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>No skills available.</p>
        )}
      </div>
    </div>
  );
}

export default ResumePreview;
