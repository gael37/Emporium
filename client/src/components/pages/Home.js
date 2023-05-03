import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getToken } from '../../helpers/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { isAuthenticated } from '../../helpers/auth'

import { getPayload } from '../../helpers/auth'
import { calcDistance } from '../../helpers/functions'

import emptyHeart from '../../assets/images/empty-heart.png'
import heart from '../../assets/images/heart.png'
import oneStar from '../../assets/images/one-star.png'
import twoStars from '../../assets/images/two-stars.png'
import threeStars from '../../assets/images/three-stars.png'
import fourStars from '../../assets/images/four-stars.png'
import fiveStars from '../../assets/images/five-stars.png'
import validate from '../../assets/images/validate.png'

const Home = ({ selected, typed, setSelected, setTyped, basketCounter, setBasketCounter, setUsername }) => {

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [userData, setUserData] = useState(null)
  const [errors, setErrors] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [typedProducts, setTypedProducts] = useState([])
  const [typedAndSelectedProducts, setTypedAndSelectedProducts] = useState([])
  const [wishesData, setWishesData] = useState([])
  const [basketData, setBasketData] = useState([])
  const [productJustLiked, setProductJustLiked] = useState(false)
  // const [addedToBasket, setAddedToBasket] = useState(false)

  let wishPK = ''
  // let basketPK = ''

  const navigate = useNavigate()

  // get user id
  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub
  console.log('user id', currentUserId)

  // get all products
  const getProducts = async () => {
    try {
      const { data } = await axios.get('/api/products/')
      console.log('products at page render', data)
      setProducts(data)
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  // get user data
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
      setUsername(data.username)
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

  // On page load, get user data and all the products
  useEffect(() => {
    setSelected('All')
    setTyped('')
    getProducts()
    getUserData()
    getWishes()
  }, [])


  // SELECTED

  useEffect(() => {
    const selection = products.filter(product => {
      if (product.categories.includes(selected)) {
        return product
      } else if (selected === 'All') {
        return product
      }
    })
    setSelectedProducts(selection)
  }, [products])


  // SEARCHED

  useEffect(() => {
    const regex = new RegExp(typed, 'i')
    setTypedAndSelectedProducts(selectedProducts.filter(product => {
      return regex.test(product.description)
    }))
  }, [selectedProducts])

  useEffect(() => {
    setFilteredProducts(typedAndSelectedProducts)
  }, [typedAndSelectedProducts])

  useEffect(() => {
    const selection = products.filter(product => {
      for (let i = 0; i < product.categories.length; i++) {
        if (product.categories[i].name === selected) {
          return product
        } else if (selected === 'All') {
          return product
        }
      }

    })
    setSelectedProducts(selection)
  }, [selected])

  useEffect(() => {
    const regex = new RegExp(typed, 'i')
    setTypedAndSelectedProducts(selectedProducts.filter(product => {
      return regex.test(product.description)
    }))
  }, [typed])


  // --------WISHES---------




  const handleHeartClick = async (product) => {
    try {
      const { data } = await axios.post('/api/wishes/', { wish_owner: currentUserId, product_wished: product.id }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('RESPONSE FROM WISH POST ', data)
    } catch (err) {
      console.log(err)
    }
    setProductJustLiked(productJustLiked ? false : true)
  }


  const handleDelete = async (product) => {
    for (let i = 0; i < wishesData.length; i++) {
      if (wishesData[i].product_wished.id === product.id && wishesData[i].wish_owner.id === currentUserId) {
        wishPK = wishesData[i].id
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
    getProducts()
  }

  useEffect(() => {
    console.log('product just liked :', productJustLiked)
    getWishes()
    getBasket()
    getUserData()
  }, [productJustLiked])

  useEffect(() => {
    getProducts()
    console.log('wishes data :', wishesData)
  }, [wishesData])


  // -------BASKET--------        

  const handleBasketAdd = async (product) => {
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

  const handleBasketRemove = async (product) => {
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
    getProducts()
  }

  const removeAll = async (product) => {
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
    getProducts()
    console.log('basket data :', basketData)
  }, [basketData])

  const goToBasket = () => {
    navigate('/basket')
  }
  return (
    <main className="home-page-wrapper">
      {filteredProducts && filteredProducts.length > 0 &&
        <div className='product-row'>
          {filteredProducts.map(product => {
            return (
              <div key={product.id} className='product-card'>
                <div className="buffer">
                  <Link className='bootstrap-link' to={`/products/${product.id}`}>
                    <div className="card-link">

                      <div className="product-card-image" style={{ backgroundImage: `url(${product.images.split(' ')[0]})` }}></div>

                    </div>
                  </Link>
                  <div className="flex-price-like">
                    <h3 className='product-card-price'>£{product.price}</h3>
                    {product.wished.some((wish) => {
                      return wish.wish_owner.id === currentUserId
                    }) ?
                      <button className='like-button like-button-bigger' onClick={() => handleDelete(product)}><img src={heart} alt='like'></img></button>
                      :
                      <button className='like-button' onClick={() => handleHeartClick(product)}><img src={emptyHeart} alt='like'></img></button>
                    }
                  </div>
                  <Link className='bootstrap-link' to={`/products/${product.id}`}>
                    <div className="buffer-description">
                      <h2 className='product-card-description'>{product.description}</h2>
                    </div>
                  </Link>
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
                      <div className='flex-in-basket'>
                      </div>
                      <button className='yellow-button' onClick={() => handleBasketAdd(product)}>Add to basket</button>
                    </>
                  }
                  <button className='yellow-button' onClick={() => goToBasket()}>Go to basket</button>
                </div>
              </div>
            )
          })
          }
        </div>
      }
    </main >

  )
}

export default Home