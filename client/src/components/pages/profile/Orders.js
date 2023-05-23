import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'



import validate from '../../../assets/images/validate.png'

import fullStar from '../../../assets/images/full-star.png'
import emptyStar from '../../../assets/images/empty-star.png'


function Orders() {

  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState(null)
  const [formFields, setFormFields] = useState({
    reviewText: '',
    stars: '',
  })
  const [show, setShow] = useState(false)
  const [stars, setStars] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [orderToReview, setOrderToReview] = useState(null)


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
      console.log('user data, ', data)
      setUserData(data)
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  useEffect(() => {
    getUserData()
    setReviewSubmitted(false)
  }, [])


  const handleClose = () => {
    setShow(false)
    setFormFields({
      reviewText: '',
      stars: '',
    })
    setStars(0)
    setSubmitted(false)
    // setPostcode(postcodeData.result.postcode)
  }


  // ------------------------MODAL POST REVIEW-------------------------

  const handleShow = (order) => {
    setOrderToReview(order)
    setShow(true)
  }

  const clear = () => {
    setStars(0)
    setSubmitted(false)
  }
  const giveOneStar = () => {
    setStars(1)
    setSubmitted(true)
  }
  const giveTwoStars = () => {
    setStars(2)
    setSubmitted(true)
  }
  const giveThreeStars = () => {
    setStars(3)
    setSubmitted(true)
  }
  const giveFourStars = () => {
    setStars(4)
    setSubmitted(true)
  }
  const giveFiveStars = () => {
    setStars(5)
    setSubmitted(true)
  }

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '', message: '' })
  }

  const onSubmit = async (order) => {
    setShow(false)
    // e.preventDefault()
    setReviewSubmitted(true)
    try {
      const { data } = await axios.post('/api/comments/', { ...formFields, rating: stars, text: formFields.reviewText, comment_owner: currentUserId, product_reviewed: order.product_ordered.id }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('RESPONSE FROM REVIEW POST ', data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleShopping = () => {
    navigate('/')
  }

  const handleSaved = () => {
    navigate('/wish-list')
  }

  return (
    <main className="order-page-wrapper">


      {reviewSubmitted &&
        <div className="flex-validate">
          <img src={validate} alt='in basket'></img>
          <p><span>Review submitted - Thank you!</span></p>
        </div>
      }
      <h1>Your last orders</h1>
      {userData && userData.orders.length > 0 ?
        <>
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
                        <Link className='regular-button link-button button-fixed button-black' to={`/products/${order.product_ordered.id}`}>View your item</ Link>
                        <Link className='yellow-button link-button button-fixed button-black' to={`/reviews/${order.product_ordered.id}`}>Write a product review</ Link>
                        {/* <button className='yellow-button' onClick={() => handleShow(order)}>Write a product review</ button>
                        <Modal className='basket-modal' show={show} onHide={handleClose}>
                          <Modal.Header closeButton>
                            <Modal.Title className='modal-title'><strong>Create review</strong></Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="flex-modal-all-review">

                              <div className="flex-order-image">
                                <div className="order-card-image" style={{ backgroundImage: `url(${order.product_ordered.images.split(' ')[0]})` }}></div>
                                <div className='order-description-review'>
                                  <p className='order-card-description'><span>{order.product_ordered.description}</span></p>
                                </div>
                              </div>

                              <h5><strong>Overall rating</strong></h5>

                              <div className='rating-div'>
                                {
                                  stars === 0 ?
                                    <div className="flex-stars stars0">
                                      <button onClick={giveOneStar}><img src={emptyStar} alt='empty star'></img></button>
                                      <button onClick={giveTwoStars}><img src={emptyStar} alt='empty star'></img></button>
                                      <button onClick={giveThreeStars}><img src={emptyStar} alt='empty star'></img></button>
                                      <button onClick={giveFourStars}><img src={emptyStar} alt='empty star'></img></button>
                                      <button onClick={giveFiveStars}><img src={emptyStar} alt='empty star'></img></button>
                                    </div>

                                    :
                                    <></>
                                }
                                {
                                  stars === 1 ?
                                    <div className="flex-stars stars1">
                                      <button onClick={giveOneStar}><img src={fullStar} alt='full star'></img></button>
                                      <button onClick={giveTwoStars}><img src={emptyStar} alt='empty star'></img></button>
                                      <button onClick={giveThreeStars}><img src={emptyStar} alt='empty star'></img></button>
                                      <button onClick={giveFourStars}><img src={emptyStar} alt='empty star'></img></button>
                                      <button onClick={giveFiveStars}><img src={emptyStar} alt='empty star'></img></button>
                                    </div>
                                    :
                                    <></>
                                }
                                {stars === 2 ?
                                  <div className="flex-stars stars2">
                                    <button onClick={giveOneStar}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveTwoStars}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveThreeStars}><img src={emptyStar} alt='empty star'></img></button>
                                    <button onClick={giveFourStars}><img src={emptyStar} alt='empty star'></img></button>
                                    <button onClick={giveFiveStars}><img src={emptyStar} alt='empty star'></img></button>
                                  </div>
                                  :
                                  <></>
                                }
                                {stars === 3 ?
                                  <div className="flex-stars stars3">
                                    <button onClick={giveOneStar}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveTwoStars}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveThreeStars}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveFourStars}><img src={emptyStar} alt='empty star'></img></button>
                                    <button onClick={giveFiveStars}><img src={emptyStar} alt='empty star'></img></button>
                                  </div>
                                  :
                                  <></>
                                }
                                {stars === 4 ?
                                  <div className="flex-stars stars4">
                                    <button onClick={giveOneStar}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveTwoStars}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveThreeStars}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveFourStars}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveFiveStars}><img src={emptyStar} alt='empty star'></img></button>
                                  </div>
                                  :
                                  <></>
                                }
                                {stars === 5 ?
                                  <div className="flex-stars stars5">
                                    <button onClick={giveOneStar}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveTwoStars}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveThreeStars}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveFourStars}><img src={fullStar} alt='full star'></img></button>
                                    <button onClick={giveFiveStars}><img src={fullStar} alt='full star'></img></button>
                                  </div>
                                  :
                                  <></>
                                }
                                {!submitted &&
                                  <h6>Please add a rating</h6>
                                }
                                {submitted ?
                                  <div className="flex-submitted">
                                    <div className='flex-submitted-img'>
                                      <img src={validate} alt='success'></img>
                                      <p>Submitted</p>
                                    </div>
                                    <button onClick={clear} className='button-adress'>Clear</button>
                                  </div>
                                  :
                                  <></>
                                }
                              </div>

                              <h5><strong>Add a written review</strong></h5>

                              <textarea
                                rows="7"
                                cols="50"
                                type="text"
                                name="reviewText"
                                onChange={handleChange}
                                value={formFields.reviewText}
                                // placeholder="What did you like or dislike? What did you use the product for?"
                                required
                              />
                              {!formFields.reviewText &&
                                <h6>Please add a written review</h6>
                              }
                              <div className="flex-submit-cancel">
                                <button onClick={handleClose} className='regular-button button-fixed'>Cancel</button>
                                {formFields.reviewText && !submitted &&
                                  <button className='regular-button greyed-button button-fixed' onClick={onSubmit}>Submit</button>
                                }
                                {submitted && !formFields.reviewText &&
                                  <button className='regular-button greyed-button button-fixed' onClick={onSubmit}>Submit</button>
                                }
                                {submitted && formFields.reviewText &&
                                  <button className='yellow-button button-fixed' onClick={() => onSubmit(order)}>Submit</button>
                                }
                              </div>
                            </div>
                          </Modal.Body>
                        </Modal> */}
                      </div>
                    </div>
                    <div className="flex-order-buttons-below">
                      <Link className='regular-button link-button button-fixed button-black' to={`/products/${order.product_ordered.id}`}>View your item</ Link>
                      <Link className='yellow-button link-button button-fixed button-black' to={`/reviews/${order.product_ordered.id}`}>Write a product review</ Link>
                    </div>
                  </section>
                )
              })
              :
              <h2>Loading...</h2>
            }
          </div>
        </>

        :

        <div className='basket-empty'>
          <p>Your have no orders yet.</p>
          <p>Check your <button className='button-adress' onClick={handleSaved}>wishlist</button> items or <button className='button-adress' onClick={handleShopping}>continue shopping</button>.</p>
        </div>
      }
    </main>
  )

}

export default Orders