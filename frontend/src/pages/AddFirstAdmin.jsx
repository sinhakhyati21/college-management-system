import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddFirstAdmin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: ''
  })
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!photo) {
      setError('Photo is required')
      setLoading(false)
      return
    }

    const data = new FormData()
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key])
    })
    data.append('photo', photo)

    try {
      const response = await axios.post('/api/v1/auth/add-first-admin', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess('First admin created successfully! Check your email to set the password.')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-setup-container">
      <div className="admin-setup-card">
        <h1>System Initialization</h1>
        <p>Create the first administrator account to get started.</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="admin-setup-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="Enter admin's full name"
            />
          </div>
          
          <div className="form-group">
            <label>Email Address *</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="admin@college.edu"
            />
          </div>
          
          <div className="form-group">
            <label>Designation *</label>
            <input 
              type="text" 
              name="designation" 
              value={formData.designation} 
              onChange={handleChange} 
              required 
              placeholder="System Administrator"
            />
          </div>
          
          <div className="form-group">
            <label>Profile Photo *</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              required 
            />
          </div>
          
          <button type="submit" disabled={loading} className="setup-btn">
            {loading ? 'Creating Admin...' : 'Create First Admin'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddFirstAdmin