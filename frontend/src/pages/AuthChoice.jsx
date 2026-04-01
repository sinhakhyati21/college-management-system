import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthChoice = () => {
  const navigate = useNavigate()
  const { selectedRole } = useAuth()

  const handleRegister = () => {
    navigate('/register')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="auth-choice-container">
      <div className="auth-choice-card">
        <button className="back-btn" onClick={handleBack}>← Back</button>
        
        <h1>College Management Portal</h1>
        <h2>Welcome, {selectedRole}!</h2>
        <p>What would you like to do?</p>

        <div className="choice-buttons">
          <button className="choice-btn register-btn" onClick={handleRegister}>
            <div className="choice-icon">📝</div>
            <div className="choice-title">Create Account</div>
            <div className="choice-desc">Sign up as a new {selectedRole}</div>
          </button>

          <button className="choice-btn login-btn" onClick={handleLogin}>
            <div className="choice-icon">🔐</div>
            <div className="choice-title">Login</div>
            <div className="choice-desc">Sign in to your account</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthChoice
