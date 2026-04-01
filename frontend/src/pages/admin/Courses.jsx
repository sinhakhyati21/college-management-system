import { useEffect, useState } from "react"
import axios from "axios"

const Courses = () => {
  const [courses, setCourses] = useState([])

  const fetchCourses = async () => {
    const res = await axios.get("/api/v1/admin/courses", {
      withCredentials: true
    })
    setCourses(res.data.data)
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Courses</h2>

      {courses.map(c => (
        <div key={c._id} className="border p-3 mb-2">
          {c.title} ({c.code})
        </div>
      ))}
    </div>
  )
}

export default Courses