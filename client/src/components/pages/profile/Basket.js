import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useRouteLoaderData } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'

const Basket = () => {

  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState(null)
  const [productJustLiked, setProductJustLiked] = useState(false)
  // const [counter, setCounter] = useState(0)

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
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  useEffect(() => {
    console.log('user data, ', userData)
  }, [userData])

  useEffect(() => {
    getUserData()
  }, [])


  // ------ADD AND REMOVE------

  const handleBasketAdd = async (basket) => {

    const currentCount = basket.count
    const basketPK = basket.id
    console.log('basketPK :', basketPK)
    console.log('current count :', currentCount)

    try {
      const newCount = parseInt(currentCount) + 1
      const { data } = await axios.put(`/api/basket/${basketPK}/`, { count: newCount, basket_owner: currentUserId, product_added_to_basket: basket.product_added_to_basket.id }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      // setCounter(newCount)
      console.log('RESPONSE FROM BASKET PUT ', data)
    } catch (err) {
      console.log(err)
    }
    setProductJustLiked(productJustLiked ? false : true)
  }

  const handleBasketRemove = async (basket) => {
    const currentCount = basket.count
    const basketPK = basket.id
    console.log('basketPK :', basketPK)
    console.log('current count :', currentCount)

    if (currentCount !== '0') {
      try {
        const newCount = parseInt(currentCount) - 1
        const { data } = await axios.put(`/api/basket/${basketPK}/`, { count: newCount, basket_owner: currentUserId, product_added_to_basket: basket.product_added_to_basket.id }, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        // setCounter(newCount)
        console.log('RESPONSE FROM BASKET PUT ', data)
      } catch (err) {
        console.log(err)
      }
      setProductJustLiked(productJustLiked ? false : true)
    }
  }

  const removeProductFromBasket = async (basket) => {
    const basketPK = basket.id
    try {
      const { data } = await axios.delete(`/api/basket/${basketPK}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      // setCounter(newCount)
      console.log('RESPONSE FROM PRODUCT DELETE ', data)
    } catch (err) {
      console.log(err)
    }
    setProductJustLiked(productJustLiked ? false : true)
  }

  const removeAllBasket = async () => {
    for (let i = 0; i < userData.basket.length; i++) {
      try {
        const { data } = await axios.delete(`/api/basket/${i}/`, {
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

    setProductJustLiked(productJustLiked ? false : true)
  }


  useEffect(() => {
    console.log('product just liked :', productJustLiked)
    getUserData()
  }, [productJustLiked])

  return (

    <main className="profile-page-wrapper">
      <>
        <h1>Shopping basket</h1>
        <button className='delete-button' onClick={() => removeAllBasket()}>Delete basket</button>
        <div className='flex-basket'>
          <div className='basket-elements'>
            {userData && userData.basket.length > 0 &&
              userData.basket.sort((a, b) => a.id - b.id).map((basket) => {
                return (
                  <div key={basket.id} className='profile-card basket-card'>
                    <div className="buffer">
                      <Link className='bootstrap-link'>
                        <div className="profile-card-image" style={{ backgroundImage: `url(${basket.product_added_to_basket.images.split(' ')[0]})` }}></div>
                      </Link>
                      <p className='profile-card-description'>{basket.product_added_to_basket.description}</p>
                      <p className='profile-card-price'>£ {basket.product_added_to_basket.price}</p>
                      <div className="flex-count">
                        <button className='like-button' onClick={() => handleBasketRemove(basket)}>-</button>
                        <p className='profile-card-price'>{basket.count}</p>
                        <button className='like-button' onClick={() => handleBasketAdd(basket)}>+</button>
                      </div>
                      <p className='profile-card-price'>Sub-total: £ {(basket.product_added_to_basket.price * basket.count).toFixed(2)}</p>
                      <button className='delete-button' onClick={() => removeProductFromBasket(basket)}>Remove</button>
                    </div>
                  </div>
                )
              })
            }</div>
          <div className='basket-checkout'>
            <h2>TOTAL</h2>
            <h2>
              TOTAL: £ {userData && userData.basket.length > 0 &&
                userData.basket.reduce((acc, obj) => {
                  return acc + parseInt(obj.count) * parseFloat(obj.product_added_to_basket.price)
                }, 0
                )
              }
            </h2>
            <button>Proceed to checkout</button>
          </div>
        </div>

      </>
    </main >
  )

}


export default Basket