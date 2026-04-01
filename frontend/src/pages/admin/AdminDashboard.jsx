import { useState } from "react";
import api from "../../api";
import "../../styles/admin.css";
export default function AdminDashboard() {
  const [view, setView] = useState("");
  const [data, setData] = useState([]);
  const [branch, setBranch] = useState("");

  // 🔹 Fetch data
  const fetchData = async (endpoint) => {
    try {
      const res = await api.get(endpoint);
      setData(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // 🔹 Register Student
  const registerStudent = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    form.append("role", "Student");

    try {
      await api.post("/auth/register", form);
      alert("Student registered!");
      e.target.reset();
      setBranch(""); // reset dropdown
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // 🔹 Register Professor
  const registerProfessor = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    form.append("role", "Professor");

    try {
      await api.post("/auth/register", form);
      alert("Professor registered!");
      e.target.reset();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
  <div className="container">
    <h2>Admin Dashboard</h2>

    {/* NAVBAR */}
    <div className="nav">
      <button onClick={() => setView("student")}>Add Student</button>
      <button onClick={() => setView("professor")}>Add Professor</button>
      <button onClick={() => { setView("courses"); fetchData("/admin/courses"); }}>
        Courses
      </button>
      <button onClick={() => { setView("students"); fetchData("/admin/students"); }}>
        Students
      </button>
      <button onClick={() => { setView("professors"); fetchData("/admin/professor"); }}>
        Professors
      </button>
    </div>

    {/* STUDENT FORM */}
    {view === "student" && (
      <div className="card">
        <h3>Register Student</h3>
        <form onSubmit={registerStudent}>
          <input name="name" placeholder="Name" required />
          <input name="email" placeholder="Email" required />
          <input name="rollno" placeholder="Roll No" required />

          <select name="branch" value={branch} onChange={(e) => setBranch(e.target.value)} required>
            <option value="">Select Branch</option>
            <option value="Computer Science and Engineering">CSE</option>
            <option value="Electrical Engineering">EE</option>
            <option value="Mechanical Engineering">ME</option>
          </select>

          <input name="admissionYear" placeholder="Admission Year" required />
          <input name="semester" placeholder="Semester" required />
          <input name="dob" type="date" required />

          <select name="degree">
            <option value="UG">UG</option>
            <option value="PG">PG</option>
          </select>

          <input type="file" name="photo" required />
          <input type="file" name="signature" required />

          <button className="submit">Register</button>
        </form>
      </div>
    )}

    {/* PROFESSOR FORM */}
    {view === "professor" && (
      <div className="card">
        <h3>Register Professor</h3>
        <form onSubmit={registerProfessor}>
          <input name="name" placeholder="Name" required />
          <input name="email" placeholder="Email" required />
          <input name="employeeId" placeholder="Employee ID" required />
          <input name="department" placeholder="Department" required />
          <input name="designation" placeholder="Designation" required />
          <input name="joiningYear" placeholder="Joining Year" required />
          <input name="dob" type="date" required />
          <input type="file" name="photo" required />

          <button className="submit">Register</button>
        </form>
      </div>
    )}

    {/* DATA VIEW */}
    {(view === "courses" || view === "students" || view === "professors") && (
      <div className="card">
        <h3>Data</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    )}
  </div>
);
}