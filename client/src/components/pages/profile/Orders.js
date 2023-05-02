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
    <main className="order-page-wrapper">

      <h1>Your last orders</h1>


      <div className='basket-elements'>
        {userData ?
          userData.orders.length > 0 &&
          userData.orders.sort((b, a) => a.id - b.id).map((order) => {
            return (
              <section key={order.id} className='profile-card order-card'>
                <div className="flex-order-info">
                  <div className="flex-order-date">
                    <p><span>ORDER PLACED</span></p>
                    {order.created_at.toString().slice(5, 7) === '01' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} January {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '02' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} February {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '03' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} March {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '04' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} April {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '05' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} May {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '06' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} June {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '07' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} July {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '08' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} August {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '09' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} September {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '10' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} October {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '11' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} November {order.created_at.toString().slice(0, 4)}</p>
                    }
                    {order.created_at.toString().slice(5, 7) === '12' &&
                      <p className="order-card-date">{order.created_at.toString().slice(8, 10)} December {order.created_at.toString().slice(0, 4)}</p>
                    }
                  </div>
                  <div className="flex-order-total">
                    <p><span>TOTAL</span></p>
                    <p className='order-card-price'>£{(order.product_ordered.price * order.count).toFixed(2)}</p>
                  </div>
                  <div className="flex-order-dispatch">
                    <p><span>DISPATCH TO</span></p>
                    <p>{order.order_owner.username}, {order.order_owner.postcode}</p>
                  </div>
                </div>
                <div className="flex-order-image">
                  <div className="order-card-image" style={{ backgroundImage: `url(${order.product_ordered.images.split(' ')[0]})` }}></div>
                  <div className='order-description'>
                    <p className='order-card-description'><span>{order.product_ordered.description}</span></p>
                    <p>Quantity: {order.count}</p>
                  </div>
                  <div className="flex-order-buttons">
                    <Link className='regular-button link-button button-fixed' to={`/products/${order.product_ordered.id}`}>View your item</ Link>
                    <Link className='yellow-button link-button button-fixed' to={`/reviews/${order.product_ordered.id}`}>Write a product review</ Link>
                  </div>
                </div>
                <div className="flex-order-buttons-below">
                  <Link className='regular-button link-button button-fixed' to={`/products/${order.product_ordered.id}`}>View your item</ Link>
                  <Link className='yellow-button link-button button-fixed' to={`/reviews/${order.product_ordered.id}`}>Write a product review</ Link>
                </div>
              </section>
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