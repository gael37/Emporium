import { useState, useEffect } from 'react'
import axios from 'axios'
import { getToken, getPayload } from '../helpers/auth'
import { Link } from 'react-router-dom'

function Success({ setBasketCounter }) {

  const [userData, setUserData] = useState(null)
  const [errors, setErrors] = useState(false)
  const [postcodeData, setPostcodeData] = useState('')


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
      setUserData(data)
      setBasketCounter(counter)
      const counter = data.basket.reduce((acc, obj) => {
        return acc + parseInt(obj.count)
      }, 0)
      console.log('basket counter, ', counter)
      console.log('userdata, ', data)
      setBasketCounter(counter)
      setUserData(data)
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  const getPostcodeData = async () => {
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${userData.postcode}/`)
      console.log('postcode datra', data)
      setPostcodeData(data)
    } catch (err) {
      console.log(err)
    }
  }

  const createOrder = async () => {
    for (let i = 0; i < userData.basket.length; i++) {
      try {
        const { data } = await axios.post('/api/orders/', { count: userData.basket[i].count, order_owner: currentUserId, product_ordered: userData.basket[i].product_added_to_basket.id }, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        // setCounter(newCount)
        console.log('RESPONSE FROM ALL BASKET DELETE ', data)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const deleteBasket = async () => {
    for (let i = 0; i < userData.basket.length; i++) {
      if (userData.basket[i].basket_owner.id === currentUserId) {
        console.log('basket pk :', userData.basket[i].id)
        try {
          const { data } = await axios.delete(`/api/basket/${userData.basket[i].id}/`, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          // setCounter(newCount)
          console.log('RESPONSE FROM ALL BASKET DELETE ', data)
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  useEffect(() => {
    getPostcodeData()
    createOrder()
    deleteBasket()
    console.log(userData)
  }, [userData])



  return (

    <main className="profile-page-wrapper">
      <>
        <h1>Order placed:</h1>
        <p>Items will be delivered to:</p>
        {userData &&
          <h2>{userData.username}</h2>
        }
        {postcodeData &&
          <>
            <h2>{postcodeData.result.postcode}</h2>
            <h2>{postcodeData.result.admin_district}, {postcodeData.result.country}</h2>
          </>
        }
        <div className='flex-basket'>
          <div className='basket-elements'>
            {userData && userData.orders.length > 0 &&
              userData.orders.sort((a, b) => a.id - b.id).map((order) => {
                return (
                  <div key={order.id} className='product-card basket-card'>
                    <div className="buffer">
                      <Link className='bootstrap-link'>
                        <div className="product-card-image" style={{ backgroundImage: `url(${order.product_ordered.images.split(' ')[0]})` }}></div>
                      </Link>
                      <p className='product-card-description'>{order.product_ordered.description}</p>
                      <p className='product-card-price'>£ {order.product_ordered.price}</p>
                      <div className="flex-count">
                        <p className='product-card-price'>Quantity: {order.count}</p>
                      </div>
                      <p className='product-card-price'>Sub-total: £ {(order.product_ordered.price * order.count).toFixed(2)}</p>
                    </div>
                  </div>
                )
              })
            }</div>

          <p className='purchase-message'> ✅ Thank you for your purchase!</p>

        </div>
      </>
    </main >
  )

}

export default Success