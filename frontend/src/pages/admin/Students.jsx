import { useEffect, useState } from "react"
import axios from "axios"

const Students = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get("/api/v1/admin/students", { withCredentials: true })
      .then(res => setData(res.data.data))
  }, [])

  return (
    <div className="p-6">
      <h2>Students</h2>
      {data.map(s => (
        <div key={s._id} className="border p-2 mb-2">
          {s.rollno}
        </div>
      ))}
    </div>
  )
}

export default Students