import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../helpers/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { isAuthenticated } from '../../helpers/auth'

import { getPayload } from '../../helpers/auth'
import { calcDistance } from '../../helpers/functions'

const Home = ({ selected, typed, basketCounter, setBasketCounter }) => {

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

  return (
    <main className="home-page-wrapper">
      {filteredProducts && filteredProducts.length > 0 &&
        <div className='product-row'>
          {filteredProducts.map(product => {
            return (
              <div key={product.id} className='product-card'>
                <div className="buffer">
                  <Link className='bootstrap-link' to={`/products/${product.id}`}>
                    <div className="buffer-image">
                      <div className="product-card-image" style={{ backgroundImage: `url(${product.images.split(' ')[0]})` }}></div>
                    </div>
                    <div className="buffer-description">
                      <h2 className='product-card-description'>{product.description}</h2>
                    </div>
                    <div className="buffer-reviews">
                      <h2>
                        {
                          Math.floor(product.comments.length && product.comments.reduce((acc, obj) => {
                            return acc + parseInt(obj.rating)
                          }, 0
                          ) / userData.comments.length) === 1 &&
                          `⭐️☆☆☆☆ (${product.comments.length})`
                        }
                        {
                          Math.floor(product.comments.length && product.comments.reduce((acc, obj) => {
                            return acc + parseInt(obj.rating)
                          }, 0
                          ) / userData.comments.length) === 2 &&
                          `⭐️⭐️☆☆☆ (${product.comments.length})`
                        }
                        {
                          Math.floor(product.comments.length && product.comments.reduce((acc, obj) => {
                            return acc + parseInt(obj.rating)
                          }, 0
                          ) / userData.comments.length) === 3 &&
                          `⭐️⭐️⭐️☆☆ (${product.comments.length})`
                        }
                        {
                          Math.floor(product.comments.length && product.comments.reduce((acc, obj) => {
                            return acc + parseInt(obj.rating)
                          }, 0
                          ) / userData.comments.length) === 4 &&
                          `⭐️⭐️⭐️⭐️☆ (${product.comments.length})`
                        }
                        {
                          Math.floor(product.comments.length && product.comments.reduce((acc, obj) => {
                            return acc + parseInt(obj.rating)
                          }, 0
                          ) / userData.comments.length) === 5 &&
                          `⭐️⭐️⭐️⭐️⭐️ (${product.comments.length})`
                        }
                      </h2>
                    </div>
                  </Link>
                  <h3 className='product-card-price'>£{product.price}</h3>
                  <h5 className='product-card-date'>Posted by <span>{product.owner.username}</span> on {product.created_at.toString().split('T').slice(0, 1).join()}</h5>
                  {product.wished.some((wish) => {
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
                      <button className='add-remove-button' onClick={() => handleBasketRemove(product)}>-</button>
                      <button className='add-remove-button' onClick={() => handleBasketAdd(product)}>+</button>
                      {product.added_to_basket.some((basket) => {
                        return basket.basket_owner.id === currentUserId
                      }) ?
                        <h6>{product.added_to_basket[
                          product.added_to_basket.findIndex((basket) => {
                            return basket.basket_owner.id === currentUserId
                          })
                        ].count}</h6>
                        :
                        <h6>0</h6>
                      }
                      <button className='remove-basket-button' onClick={() => removeAll(product)}>Remove from basket</button>
                    </div>
                    :
                    <div>
                      <button className='add-basket-button' onClick={() => handleBasketAdd(product)}>Add to basket</button>
                    </div>
                  }

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