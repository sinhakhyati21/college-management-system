import { useState } from "react";
import api from "../../api";

export default function AdminRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    designation: ""
  });

  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("designation", form.designation);
    data.append("photo", photo);

    try {
      await api.post("/auth/add-first-admin", data);
      alert("Admin created!");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Admin Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} />
        <input placeholder="Designation" onChange={(e) => setForm({...form, designation: e.target.value})} />
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
}