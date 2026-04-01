import { useState } from "react";
import api from "../../api";

export default function ProfessorRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    designation: "",
    joiningYear: "",
    dob: ""
  });

  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach(key => data.append(key, form[key]));
    data.append("role", "Professor");
    data.append("photo", photo);

    try {
      await api.post("/auth/register", data);
      alert("Professor registered!");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Professor Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} />
        <input placeholder="Employee ID" onChange={(e) => setForm({...form, employeeId: e.target.value})} />
        <input placeholder="Department" onChange={(e) => setForm({...form, department: e.target.value})} />
        <input placeholder="Designation" onChange={(e) => setForm({...form, designation: e.target.value})} />
        <input placeholder="Joining Year" onChange={(e) => setForm({...form, joiningYear: e.target.value})} />
        <input type="date" onChange={(e) => setForm({...form, dob: e.target.value})} />
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}