import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'



function Orders() {

  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState(null)

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

      <h1>Your last orders</h1>


      <div className='basket-elements'>
        {userData ?
          userData.orders.length > 0 &&
          userData.orders.sort((b, a) => a.id - b.id).map((order) => {
            return (
              <div key={order.id} className='profile-card order-card'>
                <div className="buffer">
                  <Link className='bootstrap-link'>
                    <div className="profile-card-image" style={{ backgroundImage: `url(${order.product_ordered.images.split(' ')[0]})` }}></div>
                  </Link>
                  <p className='profile-card-description'>{order.product_ordered.description}</p>
                  <p className='profile-card-price'>£ {order.product_ordered.price}</p>
                  <p className='profile-card-price'>number of items: {order.count}</p>
                  <p className='profile-card-price'>Total: £ {(order.product_ordered.price * order.count).toFixed(2)}</p>
                  <Link className='' to={`/reviews/${order.product_ordered.id}`} id='trend'>Review product</ Link>
                </div>
              </div>
            )
          })
          :
          <h2>Loading...</h2>
        }
      </div>
    </main>
  )

}

export default Orders