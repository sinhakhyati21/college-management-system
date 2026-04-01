import { useEffect, useState } from "react"
import axios from "axios"

const Professors = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get("/api/v1/admin/professor", { withCredentials: true })
      .then(res => setData(res.data.data))
  }, [])

  return (
    <div className="p-6">
      <h2>Professors</h2>
      {data.map(p => (
        <div key={p._id} className="border p-2 mb-2">
          {p.employeeId}
        </div>
      ))}
    </div>
  )
}

export default Professors