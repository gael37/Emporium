import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload } from '../../../helpers/auth'

import { useParams, useNavigate } from 'react-router-dom' // Importing useParams, we have access to any placeholders in the url


const AccountDetails = () => {

  const [profileData, setProfileData] = useState(null)
  const [errors, setErrors] = useState(false)

  const payload = getPayload()
  const currentUserId = payload.sub

  const navigate = useNavigate()

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get(`api/auth/${currentUserId}/`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        console.log('data', data)
        setProfileData(data)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getProfile()
  }, [])


  const handleClickDelete = () => {
    navigate('/are-you-sure')
  }

  const handleClickEdit = () => {
    navigate(`/edit-profile/${currentUserId}`)
  }

  return (
    <main className="profile-page-wrapper">
      {profileData ?
        <div className="account-section">
          <h1>Account details</h1>
          {profileData.image &&
            <img className="profile-pic" src={profileData.image}></img>
          }
          <div className="account-details">
            <h2 className='profile-details'><span id='span-username'>{profileData.username}</span></h2>
            <p className='profile-details'><span id='span-email'>{profileData.email}</span></p>
            <p className='profile-details'><span id='span-email'>{profileData.postcode}</span></p>
          </div>
          <button className="yellow-button" onClick={handleClickEdit}>Edit my details</button>
          <button className="red-button" onClick={handleClickDelete}>Delete my account</button>

        </div>
        :
        errors ? <h2>Something went wrong! Please try again later!</h2> : <h2>Loading</h2>
      }
    </main >
  )
}


export default AccountDetails