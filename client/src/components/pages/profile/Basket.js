import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'

const Basket = () => {

  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState(null)

  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub
  console.log('user id', currentUserId)



  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get(`api/auth/${currentUserId}/`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setUserData(data)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getUserData()
  }, [])

  useEffect(() => {
    console.log('user data, ', userData)
  }, [userData])

  return (

    <main className="profile-page-wrapper">
      <>
        <h1>Shopping basket</h1>
        <div className='flex-basket'>
          <div className='basket-elements'>
            {userData && userData.basket.length > 0 &&
              userData.basket.map((basket, index) => {
                return (
                  <div key={index} className='profile-card basket-card'>
                    <div className="buffer">
                      <Link className='bootstrap-link'>
                        <div className="profile-card-image" style={{ backgroundImage: `url(${basket.product_added_to_basket.images.split(' ')[0]})` }}></div>
                      </Link>
                      <p className='profile-card-description'>{basket.product_added_to_basket.description}</p>
                      <p className='profile-card-price'>{basket.count}</p>
                    </div>
                  </div>
                )
              })
            }</div>
          <div className='basket-checkout'>
            <h2>TOTAL</h2>
            <h2>x £</h2>
            <button>Proceed to checkout</button>
          </div>
        </div>

      </>
    </main >
  )

}


export default Basket