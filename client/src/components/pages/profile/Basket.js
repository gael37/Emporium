import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, useRouteLoaderData } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'
import { Modal } from 'react-bootstrap'

const Basket = ({ setBasketCounter }) => {

  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState(null)
  const [productJustLiked, setProductJustLiked] = useState(false)

  const [deliveryAdress, setDeliveryAdress] = useState('')
  const [postcodeData, setPostcodeData] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [postcodeEntered, setPostcodeEntered] = useState('')


  const [show, setShow] = useState(false)

  // const [counter, setCounter] = useState(0)

  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub
  console.log('user id', currentUserId)
  const navigate = useNavigate()


  const getUserData = async () => {
    try {
      const { data } = await axios.get(`api/auth/${currentUserId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setUserData(data)
      const counter = data.basket.reduce((acc, obj) => {
        return acc + parseInt(obj.count)
      }, 0)
      console.log('user data, ', data)
      console.log('basket counter, ', counter)
      setBasketCounter(counter)
      setDeliveryAdress(data.postcode)
      setUserData(data)
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }


  useEffect(() => {
    const getPostcodeData = async () => {
      try {
        const { data } = await axios.get(`https://api.postcodes.io/postcodes/${userData.postcode}/`)
        console.log('postcode datra', data)
        setPostcodeData(data)
      } catch (err) {
        console.log(err)
        setPostcodeError(err)
      }
    }
    getPostcodeData()
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
    setProductJustLiked(productJustLiked ? false : true)
  }

  const proceedCheckout = async () => {

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
        navigate('/checkout')
      }
    }
    setProductJustLiked(productJustLiked ? false : true)
  }


  useEffect(() => {
    console.log('product just liked :', productJustLiked)
    getUserData()
  }, [productJustLiked])


  // --------------------------Change delivery adress-----------------------------

  const handleClose = () => {
    setShow(false)
    setDeliveryAdress(postcodeData.result.postcode)
  }

  const handleShow = async () => {
    setShow(true)
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${deliveryAdress}/`)
      setPostcodeEntered(data)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
      setPostcodeEntered(null)
    }
  }

  const handleChange = async (e) => {
    setDeliveryAdress(e.target.value)
    if (errors) setErrors('')
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${e.target.value}/`)
      setPostcodeEntered(data)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
      setPostcodeEntered(null)
    }
  }

  const onSubmit = async (e) => {
    setShow(false)
    e.preventDefault()
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${deliveryAdress}/`)
      console.log('postcode datra', data)
      setPostcodeData(data)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
    }
  }
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
                  <div key={basket.id} className='product-card basket-card'>
                    <div className="buffer">
                      <Link className='bootstrap-link'>
                        <div className="product-card-image" style={{ backgroundImage: `url(${basket.product_added_to_basket.images.split(' ')[0]})` }}></div>
                      </Link>
                      <p className='product-card-description'>{basket.product_added_to_basket.description}</p>
                      <p className='product-card-price'>£ {basket.product_added_to_basket.price}</p>
                      <div className="flex-count">
                        <button className='like-button' onClick={() => handleBasketRemove(basket)}>-</button>
                        <p className='product-card-price'>{basket.count}</p>
                        <button className='like-button' onClick={() => handleBasketAdd(basket)}>+</button>
                      </div>
                      <p className='product-card-price'>Sub-total: £ {(basket.product_added_to_basket.price * basket.count).toFixed(2)}</p>
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
                (userData.basket.reduce((acc, obj) => {
                  return acc + parseInt(obj.count) * parseFloat(obj.product_added_to_basket.price)
                }, 0
                )).toFixed(2)
              }
            </h2>
            {postcodeData &&
              <>
                <h6>Delivery adress:</h6>
                <h6>{userData.username}</h6>
                <h6>{postcodeData.result.postcode}</h6>
                <h6>{postcodeData.result.admin_district}, {postcodeData.result.country}</h6>
                <button onClick={handleShow}>Change delivery adress</button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Delivery adress</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <label htmlFor="name">Enter your delivery adress:</label>
                    <input
                      type="text"
                      name="adress"
                      onChange={handleChange}
                      value={deliveryAdress}
                      placeholder="Enter a valid postcode here"
                      required
                    />
                    {postcodeEntered ?
                      <>
                        <p>Postcode valid! ✅</p>
                        <button onClick={onSubmit}>Submit</button>
                      </>
                      :
                      <>
                        <p>BAD POSTCODE! 🙊</p>
                        <button onClick={handleClose}>Cancel</button>
                      </>
                    }
                  </Modal.Body>
                </Modal>
              </>
            }
            {/* <button onClick={checkout}>Proceed to checkout</button> */}
          </div>
        </div>



      </>
      <form className='flex-form-checkout' action='api/stripe/create-checkout-session' method='POST'>
        {userData && userData.basket.length > 0 &&
          <>
            {userData.basket.map((basket, index) => {
              return (
                <div key={basket.id}>
                  <div>
                    <label className='not-visible' htmlFor="name">{`item${index}`}</label>
                    <input className='not-visible' type="text" name={basket.product_added_to_basket.stripe_id} value={basket.count} />
                  </div>
                </div>
              )
            })}
            <button type='submit'>Proceed to checkout</button>
          </>
        }
      </form>
    </main >
  )

}


export default Basket