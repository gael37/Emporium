import { Link } from 'react-router-dom'
import { getPayload } from '../../../helpers/auth'
import axios from 'axios'
import { getToken } from '../../../helpers/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import validate from '../../../assets/images/validate.png'


const AreYouSure = () => {

  const payload = getPayload()
  const currentUserId = payload.sub


  const [errors, setErrors] = useState(null)
  const [deleted, setDeleted] = useState(false)

  const navigate = useNavigate()

  const handleDelete = async (e) => {

    try {
      const { data } = await axios.delete(`/api/auth/${currentUserId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setDeleted(true)
      console.log('delete SUCCESS ->', data)
    } catch (err) {
      console.log('review FAIL ->', err)
      setErrors(err.response.data)
    }
  }

  const goRegister = () => {
    navigate('/register')
  }
  const goHome = () => {
    navigate('/home-user')
  }
  const goAccount = () => {
    navigate('/account-details')
  }

  return (
    <main className="order-page-wrapper">


      {!deleted &&
        <div className="flex-delete">
          <h1 className='delete-msg2'>Are you sure you want to delete your emporium account?</h1>
          <button className="button-adress red-button-adress" onClick={handleDelete}><span>Yes, please delete my account</span></button>
          <button className="button-adress" onClick={goAccount}><span>Do not delete my account</span></button>
        </div>
      }
      {deleted &&
        <>
          <div className="flex-validate">
            <img src={validate} alt='in basket'></img>
            <p><span>Emporium account successfully deleted!<br>Hoping to seeing you back soon.</br></span></p>
          </div>
          <p><button className='button-adress' onClick={goRegister}>Create an emporium account</button> or <button className='button-adress' onClick={goHome}>browse website as a guest</button>.</p>
        </>
      }
    </main>
  )
}

export default AreYouSure