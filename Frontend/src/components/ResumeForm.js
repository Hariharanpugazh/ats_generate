import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";


const skillsOptions = [
  { value: "JavaScript", label: "JavaScript" },
  { value: "Python", label: "Python" },
  { value: "React", label: "React" },
  { value: "Django", label: "Django" },
  { value: "Node.js", label: "Node.js" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Data Analysis", label: "Data Analysis" },
];

function ResumeForm() {
  const [formData, setFormData] = useState({
    personalInfo: { name: "", email: "", phone: "", address: "" },
    professionalSummary: "",
    education: [{ degree: "", institution: "", year: "" }],
    experience: [{ role: "", company: "", duration: "" }],
    projects: [{ title: "", description: "", duration: "" }],
    skills: [],
    fresherOrProfessional: "",
    yearsOfExperience: "",
    certifications: [{ title: "", date: "" }],
    achievements: [{ title: "", year: "" }],
    languages: [{ language: "", proficiency: "" }]
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (section, key, value) => {
    const updatedData = { ...formData };
    updatedData[section][key] = value;
    setFormData(updatedData);
  };

  const handleArrayChange = (section, index, key, value) => {
    const updatedArray = [...formData[section]];
    updatedArray[index][key] = value;
    setFormData({ ...formData, [section]: updatedArray });
  };

  const addNewEntry = (section) => {
    const newEntry =
      section === "education"
        ? { degree: "", institution: "", year: "" }
        : section === "experience"
        ? { role: "", company: "", duration: "" }
        : { title: "", description: "", duration: "" };
    setFormData({ ...formData, [section]: [...formData[section], newEntry] });
  };

  const deleteEntry = (section, index) => {
    const updatedArray = [...formData[section]];
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

  const addNewCertification = () => {
    const newCertification = { title: "", date: "" };
    setFormData({ ...formData, certifications: [...formData.certifications, newCertification] });
  };
  
  const addNewAchievement = () => {
    const newAchievement = { title: "", year: "" };
    setFormData({ ...formData, achievements: [...formData.achievements, newAchievement] });
  };
  
  const addNewLanguage = () => {
    const newLanguage = { language: "", proficiency: "" };
    setFormData({ ...formData, languages: [...formData.languages, newLanguage] });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Submitting Form Data:", JSON.stringify(formData));

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
        navigate("/preview");
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      alert("Error: Unable to submit form. " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">ATS Resume Creator</h2>

      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Personal Information</h3>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Full Name *"
                value={formData.personalInfo.name || ""}
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
                value={formData.personalInfo.email || ""}
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
                value={formData.personalInfo.phone || ""}
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
                value={formData.personalInfo.address || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", "address", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Professional Summary</h3>
          <textarea
            className="form-control"
            placeholder="Write a brief summary about your professional experience and goals."
            value={formData.professionalSummary || ""}
            onChange={(e) =>
              setFormData({ ...formData, professionalSummary: e.target.value })
            }
          ></textarea>
        </div>
      </div>

      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Are you a Fresher or Professional?</h3>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="fresherOrProfessional"
              id="fresher"
              value="fresher"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fresherOrProfessional: e.target.value,
                })
              }
            />
            <label className="form-check-label" htmlFor="fresher">
              Fresher
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="fresherOrProfessional"
              id="professional"
              value="professional"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fresherOrProfessional: e.target.value,
                })
              }
            />
            <label className="form-check-label" htmlFor="professional">
              Professional
            </label>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow">
  <div className="card-body">
    <h3 className="card-title">Certifications</h3>
    {formData.certifications.map((cert, index) => (
      <div key={index} className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Certification Title"
          value={cert.title}
          onChange={(e) => handleArrayChange("certifications", index, "title", e.target.value)}
        />
        <input
          type="text"
          className="form-control mt-2"
          placeholder="Date"
          value={cert.date}
          onChange={(e) => handleArrayChange("certifications", index, "date", e.target.value)}
        />
      </div>
    ))}
    <button className="btn btn-secondary" onClick={addNewCertification}>Add Certification</button>
  </div>
</div>

<div className="card mb-4 shadow">
  <div className="card-body">
    <h3 className="card-title">Achievements</h3>
    {formData.achievements.map((ach, index) => (
      <div key={index} className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Achievement"
          value={ach.title}
          onChange={(e) => handleArrayChange("achievements", index, "title", e.target.value)}
        />
        <input
          type="text"
          className="form-control mt-2"
          placeholder="Year"
          value={ach.year}
          onChange={(e) => handleArrayChange("achievements", index, "year", e.target.value)}
        />
      </div>
    ))}
    <button className="btn btn-secondary" onClick={addNewAchievement}>Add Achievement</button>
  </div>
</div>

<div className="card mb-4 shadow">
  <div className="card-body">
    <h3 className="card-title">Languages Known</h3>
    {formData.languages.map((lang, index) => (
      <div key={index} className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Language"
          value={lang.language}
          onChange={(e) => handleArrayChange("languages", index, "language", e.target.value)}
        />
        <input
          type="text"
          className="form-control mt-2"
          placeholder="Proficiency Level"
          value={lang.proficiency}
          onChange={(e) => handleArrayChange("languages", index, "proficiency", e.target.value)}
        />
      </div>
    ))}
    <button className="btn btn-secondary" onClick={addNewLanguage}>Add Language</button>
  </div>
</div>


      {formData.fresherOrProfessional === "fresher" && (
        <div className="card mb-4 shadow">
          <div className="card-body">
            <h3 className="card-title">Projects</h3>
            {formData.projects.map((project, index) => (
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
                  placeholder="Description"
                  value={project.description || ""}
                  onChange={(e) =>
                    handleArrayChange("projects", index, "description", e.target.value)
                  }
                ></textarea>
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Duration"
                  value={project.duration || ""}
                  onChange={(e) =>
                    handleArrayChange("projects", index, "duration", e.target.value)
                  }
                />
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => deleteEntry("projects", index)}
                >
                  Delete Project
                </button>
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
      )}

      {formData.fresherOrProfessional === "professional" && (
        <div className="card mb-4 shadow">
          <div className="card-body">
            <h3 className="card-title">Work Experience</h3>
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
                  placeholder="Duration"
                  value={exp.duration || ""}
                  onChange={(e) =>
                    handleArrayChange("experience", index, "duration", e.target.value)
                  }
                />
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
      )}

      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Education</h3>
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
                placeholder="Year"
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
        <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
          Submit Resume
        </button>
      </div>
    </div>
  );
}

export default ResumeForm;
