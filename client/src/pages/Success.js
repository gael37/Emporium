import { useState, useEffect } from 'react'
import axios from 'axios'
import { getToken, getPayload } from '../helpers/auth'
import { Link } from 'react-router-dom'

import validate from '../assets/images/validate.png'

import { useNavigate } from 'react-router-dom'

function Success({ setBasketCounter }) {

  const [userData, setUserData] = useState(null)
  const [errors, setErrors] = useState(false)
  const [postcodeData, setPostcodeData] = useState('')
  const [orderLoaded, setOrderLoaded] = useState(false)


  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub
  console.log('user id', currentUserId)

  const navigate = useNavigate()
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`/api/auth/${currentUserId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('userdata, ', data)
      setUserData(data)
      // setBasketCounter(counter)
      // const counter = data.basket.reduce((acc, obj) => {
      //   return acc + parseInt(obj.count)
      // }, 0)
      // console.log('basket counter, ', counter)

      // setBasketCounter(counter)
      // setUserData(data)
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
    setBasketCounter(0)
  }, [])

  useEffect(() => {
    getPostcodeData()
    createOrder()
    deleteBasket()

  }, [userData])

  const goHome = () => {
    navigate('/home-user')
  }

  const goOrders = () => {
    navigate('/orders')
  }

  return (

    <main className="order-page-wrapper">
      <>
        <div className="flex-validate">
          <img src={validate} alt='in basket'></img>
          <p><span>Order placed - Thank you for your purchase!</span></p>
        </div>
        <div className="basket-empty">
          <p>View your <button className='button-adress' onClick={goOrders}>orders</button> or <button className='button-adress' onClick={goHome}>continue shopping</button>.</p>
        </div>
        {/* <h1>Order placed:</h1> */}
        {/* <p>Items will be delivered to:</p><br></br>
        {userData &&
          <h4>{userData.username}</h4>
        }
        {postcodeData &&
          <>
            <h4>{postcodeData.result.postcode}</h4>
            <h4>{postcodeData.result.admin_district}, {postcodeData.result.country}</h4><br></br>
          </>
        } */}
        {/* <div className='basket-elements'>
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

                  </div>

                </section>
              )
            })
            :
            <h2>Loading...</h2>
          }
        </div> */}
      </>
    </main >
  )

}

export default Success