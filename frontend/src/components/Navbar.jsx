import { useNavigate } from "react-router-dom"
import api from "../api";

const Navbar = () => {
  const navigate = useNavigate()

  const logout = async () => {
    await axios.post("/auth/logout")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="bg-black text-white p-3 flex justify-between">
      <h1>ERP System</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Navbar