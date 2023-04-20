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

const Home = ({ selected, typed }) => {

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [errors, setErrors] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [typedProducts, setTypedProducts] = useState([])
  const [typedAndSelectedProducts, setTypedAndSelectedProducts] = useState([])
  const [userData, setUserData] = useState(null)
  const [wishesData, setWishesData] = useState([])
  const [ordersData, setOrdersData] = useState([])
  const [productJustLiked, setProductJustLiked] = useState(false)

  let wishPK = ''
  // let orderPK = ''

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

  const getOrders = async () => {
    try {
      const { data } = await axios.get('api/orders/', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setOrdersData(data)
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
      const { data } = await axios.post('/api/wishes/', { wishOwner: currentUserId, productWished: product.id }, {
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
      if (wishesData[i].productWished === product.id && wishesData[i].wishOwner.id === currentUserId) {
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
    getOrders()
  }, [productJustLiked])

  useEffect(() => {
    getProducts()
    console.log('wishes data :', wishesData)
  }, [wishesData])


  // -------ORDERS--------        

  const handleOrderAdd = async (product) => {
    let orderIndex
    let currentCount
    let alreadyOrdered = false
    let orderPK
    for (let i = 0; i < product.ordered.length; i++) {
      if (product.ordered[i].orderOwner.id === currentUserId) {
        orderIndex = i
        currentCount = product.ordered[i].count
        alreadyOrdered = true
        orderPK = product.ordered[i].id
        console.log('already ordered :', alreadyOrdered)
        console.log('orderPK :', orderPK)
        console.log('current count :', currentCount)
      }
    }
    if (alreadyOrdered === false) {
      try {
        const { data } = await axios.post('/api/orders/', { count: '1', orderOwner: currentUserId, productOrdered: product.id }, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        console.log('RESPONSE FROM ORDER POST ', data)
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        const newCount = parseInt(currentCount) + 1
        const { data } = await axios.put(`/api/orders/${orderPK}/`, { count: newCount, orderOwner: currentUserId, productOrdered: product.id }, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        console.log('RESPONSE FROM ORDER PUT ', data)
      } catch (err) {
        console.log(err)
      }
    }
    setProductJustLiked(productJustLiked ? false : true)
  }

  const handleOrderRemove = async (product) => {
    let orderIndex
    let currentCount
    let alreadyOrdered = false
    let orderPK
    for (let i = 0; i < product.ordered.length; i++) {
      if (product.ordered[i].orderOwner.id === currentUserId) {
        orderIndex = i
        currentCount = product.ordered[i].count
        alreadyOrdered = true
        orderPK = product.ordered[i].id
        console.log('already ordered :', alreadyOrdered)
        console.log('orderPK :', orderPK)
        console.log('current count :', currentCount)
      }
      // for (let i = 0; i < ordersData.length; i++) {
      //   if (ordersData[i].productOrdered === product.id && ordersData[i].orderOwner.id === currentUserId) {
      //     orderPK = ordersData[i].id
      //     console.log('order PK ', orderPK)
      //   } else {
      //     console.log('no order found')
      //   }
      // }
      if (alreadyOrdered === true && currentCount === '1') {
        try {
          const { data } = await axios.delete(`/api/orders/${orderPK}/`, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          console.log('RESPONSE FROM DELETE ORDER ', data)
        } catch (err) {
          console.log(err)
        }
      } else if (alreadyOrdered === true && currentCount !== '1') {
        try {
          const newCount = parseInt(currentCount) - 1
          const { data } = await axios.put(`/api/orders/${orderPK}/`, { count: newCount, orderOwner: currentUserId, productOrdered: product.id }, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          console.log('RESPONSE FROM ORDER PUT ', data)
        } catch (err) {
          console.log(err)
        }
      }
    }
    setProductJustLiked(productJustLiked ? false : true)
    getProducts()
  }

  useEffect(() => {
    getProducts()
    console.log('orders data :', ordersData)
  }, [ordersData])

  return (
    <main className="profile-page-wrapper">

      {filteredProducts.length > 0 &&
        <div className='profile-row'>
          {filteredProducts.map(product => {
            return (
              <div key={product.id} className='profile-card'>



                <div className="buffer">
                  <Link className='bootstrap-link' to={`/products/${product.id}`}>

                    <div className="profile-card-image" style={{ backgroundImage: `url(${product.images.split(' ')[0]})` }}></div>
                  </Link>


                  {/* {(product.image.split(' ')).map((image, index) => {
                      return (
                        <div key={index} className="profile-card-image" style={{ backgroundImage: `url(${image})` }}></div>
                      )
                    })
                    } */}
                  {/* <p className='profile-card-title'>{product.name}</p> */}
                  <p className='profile-card-description'>{product.description}</p>
                  <p className='profile-card-date'>Posted by <span>{product.owner.username}</span> on {product.created_at.toString().split('T').slice(0, 1).join()}</p>
                  {isAuthenticated() ?
                    <>
                      {/* <p className='profile-card-distance2'>{(Math.abs(calcDistance(userCoord.userLatitude, userCoord.userLongitude, product.latitude, product.longitude))).toFixed(1)} miles | {product.district}</p> */}

                    </>
                    :
                    <>
                    </>
                  }
                  <p className='profile-card-price'>£{product.price}</p>

                  {product.wished.some((wish) => {
                    return wish.wishOwner.id === currentUserId
                  }) ?
                    <button className='like-button' onClick={() => handleDelete(product)}>❤️</button>
                    :
                    <button className='like-button' onClick={() => handleHeartClick(product)}>♡</button>
                  }
                  <div>
                    <button className='like-button' onClick={() => handleOrderRemove(product)}>-</button>
                    <button className='like-button' onClick={() => handleOrderAdd(product)}>+</button>
                    {product.ordered.some((order) => {
                      return order.orderOwner.id === currentUserId
                    }) ?
                      <p>{product.ordered[
                        product.ordered.findIndex((order) => {
                          return order.orderOwner.id === currentUserId
                        })
                      ].count}</p>
                      :
                      <p>0</p>
                    }
                  </div>
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