import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom' // Importing useParams, we have access to any placeholders in the url
import axios from 'axios'
import { isOwner, getToken } from '../../../helpers/auth'
import { isAuthenticated } from '../../../helpers/auth'
import { getPayload } from '../../../helpers/auth'
import { Modal } from 'react-bootstrap'


import emptyHeart from '../../../assets/images/empty-heart.png'
import heart from '../../../assets/images/heart.png'
import oneStar from '../../../assets/images/one-star.png'
import twoStars from '../../../assets/images/two-stars.png'
import threeStars from '../../../assets/images/three-stars.png'
import fourStars from '../../../assets/images/four-stars.png'
import fiveStars from '../../../assets/images/five-stars.png'
import validate from '../../../assets/images/validate.png'
import info from '../../../assets/images/info-icon.png'
import pageLoadingGif from '../../../assets/gifs/page-loading-gif.gif'



// Bootstrap Components
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { calcDistance } from '../../../helpers/functions'

const SingleProduct = ({ setBasketCounter, postcode, setPostcode }) => {

  // ! State
  const [product, setProduct] = useState(null)
  const [userData, setUserData] = useState(null)
  const [errors, setErrors] = useState(false)
  const [bigImage, setBigImage] = useState('')
  const [wishesData, setWishesData] = useState([])
  const [basketData, setBasketData] = useState([])
  const [productJustLiked, setProductJustLiked] = useState(false)
  const [currentPostcode, setCurrentPostcode] = useState('')
  const [currentTown, setCurrentTown] = useState('')

  const [postcodeEntered, setPostcodeEntered] = useState('')
  const [postcodeData, setPostcodeData] = useState('')
  const [postcodeError, setPostcodeError] = useState('')

  const [show, setShow] = useState(false)
  const [classWishlistMessage, setClassWishlistMessage] = useState('wish-message-not-visible')




  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub
  console.log('user id', currentUserId)

  // ! Location
  const { productId } = useParams()
  const navigate = useNavigate()

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`/api/auth/${currentUserId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      const counter = data.basket.reduce((acc, obj) => {
        return acc + parseInt(obj.count)
      }, 0)

      console.log('basket counter, ', counter)
      setBasketCounter(counter)
      setUserData(data)
      if (postcode === '') {
        setPostcode(data.postcode)
      }
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }



  let wishPK = ''

  const [userCoord, setUserCoord] = useState({
    userLatitude: '',
    userLongitude: '',
  })
  const [productOwnerCoord, setProductOwnerCoord] = useState({
    productOwnerLatitude: '',
    productOwnerLongitude: '',
    productOwnerDistrict: '',
  })



  // ! Execution

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${productId}/`)
      setProduct(data)
      setBigImage(product.images.split(' ')[0])
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  // const getWishes = async () => {
  //   try {
  //     const { data } = await axios.get('api/wishes/', {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     setWishesData(data)
  //   } catch (err) {
  //     console.log(err)
  //     setErrors(true)
  //   }
  // }

  // const getBasket = async () => {
  //   try {
  //     const { data } = await axios.get('api/basket/', {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     setBasketData(data)
  //   } catch (err) {
  //     console.log(err)
  //     setErrors(true)
  //   }
  // }

  // const handleDelete = async (e) => {
  //   try {
  //     const { data } = await axios.delete(`/api/products/${productId}/`, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     navigate('/delete-product')
  //     console.log('delete SUCCESS ->', data)
  //   } catch (err) {
  //     console.log('review FAIL ->', err)
  //     setErrors(err.response.data)
  //   }
  // }

  const postedAd = () => {
    if (product.owner.id === currentUserId) {
      return true
    } else {
      return false
    }
  }


  const swapImage = (image) => {
    setBigImage(image)
  }
  const getBigger = (e) => {
    e.target.className = 'profile-card-image bottom-images bigger'
  }
  const getSmaller = (e) => {
    e.target.className = 'profile-card-image bottom-images'
  }


  // useEffect(() => {
  //   getProduct()
  //   // getUserData()
  // }, [productId])

  // useEffect(() => {
  //   console.log('wishes data :', wishesData)
  // }, [wishesData])

  // useEffect(() => {
  //   console.log('product just liked :', productJustLiked)
  //   getWishes()
  //   getBasket()
  // }, [productJustLiked])

  // useEffect(() => {
  //   getWishes()
  // }, [product])

  const getPostcodeData = async () => {
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${postcode}/`)
      console.log('postcode datra', data)
      setPostcodeData(data)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
    }
  }



  // useEffect(() => {
  //   console.log('product just liked :', productJustLiked)
  //   // getWishes()
  //   // getBasket()
  // }, [productJustLiked])

  // useEffect(() => {
  //   getProduct()
  //   console.log('wishes data :', wishesData)
  // }, [wishesData])





  // -----------------------------------WISHES-------------------------------------


  const handleHeartClick = async () => {
    setProductJustLiked(productJustLiked ? false : true)
    try {
      const { data } = await axios.post('/api/wishes/', { wish_owner: currentUserId, product_wished: product.id }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setClassWishlistMessage('wish-message-visible')
      // console.log('RESPONSE FROM WISH POST ', data)
      // console.log('after post wish :', wishesData)
    } catch (err) {
      console.log(err)
    }
    setProductJustLiked(productJustLiked ? false : true)
  }


  // const handleHeartDelete = async () => {
  //   setProductJustLiked(productJustLiked ? false : true)
  //   for (let i = 0; i < wishesData.length; i++) {
  //     if (wishesData[i].product_wished.id === productId && wishesData[i].wish_owner.id === currentUserId) {
  //       wishPK = wishesData[i].id
  //       console.log('wish PK ', wishPK)
  //     } else {
  //       console.log('no wish found')
  //     }
  //   }
  //   try {
  //     const { data } = await axios.delete(`/api/wishes/${wishPK}/`, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     console.log('RESPONSE FROM DELETE ', data)
  //   } catch (err) {
  //     console.log(err)
  //   }
  //   setProductJustLiked(productJustLiked ? false : true)
  //   getProduct()
  // }

  const handleHeartDelete = async () => {
    for (let i = 0; i < product.wished.length; i++) {
      if (product.wished[i].wish_owner.id === currentUserId) {
        wishPK = product.wished[i].id
        console.log('wish PK ', wishPK)
      } else {
        console.log('no wish found')
      }
    }
    try {
      const { data } = await axios.delete(`/api/wishes/${wishPK}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('RESPONSE FROM DELETE ', data)
    } catch (err) {
      console.log(err)
    }
    setProductJustLiked(productJustLiked ? false : true)
    getProduct()
  }


  // -------BASKET--------        

  const handleBasketAdd = async () => {
    let basketIndex
    let currentCount
    let alreadyAddedToBasket = false
    let basketPK
    for (let i = 0; i < product.added_to_basket.length; i++) {
      if (product.added_to_basket[i].basket_owner.id === currentUserId) {
        basketIndex = i
        currentCount = product.added_to_basket[i].count
        alreadyAddedToBasket = true
        basketPK = product.added_to_basket[i].id
        console.log('already added_to_basket :', alreadyAddedToBasket)
        console.log('basketPK :', basketPK)
        console.log('current count :', currentCount)
      }
    }
    if (alreadyAddedToBasket === false) {
      // setAddedToBasket(true)
      try {
        const { data } = await axios.post('/api/basket/', { count: '1', basket_owner: currentUserId, product_added_to_basket: product.id }, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        console.log('RESPONSE FROM BASKET POST ', data)
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        const newCount = parseInt(currentCount) + 1
        const { data } = await axios.put(`/api/basket/${basketPK}/`, { count: newCount, basket_owner: currentUserId, product_added_to_basket: product.id }, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        console.log('RESPONSE FROM BASKET PUT ', data)
      } catch (err) {
        console.log(err)
      }
    }
    setProductJustLiked(productJustLiked ? false : true)
  }

  const handleBasketRemove = async () => {
    let basketIndex
    let currentCount
    let alreadyAddedToBasket = false
    let basketPK
    for (let i = 0; i < product.added_to_basket.length; i++) {
      if (product.added_to_basket[i].basket_owner.id === currentUserId) {
        basketIndex = i
        currentCount = product.added_to_basket[i].count
        alreadyAddedToBasket = true
        basketPK = product.added_to_basket[i].id
        console.log('already added_to_basket :', alreadyAddedToBasket)
        console.log('basketPK :', basketPK)
        console.log('current count :', currentCount)
      }
      // for (let i = 0; i < basketData.length; i++) {
      //   if (basketData[i].product_added_to_basket === product.id && basketData[i].basket_owner.id === currentUserId) {
      //     basketPK = basketData[i].id
      //     console.log('basket PK ', basketPK)
      //   } else {
      //     console.log('no basket found')
      //   }
      // }
      if (alreadyAddedToBasket === true && currentCount === '1') {
        // setAddedToBasket(false)
        try {
          const { data } = await axios.delete(`/api/basket/${basketPK}/`, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          console.log('RESPONSE FROM DELETE BASKET ', data)
        } catch (err) {
          console.log(err)
        }
      } else if (alreadyAddedToBasket === true && currentCount !== '1') {
        try {
          const newCount = parseInt(currentCount) - 1
          const { data } = await axios.put(`/api/basket/${basketPK}/`, { count: newCount, basket_owner: currentUserId, product_added_to_basket: product.id }, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          console.log('RESPONSE FROM BASKET PUT ', data)
        } catch (err) {
          console.log(err)
        }
      }
    }
    setProductJustLiked(productJustLiked ? false : true)
    getProduct()
  }

  const removeAll = async () => {
    let basketPK
    for (let i = 0; i < product.added_to_basket.length; i++) {
      if (product.added_to_basket[i].basket_owner.id === currentUserId) {
        basketPK = product.added_to_basket[i].id
        console.log('basketPK :', basketPK)
      }
      // setAddedToBasket(false)
      try {
        const { data } = await axios.delete(`/api/basket/${basketPK}/`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        console.log('RESPONSE FROM DELETE BASKET ', data)
      } catch (err) {
        console.log(err)
      }
    }
    setProductJustLiked(productJustLiked ? false : true)
  }

  useEffect(() => {
    getProduct()
    console.log('basket data :', basketData)
  }, [basketData])



  useEffect(() => {
    console.log('product just liked :', productJustLiked)
    getProduct()
    getUserData()
  }, [productId])


  useEffect(() => {
    console.log('product just liked :', productJustLiked)
    getProduct()
    getUserData()
  }, [productJustLiked])

  useEffect(() => {
    getProduct()
    console.log('wishes data :', wishesData)
  }, [wishesData])

  useEffect(() => {
    getUserData()
  }, [productId])

  useEffect(() => {
    getPostcodeData()
  }, [userData])

  useEffect(() => {
    console.log('product on page render', product)
    getUserData()
  }, [product])

  useEffect(() => {
    getPostcodeData()
  }, [postcode])

  const goToBasket = () => {
    navigate('/basket')
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
    // setPostcode(e.target.value)
    e.preventDefault()
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${e.target.value}/`)
      console.log('postcode datra', data)
      setPostcodeData(data)
      setPostcode(postcodeEntered)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
    }
  }


  const goLogin = () => {
    navigate('/login')
  }

  useEffect(() => {
    if (classWishlistMessage === 'wish-message-visible') {
      setTimeout(() => {
        setClassWishlistMessage('wish-message-not-visible')
      }, 1000)
    }
  }, [classWishlistMessage])

  return (

    <main className='single-page-wrapper'>
      {product ?
        <>
          <div className='single-page'>
            {product ?
              <>
                <section className='single-section-images'>
                  {bigImage ?
                    <div className="profile-card-image top-image" style={{ backgroundImage: `url(${bigImage})` }}></div>
                    // <img src={bigImage} className="profile-card-image top-image"></img>

                    :
                    <div className="profile-card-image top-image" style={{ backgroundImage: `url(${product.images.split(' ')[0]})` }}></div>
                    // <img src={product.images.split(' ')[0]} className="profile-card-image top-image"></img>

                  }
                  <div className='bottom-images-flex'>

                    {(product.images.split(' ')).map((image, index) => {
                      return (
                        <div key={index} name={image} onMouseEnter={getBigger} onMouseLeave={getSmaller} onClick={() => swapImage(image)} className="profile-card-image bottom-images" style={{ backgroundImage: `url(${image})` }}></div>
                      )
                    })
                    }

                  </div>
                </section>
                <section className='single-description'>
                  <div className='single-div-description'>

                    <p className='single-card-description-full'>{product.description}</p>
                    <div className='flex-single-reviews'>
                      <div className="buffer-reviews">
                        <a href='#reviews' className='a-link'>
                          {product.comments.length > 0 ?
                            Math.floor(product.comments.reduce((acc, obj) => {
                              return acc + parseInt(obj.rating)
                            }, 0) / product.comments.length) === 1 &&
                            <div className="flex-reviews add-padding">
                              <img src={oneStar}></img>
                              <p>{product.comments.length} ratings</p>
                            </div>
                            :
                            <div className='buffer-reviews'></div>
                          }


                          {product.comments.length > 0 ?
                            Math.floor(product.comments.reduce((acc, obj) => {
                              return acc + parseInt(obj.rating)
                            }, 0
                            ) / product.comments.length) === 2 &&
                            <div className="flex-reviews add-padding">
                              <img src={twoStars}></img>
                              <p>{product.comments.length} ratings</p>
                            </div>
                            : <div className='buffer-reviews'><></></div>
                          }

                          {product.comments.length > 0 ?
                            Math.floor(product.comments.reduce((acc, obj) => {
                              return acc + parseInt(obj.rating)
                            }, 0
                            ) / product.comments.length) === 3 &&
                            <div className="flex-reviews add-padding">
                              <img src={threeStars}></img>
                              <p>{product.comments.length} ratings</p>
                            </div>
                            : <div className='buffer-reviews'></div>
                          }

                          {product.comments.length > 0 ?
                            Math.floor(product.comments.reduce((acc, obj) => {
                              return acc + parseInt(obj.rating)
                            }, 0
                            ) / product.comments.length) === 4 &&
                            <div className="flex-reviews">
                              <img src={fourStars}></img>
                              <p>{product.comments.length} ratings</p>
                            </div>
                            : <div className='buffer-reviews'></div>
                          }

                          {product.comments.length > 0 ?
                            Math.floor(product.comments.reduce((acc, obj) => {
                              return acc + parseInt(obj.rating)
                            }, 0
                            ) / product.comments.length) === 5 &&
                            <div className="flex-reviews add-padding">
                              <img src={fiveStars}></img>
                              <p>{product.comments.length} ratings</p>
                            </div>
                            :
                            <div className='buffer-reviews'></div>
                          }
                        </a>
                      </div>

                    </div>
                    <p className='single-card-price'>£{product.price}</p>

                    {(product.about) &&
                      <>
                        <p className='about-title'><strong>About this item</strong></p>
                        <div>
                          <p className='single-card-about'><pre>{product.about}</pre></p>

                        </div>
                        {/* {product.about.split('- ').slice(1).map((paragraph, index) => {
                    return (
                      <p className='single-card-about' key={index}>• {paragraph}.</p>
                    )
                  })} */}
                      </>
                    }
                    {(product.dimensions) &&
                      <p className='single-card-info'><span>Dimensions</span> {product.dimensions}</p>
                    }
                    {(product.weight) &&
                      <p className='single-card-info'><span>Weight</span> {product.weight}</p>
                    }
                    {postedAd() ?
                      <p className='single-card-info'><span>Seller</span> me!</p>
                      :
                      <p className='single-card-info'><span>Seller</span> {product.owner.username}</p>
                    }
                  </div>
                </section>



                <section className='single-section-basket visibility1'>
                  <div className="flex-single-price-like">
                    <p className='single-card-price'>£{product.price}</p>
                    <h6 className={classWishlistMessage}>Added to wishlist!</h6>
                    <div className='single-like'>
                      {product.wished.some((wish) => {
                        return wish.wish_owner.id === currentUserId
                      }) ?
                        <>
                          <button className='like-button single-like-button' onClick={() => handleHeartDelete()}><img src={heart} alt='like'></img></button>
                        </>
                        :
                        <button className='like-button single-like-button' onClick={() => handleHeartClick()}><img src={emptyHeart} alt='like'></img></button>
                      }
                    </div>
                  </div>
                  <div className="single-deliver">
                    <h6>Deliver to</h6>
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
                              <p className='modal-p-validate'><span>Postcode valid!</span></p>
                              <img src={validate} alt='valid' />
                            </div>
                            {/* <button className='yellow-button button-submit-change-adress' onClick={onSubmit}>Submit</button> */}
                          </>
                          :
                          <>
                            <div className="flex-validate">
                              <p className='modal-p-invalidate'>Invalid postcode</p>
                              {/* <img src={validate} alt='valid' /> */}
                            </div>
                          </>
                        }
                        <button onClick={handleClose} className='regular-button'>Cancel</button>
                      </div>
                    </Modal.Body>
                  </Modal>
                  {!userData &&
                    <div className='no-user'>
                      <p className='yellow-button p-button'>Add to basket</p>
                      <div className="flex-validate flex-info-no-user single-info-no-user">
                        <img src={info} alt='in basket'></img>
                        <h6>Please <button className='button-adress' onClick={goLogin}>sign in</button> to add to basket or to add to wishlist</h6>
                      </div>
                    </div>
                  }
                  {product.added_to_basket.some((basket) => {
                    return basket.basket_owner.id === currentUserId
                  }) ?
                    <>
                      <div className="flex-in-basket">
                        <div className="flex-validate">
                          <p><span>In basket</span></p>
                          <img src={validate} alt='in basket'></img>
                        </div>
                        <div className='flex-add-remove-basket'>
                          <button className='add-remove-button' onClick={() => handleBasketRemove(product)}><p className='button-minus'>-</p></button>
                          <p>{product.added_to_basket[
                            product.added_to_basket.findIndex((basket) => {
                              return basket.basket_owner.id === currentUserId
                            })
                          ].count}</p>
                          <button className='add-remove-button' onClick={() => handleBasketAdd(product)}><p className='button-plus'>+</p></button>
                        </div>
                      </div>
                      <button className='yellow-button' onClick={() => removeAll(product)}>Remove from basket</button>
                    </>
                    :
                    <>
                      {/* <div className='flex-in-basket'>
                    </div> */}
                      {userData && parseInt(product.created_at[6]) > 5 &&
                        <>
                          <div className="flex-validate flex-info-no-user">
                            <img src={info} alt='in basket'></img>
                            <h6>Product available soon</h6>
                          </div>
                        </>
                      }
                      {userData && parseInt(product.created_at[6]) === 5 && parseInt(product.created_at.slice(8, 10)) > 21 &&
                        <>
                          <div className="flex-validate flex-info-no-user no-avail-info">
                            <img src={info} alt='in basket'></img>
                            <h6>Product available soon</h6>
                          </div>
                        </>
                      }
                      {userData && parseInt(product.created_at[6]) < 6 && parseInt(product.created_at.slice(8, 10)) < 22 &&
                        <button className='yellow-button' onClick={() => handleBasketAdd(product)}>Add to basket</button>
                      }
                    </>
                  }
                  {userData &&
                    <button className='yellow-button' onClick={() => goToBasket()}>Go to basket</button>
                  }
                </section>


              </>
              :
              errors ? <h2>Something went wrong! Please try again later!</h2> : <h2>Loading</h2>
            }
          </div>


          <section className='reviews-section'>
            <h2 id='reviews'>Reviews</h2>
            {product &&
              product.comments.map((comment) => {
                return (
                  <div key={comment.id} className='order-card-review'>

                    <div className='flex-horizontally-p'>
                      <p><span>Reviewed by <strong>{comment.comment_owner.username}</strong> on</span></p>
                      <div><strong>
                        {comment.created_at.toString().slice(5, 7) === '01' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} January {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '02' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} February {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '03' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} March {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '04' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} April {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '05' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} May {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '06' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} June {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '07' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} July {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '08' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} August {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '09' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} September {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '10' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} October {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '11' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} November {comment.created_at.toString().slice(0, 4)}</p>
                        }
                        {comment.created_at.toString().slice(5, 7) === '12' &&
                          <p className="order-card-date">{comment.created_at.toString().slice(8, 10)} December {comment.created_at.toString().slice(0, 4)}</p>
                        }
                      </strong>
                      </div>

                    </div>


                    {/* {Math.floor(product.comments.reduce((acc, obj) => {
                    return acc + parseInt(obj.rating)
                  }, 0) / product.comments.length) === 1 &&
                    <h6 className="flex-reviews">
                      <img src={oneStar}></img>
                    </h6>
                  } */}
                    {comment.rating === '1' &&
                      <h6 className="flex-reviews">
                        <img src={oneStar}></img>
                      </h6>
                    }
                    {/* {Math.floor(product.comments.reduce((acc, obj) => {
                    return acc + parseInt(obj.rating)
                  }, 0) / product.comments.length) === 2 &&
                    <h6 className="flex-reviews">
                      <img src={twoStars}></img>
                    </h6>
                  } */}
                    {comment.rating === '2' &&
                      <h6 className="flex-reviews">
                        <img src={twoStars}></img>
                      </h6>
                    }
                    {/* {Math.floor(product.comments.reduce((acc, obj) => {
                    return acc + parseInt(obj.rating)
                  }, 0) / product.comments.length) === 3 &&
                    <h6 className="flex-reviews">
                      <img src={threeStars}></img>
                    </h6>
                  } */}
                    {comment.rating === '3' &&
                      <h6 className="flex-reviews">
                        <img src={threeStars}></img>
                      </h6>
                    }
                    {/* {Math.floor(product.comments.reduce((acc, obj) => {
                    return acc + parseInt(obj.rating)
                  }, 0) / product.comments.length) === 4 &&
                    <h6 className="flex-reviews">
                      <img src={fourStars}></img>
                    </h6>
                  } */}
                    {comment.rating === '4' &&
                      <h6 className="flex-reviews">
                        <img src={fourStars}></img>
                      </h6>
                    }
                    {/* {Math.floor(product.comments.reduce((acc, obj) => {
                    return acc + parseInt(obj.rating)
                  }, 0) / product.comments.length) === 5 &&
                    <h6 className="flex-reviews">
                      <img src={fiveStars}></img>
                    </h6>
                  } */}
                    {comment.rating === '5' &&
                      <h6 className="flex-reviews">
                        <img src={fiveStars}></img>
                      </h6>
                    }
                    <h6> {comment.text}</h6>
                  </div>
                )
              })}
            {product && product.comments.length === 0 &&
              <p>This item has not been reviewed yet.</p>}
          </section>
        </>
        :
        <div className='loading-pages-gif'>
          <img src={pageLoadingGif} alt='loading' />
          <p>Loading</p>
        </div>
      }
    </main >
  )
}

export default SingleProduct