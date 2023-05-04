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

// Bootstrap Components
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { calcDistance } from '../../../helpers/functions'

const SingleProduct = ({ setBasketCounter }) => {

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
  const [deliveryAdress, setDeliveryAdress] = useState('')
  const [postcodeData, setPostcodeData] = useState('')
  const [postcodeError, setPostcodeError] = useState('')

  const [show, setShow] = useState(false)




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
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  useEffect(() => {
    console.log('user data', userData)
  }, [productId])

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

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const { data } = await axios.get(`https://api.postcodes.io/postcodes/${userData.postcode}/`)
        console.log('postcode result', data)
        setCurrentPostcode(data.result.postcode)
        setCurrentTown(data.result.admin_district)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getCoordinates()
  }, [userData])


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

  // useEffect(() => {
  //   console.log('basket counter :', basketCounter)
  // }, [basketCounter])

  // useEffect(() => {
  //   console.log('user data :', userData)
  // }, [userData])

  useEffect(() => {
    console.log('product on page render', product)
    getUserData()
  }, [product])

  const goToBasket = () => {
    navigate('/basket')
  }

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
    <main className='single-page'>
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
                  <h2>
                    {product.comments.length > 0 ?
                      Math.floor(product.comments.reduce((acc, obj) => {
                        return acc + parseInt(obj.rating)
                      }, 0) / product.comments.length) === 1 &&
                      <div className="flex-reviews add-padding">
                        <img src={oneStar}></img>
                        <p>{product.comments.length}</p>
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
                        <p>{product.comments.length}</p>
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
                        <p>{product.comments.length}</p>
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
                        <p>{product.comments.length}</p>
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
                        <p>{product.comments.length}</p>
                      </div>
                      :
                      <div className='buffer-reviews'></div>
                    }
                  </h2>
                </div>

              </div>
              <p className='single-card-price'>£{product.price}</p>

              {(product.about) &&
                <>
                  <p className='single-card-about'><strong>About this item</strong></p>
                  {product.about.split('- ').slice(1).map((paragraph, index) => {
                    return (
                      <p className='single-card-about' key={index}>• {paragraph}.</p>
                    )
                  })}
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

          <section className='single-section-basket'>
            <div className="flex-single-price-like">
              <p className='single-card-price'>£{product.price}</p>
              <div className='single-like'>
                {product.wished.some((wish) => {
                  return wish.wish_owner.id === currentUserId
                }) ?
                  <button className='like-button single-like-button' onClick={() => handleHeartDelete()}><img src={heart} alt='like'></img></button>
                  :
                  <button className='like-button single-like-button' onClick={() => handleHeartClick()}><img src={emptyHeart} alt='like'></img></button>
                }
              </div>
            </div>

            <div className="single-deliver">
              {userData &&
                <p>Deliver to {userData.username}, {currentTown} <br></br>{currentPostcode}</p>
              }
            </div>
            <button className='button-adress' onClick={handleShow}>Change delivery adress</button>
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
              <button className='yellow-button' onClick={() => handleBasketAdd(product)}>Add to basket</button>
            }
            <button className='yellow-button' onClick={() => goToBasket()}>Go to basket</button>

          </section>
        </>
        :
        errors ? <h2>Something went wrong! Please try again later!</h2> : <h2>Loading</h2>
      }

    </main >
  )
}

export default SingleProduct