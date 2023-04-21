import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'

const Basket = (userData, setUserData) => {

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

    <main className="profile-page-wrapper">
      <h1>Welcome to the basket</h1>
      {/* {userData && userData.basket.length > 0 ?
        userData.basket.map((product, index) => {
          <div key={index}>Product {index}</div>
        })
        :
        <h2>BASKET EMPTY</h2>
      } */}
    </main>
  )

}


export default Basket