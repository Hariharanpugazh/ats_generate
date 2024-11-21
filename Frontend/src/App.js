import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import Login from "./components/login"; // Import Login Component
import Register from "./components/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/resume" element={<ResumeForm />} />
        <Route path="/preview" element={<ResumePreview />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
