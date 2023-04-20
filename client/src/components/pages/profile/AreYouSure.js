import { Link } from 'react-router-dom'
import { getPayload } from '../../../helpers/auth'
import axios from 'axios'
import { getToken } from '../../../helpers/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const AreYouSure = () => {

  const payload = getPayload()
  const currentUserId = payload.sub


  const [errors, setErrors] = useState(null)

  const navigate = useNavigate()

  const handleDelete = async (e) => {
    try {
      const { data } = await axios.delete(`/api/auth/${currentUserId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      navigate('/delete-account')
      console.log('delete SUCCESS ->', data)
    } catch (err) {
      console.log('review FAIL ->', err)
      setErrors(err.response.data)
    }
  }



  return (
    <div className="flex-delete">
      <h1 className='delete-msg2'>Are you sure?</h1>
      <button className="btn-post-delete3" onClick={handleDelete}>YES, PLEASE DELETE MY ACCOUNT</button>
      <Link className="btn-delete" as={Link} to='/profile'>Back to my account</Link>
    </div>
  )
}

export default AreYouSure