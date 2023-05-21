import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, useRouteLoaderData } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'
import { Modal } from 'react-bootstrap'

import validate from '../../../assets/images/validate.png'

const Basket = ({ basketCounter, setBasketCounter, postcode, setPostcode }) => {

  // ! State

  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState(null)
  const [productJustLiked, setProductJustLiked] = useState(false)
  const [postcodeData, setPostcodeData] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [postcodeEntered, setPostcodeEntered] = useState('')
  const [show, setShow] = useState(false)


  // ! Variables
  const currentUserId = getPayload().sub

  const navigate = useNavigate()

  // ------GET USER DATA FROM DATABASE ------

  const getUserData = async () => {
    console.log('user id', currentUserId)
    try {
      const { data } = await axios.get(`/api/auth/${currentUserId}/`, {
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
      if (postcode === '') {
        setPostcode(data.postcode)
      }
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  // ------GET POSTCODE DATA FROM PUBLIC API ------

  const getPostcodeData = async () => {
    console.log('postcode updated :', postcode)
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${postcode}/`)
      console.log('postcode datra', data)
      setPostcodeData(data)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
    }
  }


  // ------ADD AND REMOVE FROM BASKET ------

  const handleBasketAdd = async (basket) => {

    const currentCount = basket.count
    const basketPK = basket.id
    try {
      const newCount = parseInt(currentCount) + 1
      const { data } = await axios.put(`/api/basket/${basketPK}/`, { count: newCount, basket_owner: currentUserId, product_added_to_basket: basket.product_added_to_basket.id }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
    } catch (err) {
      console.log(err)
    }
    setProductJustLiked(productJustLiked ? false : true)
  }

  const handleBasketRemove = async (basket) => {
    const currentCount = basket.count
    const basketPK = basket.id
    if (currentCount !== '0') {
      try {
        const newCount = parseInt(currentCount) - 1
        const { data } = await axios.put(`/api/basket/${basketPK}/`, { count: newCount, basket_owner: currentUserId, product_added_to_basket: basket.product_added_to_basket.id }, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
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
    } catch (err) {
      console.log(err)
    }
    setProductJustLiked(productJustLiked ? false : true)
  }

  const removeAllBasket = async () => {

    for (let i = 0; i < userData.basket.length; i++) {
      if (userData.basket[i].basket_owner.id === currentUserId) {
        try {
          const { data } = await axios.delete(`/api/basket/${userData.basket[i].id}/`, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
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
      } catch (err) {
        console.log(err)
      }
    }

    for (let i = 0; i < userData.basket.length; i++) {
      if (userData.basket[i].basket_owner.id === currentUserId) {
        try {
          const { data } = await axios.delete(`/api/basket/${userData.basket[i].id}/`, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
        } catch (err) {
          console.log(err)
        }
        navigate('/checkout')
      }
    }
    setProductJustLiked(productJustLiked ? false : true)
  }

  // --------------------------Change delivery adress-----------------------------



  const handleClose = () => {
    setShow(false)
    setPostcode(postcodeData.result.postcode)
  }

  const handleShow = async () => {
    setShow(true)
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${postcode}/`)
      setPostcodeEntered(data)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
      setPostcodeEntered(null)
    }
  }

  const handleChange = async (e) => {
    if (errors) setErrors('')
    setPostcode(e.target.value)
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
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${postcodeEntered}/`)
      console.log('postcode datra', data)
      setPostcodeData(data)
      setPostcode(postcodeEntered)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
    }
  }



  // ! Effects


  useEffect(() => {
    console.log('product just liked :', productJustLiked)
    getUserData()
  }, [productJustLiked])

  useEffect(() => {
    getPostcodeData()
  }, [postcode])

  useEffect(() => {
    getUserData()
  }, [])

  const handleSelect = async (e, basket) => {

    const currentCount = basket.count
    const basketPK = basket.id
    try {
      const newCount = e.target.value
      const { data } = await axios.put(`/api/basket/${basketPK}/`, { count: newCount, basket_owner: currentUserId, product_added_to_basket: basket.product_added_to_basket.id }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
    } catch (err) {
      console.log(err)
    }
    setProductJustLiked(productJustLiked ? false : true)
  }

  const handleSaved = () => {
    navigate('/wish-list')
  }

  const handleShopping = () => {
    navigate('/')
  }
  // ! JSX


  return (

    <main className='basket-main'>

      <div className="flex-delete-basket">
        <h1>Shopping basket</h1>
        {userData && userData.basket.length > 0 &&
          <button className='button-adress' onClick={() => removeAllBasket()}>Delete basket</button>
        }
      </div>
      {userData && userData.basket.length > 0 ?
        <>
          <div className='flex-basket-page'>

            <section className="basket-section">
              {userData && userData.basket.length > 0 &&
                userData.basket.sort((a, b) => a.id - b.id).map((basket) => {
                  return (
                    <div key={basket.id} className='basket-card'>

                      <Link className='bootstrap-link'>
                        <div className="product-card-image basket-card-image" style={{ backgroundImage: `url(${basket.product_added_to_basket.images.split(' ')[0]})` }}></div>
                      </Link>
                      <div>
                        <p className='basket-card-description'>{basket.product_added_to_basket.description}</p>
                        <p className='product-card-price'>£ {basket.product_added_to_basket.price}</p>
                        <div className="flex-in-basket">
                          <div className="flex-add-remove-basket">
                            <select onChange={(e) => handleSelect(e, basket)} name="filter-style" className="select-nav select-small" value={basket.count}>
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                            </select>
                          </div>
                        </div>
                        <button className='button-adress' onClick={() => removeProductFromBasket(basket)}>Remove from basket</button>
                        <p className='basket-card-price'>Sub-total: £ {(basket.product_added_to_basket.price * basket.count).toFixed(2)}</p>
                      </div>


                    </div>
                  )
                })
              }
            </section>

            <section className='basket-checkout-section'>
              {userData &&
                <>
                  <h2>Order summary</h2>

                  <div className="flex-order-subtotal-basket-column">
                    <div className="flex-order-subtotal-basket">
                      <h4>Subtotal</h4>
                      <h4>${(userData.basket.reduce((acc, obj) => {
                        return acc + parseInt(obj.count) * parseFloat(obj.product_added_to_basket.price)
                      }, 0
                      )).toFixed(2)}</h4>
                    </div>

                    <div className="items-postage">
                      <p>{basketCounter} items: <span>£{userData && userData.basket.length > 0 &&
                        (userData.basket.reduce((acc, obj) => {
                          return acc + parseInt(obj.count) * parseFloat(obj.product_added_to_basket.price)
                        }, 0
                        )).toFixed(2)
                      }</span></p>
                      <p>Postage & packing: £4.99</p>
                    </div>
                  </div>
                  <div className="flex-order-total-basket">
                    <h4>Order Total</h4>
                    <h4>${((userData.basket.reduce((acc, obj) => {
                      return acc + parseInt(obj.count) * parseFloat(obj.product_added_to_basket.price)
                    }, 0
                    )) + 4.99).toFixed(2)}</h4>
                  </div>
                </>

              }



              <div className="single-deliver">
                <h4>Delivery adress</h4>
                <div className="single-deliver flex-deliver-basket">
                  {userData && postcodeData && postcode &&
                    <p>{userData.username}<br></br> {postcodeData.result.postcode} <br></br>{postcodeData.result.admin_district}, {postcodeData.result.country}</p>
                  }
                  <button className='button-adress' onClick={handleShow}>Change delivery adress</button>
                </div>
              </div>


              <Modal className='basket-modal' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Change your delivery adress </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="flex-modal-all">
                    <label htmlFor="name">Enter a UK postcode</label>
                    <div className='flex-modal-input-submit'>
                      <input
                        type="text"
                        name="adress"
                        onChange={handleChange}
                        value={postcode}
                        placeholder="Enter a valid postcode here"
                        required
                      />
                      {postcodeEntered ?
                        <button className='yellow-button button-submit-change-adress' onClick={onSubmit}>Submit</button>
                        :
                        <button className='regular-button button-submit-change-adress greyed-button'>Submit</button>
                      }
                    </div>
                    {postcodeEntered ?
                      <>
                        <div className="flex-validate">
                          <p className='modal-p-validate'>Valid postcode</p>
                          <img src={validate} alt='valid' />
                        </div>
                        {/* <button className='yellow-button button-submit-change-adress' onClick={onSubmit}>Submit</button> */}
                      </>
                      :
                      <>
                        <div className="flex-invalidate">
                          <p>Invalid postcode</p>
                          {/* <img src={validate} alt='valid' /> */}
                        </div>
                      </>
                    }
                    <button onClick={handleClose} className='regular-button'>Cancel</button>
                  </div>
                </Modal.Body>
              </Modal>

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
                    <button type='submit' className='yellow-button big-button'>Proceed to checkout</button>
                  </>
                }
              </form>

            </section>

          </div>
        </>
        :
        <div className='basket-empty'>
          <p>Your emporium cart is empty.</p>
          <p>Check your <button className='button-adress' onClick={handleSaved}>wishlist</button> items or <button className='button-adress' onClick={handleShopping}>continue shopping</button>.</p>
        </div>
      }

    </main >
  )

}


export default Basket