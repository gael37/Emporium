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


const SingleProduct = (userData, setUserData) => {

  // console.log('welcome to product SINGLE component')
  // const a = useParams().postcodeUser
  // console.log('a', a)




  // ! State
  const [product, setProduct] = useState(null)
  const [errors, setErrors] = useState(false)
  const [bigImage, setBigImage] = useState('')


  // const [userData, setUserData] = useState(null)


  // ! Location
  const { productId } = useParams()
  const navigate = useNavigate()

  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub


  const [userCoord, setUserCoord] = useState({
    userLatitude: '',
    userLongitude: '',
  })
  const [productOwnerCoord, setProductOwnerCoord] = useState({
    productOwnerLatitude: '',
    productOwnerLongitude: '',
    productOwnerDistrict: '',
  })

  // useEffect(() => {
  //   const getCoordinates = async () => {
  //     try {
  //       const { data } = await axios.get(`https://api.postcodes.io/postcodes/${a}/`)
  //       console.log('user coord', data)
  //       setUserCoord({
  //         userLatitude: data.result.latitude,
  //         userLongitude: data.result.longitude,
  //       })
  //       // userLatitude = data.result.latitude
  //       // userLongitude = data.result.longitude
  //       // console.log('lat and long', userLatitude, userLongitude)
  //     } catch (err) {
  //       console.log(err)
  //       setErrors(true)
  //     }
  //   }
  //   getCoordinates()
  // }, [])

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const { data } = await axios.get(`https://api.postcodes.io/postcodes/${product.owner.postcode}/`)
        console.log('user coord', data)
        setProductOwnerCoord({
          productOwnerLatitude: data.result.latitude,
          productOwnerLongitude: data.result.longitude,
          productOwnerDistrict: data.result.admin_district,
        })
        // productOwnerLatitude = data.result.latitude
        // productOwnerLongitude = data.result.longitude
        // console.log('lat, long of p owner', data.result.latitude, data.result.longitude)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getCoordinates()
  }, [product])

  // useEffect(() => {
  //   setBigImage(product.image.split(' ')[0])
  // }, [productOwnerCoord])



  // ! Execution


  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}/`)
        console.log('products on page render', data)
        setProduct(data)
        setBigImage(product.images.split(' ')[0])
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getProduct()
    // setBigImage('')
  }, [productId])

  useEffect(() => {
    console.log('big image', bigImage)
  }, [bigImage])



  // useEffect(() => {
  //   console.log('product', product)

  // }, [product])

  // const deleteProduct = async (e) => {
  //   try {
  //     await axios.delete(`api/products/${productId}/`, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     navigate('/products')
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  // const [messageField, setMessageField] = useState({
  //   text: '',
  // })

  // const handleChange = (e) => {
  //   const updatedReviewField = {
  //     ...messageField,
  //     [e.target.name]: e.target.value,
  //     commentOwner: userId,
  //     productOwner: product.owner.id,
  //   }
  //   setMessageField(updatedReviewField)
  //   if (errors) setErrors('')
  // }

  const payload = getPayload()
  const userId = payload.sub
  console.log('userId', userId)



  // const handleClick = async (e) => {
  //   console.log('product owner', product.owner.id)
  //   console.log('message field', messageField)
  //   try {
  //     const { data } = await axios.post('/api/comments/', { ...messageField }, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     setMessageField({
  //       text: 'Message sent!',
  //     })
  //     console.log('review SUCCESS ->', data)
  //   } catch (err) {
  //     console.log('review FAIL ->', err)
  //     setErrors(err.response.data)
  //   }
  // }

  const handleDelete = async (e) => {
    try {
      const { data } = await axios.delete(`/api/products/${productId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      // setMessageField({
      //   text: 'Ad deleted!',
      // })
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



  // useEffect(() => {
  //   const { image } = product
  //   // setBigImage(product.image.split(' ')[0])
  //   setBigImage(image.split(' ')[0])
  // }, [product])

  // useEffect(() => {
  //   console.log('bigImage', bigImage)
  // }, [bigImage])

  const swapImage = (image) => {
    setBigImage(image)
  }
  const getBigger = (e) => {
    e.target.className = 'profile-card-image bottom-images bigger'
  }
  const getSmaller = (e) => {
    e.target.className = 'profile-card-image bottom-images'
  }

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

              {/* {product.wished.some((wish) => {
                return wish.wish_owner.id === currentUserId
              }) ?
                <button className='like-button' onClick={() => handleDelete(product)}>❤️</button>
                :
                <button className='like-button' onClick={() => handleHeartClick(product)}>♡</button>
              }
              {product.added_to_basket.some((basket) => {
                return basket.basket_owner.id === currentUserId
              }) ?
                <div>
                  <button className='like-button' onClick={() => handleBasketRemove(product)}>-</button>
                  <button className='like-button' onClick={() => handleBasketAdd(product)}>+</button>
                  {product.added_to_basket.some((basket) => {
                    return basket.basket_owner.id === currentUserId
                  }) ?
                    <p>{product.added_to_basket[
                      product.added_to_basket.findIndex((basket) => {
                        return basket.basket_owner.id === currentUserId
                      })
                    ].count}</p>
                    :
                    <p>0</p>
                  }
                  <button className='like-button' onClick={() => removeAll(product)}>Remove from basket</button>
                </div>
                :
                <div>
                  <button className='like-button' onClick={() => handleBasketAdd(product)}>Add to basket</button>
                </div>
              } */}


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