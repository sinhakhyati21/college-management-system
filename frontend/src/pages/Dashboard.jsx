import AdminDashboard from "./admin/AdminDashboard";
import ProfessorDashboard from "./professor/ProfessorDashboard";
import StudentDashboard from "./student/StudentDashboard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <h2>Please login</h2>;

  if (user.role === "Admin") return <AdminDashboard />;
  if (user.role === "Professor") return <ProfessorDashboard />;
  if (user.role === "Student") return <StudentDashboard />;

  return <h2>Unknown role</h2>;
}