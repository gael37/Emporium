import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'



function Orders(userData, setUserData) {

  const [errors, setErrors] = useState(false)


  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub
  console.log('user id', currentUserId)

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`api/auth/${currentUserId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('user data, ', data)
      setUserData(data)
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    < p > geg</p >
  )

}

export default Orders