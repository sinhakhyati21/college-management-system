import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RoleSelection = () => {
  const navigate = useNavigate()
  const { setSelectedRole } = useAuth()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    navigate('/auth-choice')
  }

  return (
    <div className="role-container">
      <div className="role-card">
        <h1>College Management Portal</h1>
        <h2>Who are you?</h2>
        <p>Select your role to continue</p>
        
        <div className="role-buttons">
          <button 
            className="role-btn student-btn"
            onClick={() => handleRoleSelect('Student')}
          >
            <div className="role-icon">👨‍🎓</div>
            <div className="role-name">Student</div>
          </button>

          <button 
            className="role-btn professor-btn"
            onClick={() => handleRoleSelect('Professor')}
          >
            <div className="role-icon">👨‍🏫</div>
            <div className="role-name">Professor</div>
          </button>

          <button 
            className="role-btn admin-btn"
            onClick={() => handleRoleSelect('Admin')}
          >
            <div className="role-icon">👨‍💼</div>
            <div className="role-name">Admin</div>
          </button>
        </div>
        
        <div className="system-init">
          <p>New system? <button className="init-link" onClick={() => navigate('/add-first-admin')}>Initialize First Admin</button></p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
