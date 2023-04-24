import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom' // Importing useParams, we have access to any placeholders in the url
import axios from 'axios'
import { isOwner, getToken } from '../../../helpers/auth'
import { isAuthenticated } from '../../../helpers/auth'
import { getPayload } from '../../../helpers/auth'

// Bootstrap Components
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { calcDistance } from '../../../helpers/functions'

const SingleProduct = ({ basketCounter, setBasketCounter }) => {

  // ! State
  const [product, setProduct] = useState(null)
  const [userData, setUserData] = useState(null)
  const [errors, setErrors] = useState(false)
  const [bigImage, setBigImage] = useState('')
  const [wishesData, setWishesData] = useState([])
  const [basketData, setBasketData] = useState([])
  const [productJustLiked, setProductJustLiked] = useState(false)

  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub
  console.log('user id', currentUserId)

  // ! Location
  const { productId } = useParams()
  const navigate = useNavigate()

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`api/auth/${currentUserId}/`, {
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

  const getWishes = async () => {
    try {
      const { data } = await axios.get('api/wishes/', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setWishesData(data)
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  const getBasket = async () => {
    try {
      const { data } = await axios.get('api/basket/', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setBasketData(data)
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  const handleDelete = async (e) => {
    try {
      const { data } = await axios.delete(`/api/products/${productId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      navigate('/delete-product')
      console.log('delete SUCCESS ->', data)
    } catch (err) {
      console.log('review FAIL ->', err)
      setErrors(err.response.data)
    }
  }

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

  // useEffect(() => {
  //   const getCoordinates = async () => {
  //     try {
  //       const { data } = await axios.get(`https://api.postcodes.io/postcodes/${product.owner.postcode}/`)
  //       console.log('user coord', data)
  //       setProductOwnerCoord({
  //         productOwnerLatitude: data.result.latitude,
  //         productOwnerLongitude: data.result.longitude,
  //         productOwnerDistrict: data.result.admin_district,
  //       })
  //     } catch (err) {
  //       console.log(err)
  //       setErrors(true)
  //     }
  //   }
  //   getCoordinates()
  // }, [product])


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
    // console.log('product just liked :', productJustLiked)
    // // getWishes()
    // getBasket()
    getProduct()
    getUserData()
  }, [productId])

  useEffect(() => {
    // console.log('product just liked :', productJustLiked)
    // getWishes()
    // getBasket()
    getProduct()
    getUserData()
  }, [productJustLiked])

  useEffect(() => {
    getProduct()
    // console.log('wishes data :', wishesData)
  }, [wishesData])

  // useEffect(() => {
  //   getUserData()
  // }, [productId])

  // useEffect(() => {
  //   console.log('basket counter :', basketCounter)
  // }, [basketCounter])

  useEffect(() => {
    console.log('user data :', userData)
  }, [userData])

  useEffect(() => {
    console.log('product on page render', product)
  }, [product])

  return (
    <main className='single-page'>
      <Container className='mt-4'>
        <Row>
          {product ?
            <>
              <div className="single-buffer">
                <>
                  {bigImage ?
                    <div className="profile-card-image top-image" style={{ backgroundImage: `url(${bigImage})` }}></div>
                    :
                    <div className="profile-card-image top-image" style={{ backgroundImage: `url(${product.images.split(' ')[0]})` }}></div>

                  }
                  <div className='bottom-images-flex'>
                    <>
                      {(product.images.split(' ')).map((image, index) => {
                        return (
                          <div key={index} name={image} onMouseEnter={getBigger} onMouseLeave={getSmaller} onClick={() => swapImage(image)} className="profile-card-image bottom-images" style={{ backgroundImage: `url(${image})` }}></div>
                        )
                      })
                      }
                    </>
                  </div>
                </>

                <div className='single-div-description'>

                  <p className='single-card-description-full'>{product.description}</p>

                  {(product.dimensions) &&
                    <p className='single-card-description-full'><strong>•Dimensions:</strong> {product.dimensions}</p>
                  }
                  {(product.weight) &&
                    <p className='single-card-description-full'><strong>•Weight:</strong> {product.weight}</p>
                  }
                  {(product.about) &&
                    <p className='single-card-description-full'><strong>•About:</strong> {product.about}</p>
                  }
                  {(product.brand) &&
                    <p className='single-card-description-full'><strong>•Brand:</strong> {product.brand}</p>
                  }

                  {postedAd() ?
                    <>
                      <p className='single-card-price'>£{product.price}</p>
                      <p className='single-card-date'>Posted by <span>me!</span> on <span>{product.created_at.toString().split('T').slice(0, 1).join()}</span></p>


                    </>
                    :

                    <>
                      <p className='single-card-price'>£{product.price}</p>
                      <p className='single-card-date'>Posted by <span>{product.owner.username}</span> on <span>{product.created_at.toString().split('T').slice(0, 1).join()}</span></p>



                    </>
                  }
                  {product &&
                    <p>Categories: {product.categories[0].name}</p>
                  }
                </div>
              </div>
              <div>
                {product.wished.some((wish) => {
                  return wish.wish_owner.id === currentUserId
                }) ?
                  <button className='like-button' onClick={() => handleHeartDelete()}>❤️</button>
                  :
                  <button className='like-button' onClick={() => handleHeartClick()}>♡</button>
                }
              </div>

              {product.added_to_basket.some((basket) => {
                return basket.basket_owner.id === currentUserId
              }) ?
                <div>
                  <button className='like-button' onClick={() => handleBasketRemove()}>-</button>
                  <button className='like-button' onClick={() => handleBasketAdd()}>+</button>
                  <p>{product.added_to_basket[
                    product.added_to_basket.findIndex((basket) => {
                      return basket.basket_owner.id === currentUserId
                    })
                  ].count}</p>


                  <button className='like-button' onClick={() => removeAll()}>Remove from basket</button>
                </div>
                :
                <div>
                  <button className='like-button' onClick={() => handleBasketAdd()}>Add to basket</button>
                </div>
              }


            </>
            :
            errors ? <h2>Something went wrong! Please try again later!</h2> : <h2>Loading</h2>
          }
        </Row>
      </Container>

    </main >
  )
}

export default SingleProduct