import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getToken, getPayload } from '../../../helpers/auth'

const SingleProduct2 = () => {

  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub
  console.log('user id', currentUserId)

  const { productId } = useParams()
  const [userData, setUserData] = useState(null)
  const [errors, setErrors] = useState(false)



  const getUserData = async () => {
    try {
      const { data } = await axios.get(`/api/auth/${getPayload().sub}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setUserData(data)
      console.log('premier user data ', data)
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  useEffect(() => {
    console.log('user data second', userData)
  }, [userData])

  useEffect(() => {
    getUserData()
  }, [productId])

  return (
    <h1>Hey</h1>
  )
}

export default SingleProduct2