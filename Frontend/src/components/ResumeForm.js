import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./ResumePreview.css";
// Maximum limits for multiple-input sections
const MAX_CERTIFICATIONS = 3;
const MAX_PROJECTS = 3;
const MAX_ACHIEVEMENTS = 3;
const MAX_EXPERIENCE = 3;
const MAX_EDUCATION = 2;

const PROFESSIONAL_SUMMARY_WORD_LIMIT = 35; // Limit for professional summary
const DESCRIPTION_WORD_LIMIT = 35; // Limit for project and achievement descriptions


const skillsOptions = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "Python", label: "Python" },
  { value: "React", label: "React" },
  { value: "Django", label: "Django" },
  { value: "Node.js", label: "Node.js" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Data Analysis", label: "Data Analysis" },
  { value: "Data Science", label: "Data Science" },
  { value: "Web Development", label: "Web Development" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Project Management", label: "Project Management" },
  { value: "Team Management", label: "Team Management" },
  { value: "Leadership", label: "Leadership" },
  { value: "Communication", label: "Communication" },
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "Networking", label: "Networking" },
  { value: "Marketing Strategy", label: "Marketing Strategy" },
  { value: "Finance", label: "Finance" },
  { value: "Business Administration", label: "Business Administration" },
  { value: "Public Relations", label: "Public Relations" },
  { value: "Legal", label: "Legal" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Consulting", label: "Consulting" },
  { value: "Project Management", label: "Project Management" },
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Product Management", label: "Product Management" },
  { value: "Quality Assurance", label: "Quality Assurance" },
  { value: "UX/UI Design", label: "UX/UI Design" },
  { value: "Agile Methodologies", label: "Agile Methodologies" },
  { value: "Version Control", label: "Version Control" },
  { value: "Software Testing", label: "Software Testing" },
  
];

function ResumeForm() {
  const [formData, setFormData] = useState({
    personalInfo: { name: "", email: "", phone: "", address: "" },
    socialLinks: { linkedIn: "", github: "", twitter: "" }, // Social Links Added
    professionalSummary: "",
    education: [{ degree: "", institution: "", year: "" }],
    experience: [{ role: "", company: "", duration: "" }],
    projects: [{ title: "", description: "", duration: "" }],
    skills: [],
    certifications: [{ title: "", date: "" }],
    achievements: [{ title: "", year: "" }],
    languages: [{ language: "", proficiency: "" }],
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the logged-in user's email from local storage or another secure source
        const loggedInUserEmail = localStorage.getItem("userEmail"); // Assuming you store the email in localStorage
  
        if (!loggedInUserEmail) {
          console.error("No logged-in user email found");
          return;
        }
  
        // Fetch the user data for the logged-in user
        const response = await fetch(`http://127.0.0.1:8000/resume/fetch-latest-user-info/?email=${loggedInUserEmail}`
        );
        if (response.ok) {
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            ...data, // Merge existing structure with fetched data
          }));
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
  
    fetchUserData();
  }, []);  

  const limitWords = (text, limit) => {
    const words = text.split(" ");
    return words.length > limit ? words.slice(0, limit).join(" ") : text;
  };

  const handleInputChange = (section, key, value) => {
    const updatedData = { ...formData };
    updatedData[section][key] = value;
    setFormData(updatedData);
  };

  const handleArrayChange = (section, index, key, value) => {
    const updatedArray = [...formData[section]];
    
    // Ensure word limit for the description
    if (key === "description" && value.split(" ").length > 35) {
      alert("Description cannot exceed 35 words.");
      return;
    }
    
    updatedArray[index][key] = value;
    setFormData({ ...formData, [section]: updatedArray });
  };
  
  const addNewEntry = (section) => {
    const limits = {
      certifications: MAX_CERTIFICATIONS,
      projects: MAX_PROJECTS,
      achievements: MAX_ACHIEVEMENTS,
      experience: MAX_EXPERIENCE,
      education: MAX_EDUCATION,
    };

    if ((formData[section] || []).length >= limits[section]) {
      alert(`You can only add up to ${limits[section]} entries for ${section}.`);
      return;
    }

    const newEntry =
      section === "education"
        ? { degree: "", institution: "", year: "" }
        : section === "experience"
        ? { role: "", company: "", duration: "" }
        : { title: "", description: "", duration: "" };
    setFormData({
      ...formData,
      [section]: [...(formData[section] || []), newEntry],
    });
  };

  const deleteEntry = (section, index) => {
    const updatedArray = [...(formData[section] || [])];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [section]: updatedArray });
  };

  const handleSkillChange = (selectedOptions) => {
    setFormData({ ...formData, skills: selectedOptions || [] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.personalInfo.name) newErrors.name = "Name is required";
    if (!formData.personalInfo.email) newErrors.email = "Email is required";
    if (!formData.personalInfo.phone) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfessionalSummaryChange = (value) => {
    // Limit professional summary words
    setFormData({
      ...formData,
      professionalSummary: limitWords(value, PROFESSIONAL_SUMMARY_WORD_LIMIT),
    });
  };

  const resetForm = () => {
    setFormData({
      personalInfo: { name: "", email: "", phone: "", address: "" },
      socialLinks: { linkedIn: "", github: "", twitter: "" },
      professionalSummary: "",
      education: [{ degree: "", institution: "", year: "" }],
      experience: [{ role: "", company: "", duration: "" }],
      projects: [{ title: "", description: "", duration: "" }],
      skills: [],
      certifications: [{ title: "", date: "" }],
      achievements: [{ title: "", year: "" }],
      languages: [{ language: "", proficiency: "" }],
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://127.0.0.1:8000/resume/save-user-info/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Form submitted successfully!");
        resetForm(); // Reset only on success
        navigate("/preview");
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      alert("Error: Unable to submit form. " + error.message);
    } finally {
      console.log("Form submission attempted.");
    }
  };
    
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">ATS Resume Creator</h2>

      {/* Personal Information */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Personal Information</h3>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Full Name *"
                value={formData.personalInfo?.name || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", "name", e.target.value)
                }
              />
              <div className="invalid-feedback">{errors.name}</div>
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email *"
                value={formData.personalInfo?.email || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", "email", e.target.value)
                }
              />
              <div className="invalid-feedback">{errors.email}</div>
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Phone *"
                value={formData.personalInfo?.phone || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", "phone", e.target.value)
                }
              />
              <div className="invalid-feedback">{errors.phone}</div>
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                value={formData.personalInfo?.address || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", "address", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Professional Summary</h3>
          <textarea
            className="form-control"
            placeholder={`Write a brief summary (Max ${PROFESSIONAL_SUMMARY_WORD_LIMIT} words)`}
            value={formData.professionalSummary || ""}
            onChange={(e) => handleProfessionalSummaryChange(e.target.value)}
          ></textarea>
        </div>
      </div>
      {/* Certifications */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Certifications</h3>
          {formData.certifications?.map((cert, index) => (
            <div key={index} className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Certification Title"
                value={cert.title || ""}
                onChange={(e) =>
                  handleArrayChange("certifications", index, "title", e.target.value)
                }
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Date (eg. Jan 2021)"
                value={cert.date || ""}
                onChange={(e) =>
                  handleArrayChange("certifications", index, "date", e.target.value)
                }
              />
              <button
                className="btn btn-danger mt-2"
                onClick={() => deleteEntry("certifications", index)}
              >
                Delete Certification
              </button>
            </div>
          ))}
          <button
            className="btn btn-secondary"
            onClick={() => addNewEntry("certifications")}
          >
            Add Certification
          </button>
        </div>
      </div>

      {/* Projects */}
      <div className="card mb-4 shadow">
              <div className="card-body">
                <h3 className="card-title">Projects</h3>
                {formData.projects?.map((project, index) => (
                  <div key={index} className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Project Title"
                      value={project.title || ""}
                      onChange={(e) =>
                        handleArrayChange("projects", index, "title", e.target.value)
                      }
                    />
                    <textarea
                      className="form-control mt-2"
                      placeholder={`Description (Max ${DESCRIPTION_WORD_LIMIT} words)`}
                      value={project.description || ""}
                      onChange={(e) =>
                        handleArrayChange("projects", index, "description", e.target.value)
                      }
                    ></textarea>
                  </div>
                ))}
                <button
                  className="btn btn-secondary"
                  onClick={() => addNewEntry("projects")}
                >
                  Add Project
                </button>
              </div>
            </div>

      {/* Achievements */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Achievements (Max {MAX_ACHIEVEMENTS})</h3>
          {formData.achievements.map((ach, index) => (
            <div key={index} className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Achievement"
                value={ach.title}
                onChange={(e) =>
                  handleArrayChange("achievements", index, "title", e.target.value)
                }
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Year (eg. Jan 2021)"
                value={ach.year}
                onChange={(e) =>
                  handleArrayChange("achievements", index, "year", e.target.value)
                }
              />
              <button
                className="btn btn-danger mt-2"
                onClick={() => deleteEntry("achievements", index)}
              >
                Delete Achievement
              </button>
            </div>
          ))}
          <button
            className="btn btn-secondary"
            onClick={() => addNewEntry("achievements")}
          >
            Add Achievement
          </button>
        </div>
      </div>



      {/* Work Experience */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Work Experience (Max {MAX_EXPERIENCE})</h3>
          {formData.experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Role"
                value={exp.role || ""}
                onChange={(e) =>
                  handleArrayChange("experience", index, "role", e.target.value)
                }
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Company"
                value={exp.company || ""}
                onChange={(e) =>
                  handleArrayChange("experience", index, "company", e.target.value)
                }
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Duration (eg. Jan 2021 - Dec 2022)"
                value={exp.duration || ""}
                onChange={(e) =>
                  handleArrayChange("experience", index, "duration", e.target.value)
                }
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Work Description (Max 25 words)"
                value={formData.experience[index]?.description || ""}
                onChange={(e) =>
                  handleArrayChange("experience", index, "description", e.target.value)
                }
              />
              <small className="form-text text-muted">

              </small>
              <button
                className="btn btn-danger mt-2"
                onClick={() => deleteEntry("experience", index)}
              >
                Delete Experience
              </button>
                          </div>
                        ))}
                        <button
                          className="btn btn-secondary"
                          onClick={() => addNewEntry("experience")}
                        >
                          Add Experience
                        </button>
                      </div>
                    </div>

      {/* Education */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Education (Max {MAX_EDUCATION})</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Degree"
                value={edu.degree || ""}
                onChange={(e) =>
                  handleArrayChange("education", index, "degree", e.target.value)
                }
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Institution"
                value={edu.institution || ""}
                onChange={(e) =>
                  handleArrayChange("education", index, "institution", e.target.value)
                }
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Year (eg. Jan 2021 - Jan 2025)"
                value={edu.year || ""}
                onChange={(e) =>
                  handleArrayChange("education", index, "year", e.target.value)
                }
              />
              <button
                className="btn btn-danger mt-2"
                onClick={() => deleteEntry("education", index)}
              >
                Delete Education
              </button>
            </div>
          ))}
          <button
            className="btn btn-secondary"
            onClick={() => addNewEntry("education")}
          >
            Add Education
          </button>
        </div>
      </div>

      {/* Skills */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Skills</h3>
          <Select
            isMulti
            options={skillsOptions}
            onChange={handleSkillChange}
            value={formData.skills}
            placeholder="Select your skills"
          />
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-secondary btn-lg" onClick={resetForm}>
          Reset Form
        </button>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
          Submit Resume
        </button>
      </div>
    </div>
  );
}

export default ResumeForm;