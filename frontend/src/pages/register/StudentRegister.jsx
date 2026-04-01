import { useState } from "react";
import api from "../../api";

export default function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollno: "",
    degree: "UG",
    branch: "",
    admissionYear: "",
    semester: "",
    dob: ""
  });

  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));

    data.append("role", "Student");
    data.append("photo", photo);
    data.append("signature", signature);

    try {
      await api.post("/auth/register", data);
      alert("Student registered!");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Student Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} />
        <input placeholder="Roll No" onChange={(e) => setForm({...form, rollno: e.target.value})} />
        <input placeholder="Branch" onChange={(e) => setForm({...form, branch: e.target.value})} />
        <input placeholder="Admission Year" onChange={(e) => setForm({...form, admissionYear: e.target.value})} />
        <input placeholder="Semester" onChange={(e) => setForm({...form, semester: e.target.value})} />
        <input type="date" onChange={(e) => setForm({...form, dob: e.target.value})} />

        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        <input type="file" onChange={(e) => setSignature(e.target.files[0])} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}