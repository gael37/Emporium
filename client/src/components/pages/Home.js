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
import info from '../../assets/images/info-icon.png'
import pageLoadingGif from '../../assets/gifs/gif-loading-blue.gif'

const Home = ({ setBasketCounter, setUsername }) => {

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  // const [userData, setUserData] = useState(null)
  const [errors, setErrors] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [typedProducts, setTypedProducts] = useState([])
  const [typedAndSelectedProducts, setTypedAndSelectedProducts] = useState([])
  const [wishesData, setWishesData] = useState([])
  const [basketData, setBasketData] = useState([])
  const [productJustLiked, setProductJustLiked] = useState(false)
  const [userData, setUserData] = useState(null)
  const [classWishlistMessage, setClassWishlistMessage] = useState('wish-message-not-visible')
  const [selected, setSelected] = useState('')
  const [typed, setTyped] = useState('')
  const [noMatch, setNoMatch] = useState(false)
  const [selectSize, setSelectSize] = useState('small')


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
      setFilteredProducts(data)
      setSelectedProducts(data)
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





  const handleSelected = (e) => {
    setSelected(e.target.value)
    setTyped('')
    if (e.target.value.length < 6) {
      setSelectSize('small')
    } else if (e.target.value.length < 12) {
      setSelectSize('medium')
    } else {
      setSelectSize('big')
    }
    const selection = products.filter(product => {
      for (let i = 0; i < product.categories.length; i++) {
        if (product.categories[i].name === e.target.value) {
          return product
        } else if (e.target.value === 'All') {
          return product
        }
      }
    })
    setFilteredProducts(selection)
  }

  const handleTyped = (e) => {
    setSelected('All')
    setSelectSize('small')

    setTyped(e.target.value)
    const regex = new RegExp(e.target.value, 'i')
    console.log('regex value:', regex)
    const filteredArray = products.filter(product => {
      return regex.test(product.description)
    })
    console.log('regex filtered array:', filteredArray)

    if (filteredArray.length === 0) {
      setNoMatch(true)
      setFilteredProducts(products)
    } else {
      setNoMatch(false)
      setFilteredProducts(products.filter(product => {
        return regex.test(product.description)
      }))
    }
  }

  // SELECTED




  // SEARCHED





  // --------WISHES---------




  const handleHeartClick = async (product) => {

    try {
      const { data } = await axios.post('/api/wishes/', { wish_owner: currentUserId, product_wished: product.id }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      if (classWishlistMessage === 'wish-message-not-visible') {
        setClassWishlistMessage('wish-message-visible')
        setTimeout(() => {
          setClassWishlistMessage('wish-message-not-visible')
        }, 2000)
      }
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

  const handleSelect = async (e, product) => {

    let basketPK
    for (let i = 0; i < product.added_to_basket.length; i++) {
      if (product.added_to_basket[i].basket_owner.id === currentUserId) {
        basketPK = product.added_to_basket[i].id
      }
      try {
        const newCount = e.target.value
        const { data } = await axios.put(`/api/basket/${basketPK}/`, { count: newCount, basket_owner: currentUserId, product_added_to_basket: product.id }, {
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



  // useEffect(() => {
  //   if (classWishlistMessage === 'wish-message-visible') {
  //     setTimeout(() => {
  //       setClassWishlistMessage('wish-message-not-visible')
  //     }, 2000)
  //   }
  // }, [classWishlistMessage])

  const goToBasket = () => {
    navigate('/basket')
  }

  const goLogin = () => {
    navigate('/login')
  }
  const handleClear = () => {
    // setSelectSize('small')
    setSelected('All')
    setTyped('')
    setNoMatch(false)
    setFilteredProducts(products)
  }




  useEffect(() => {
    getProducts()
    getUserData()
  }, [])

  useEffect(() => {
    getProducts()
    console.log('basket data :', basketData)
  }, [basketData])

  useEffect(() => {
    // console.log('product just liked :', productJustLiked)
    // getWishes()
    getBasket()
    getUserData()
  }, [productJustLiked])

  // useEffect(() => {
  //   getProducts()
  //   console.log('wishes data :', wishesData)
  // }, [wishesData])

  // useEffect(() => {
  //   const regex = new RegExp(typed, 'i')
  //   setTypedAndSelectedProducts(selectedProducts.filter(product => {
  //     return regex.test(product.description)
  //   }))
  // }, [selectedProducts])

  // useEffect(() => {
  //   setFilteredProducts(typedAndSelectedProducts)
  // }, [typedAndSelectedProducts])

  // useEffect(() => {
  //   const selection = products.filter(product => {
  //     for (let i = 0; i < product.categories.length; i++) {
  //       if (product.categories[i].name === selected) {
  //         return product
  //       } else if (selected === 'All') {
  //         return product
  //       }
  //     }

  //   })
  //   setSelectedProducts(selection)
  // }, [selected])

  // useEffect(() => {
  //   const regex = new RegExp(typed, 'i')
  //   setTypedAndSelectedProducts(selectedProducts.filter(product => {
  //     return regex.test(product.description)
  //   }))
  // }, [typed])

  // useEffect(() => {
  //   const selection = products.filter(product => {
  //     if (product.categories.includes(selected)) {
  //       return product
  //     } else if (selected === 'All') {
  //       return product
  //     }
  //   })
  //   setSelectedProducts(selection)
  // }, [products])

  useEffect(() => {
    getUserData()
  }, [products])

  return (
    <main className="home-page-wrapper">
      {filteredProducts.length > 0 ?
        <>
          {
            filteredProducts && filteredProducts.length > 0 &&
            <div className='home-page-flex'>
              <div className='flex-search' id='top-search'>
                {selectSize === 'small' &&
                  <select onChange={handleSelected} name="filter-style" className="select-nav select-small" value={selected}>
                    <option value="All">All</option>
                    <option value="Baby">Baby</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Books">Books</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Car & Motorbike">Car & Motorbike</option>
                    <option value="CDs & Vinyl">CDs & Vinyl</option>
                    <option value="Computers & Accessories">Computers & Accessories</option>
                    <option value="DVD & Blu-ray">DVD & Blu-ray</option>
                    <option value="Electronics & Photo">Electronics & Photo</option>
                    <option value="Garden & Outdoors">Garden & Outdoors</option>
                    <option value="Health & Personal care">Health & Personal care</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Large Appliances">Large Appliances</option>
                    <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                    <option value="Musical Instruments">Musical Instruments</option>
                    <option value="Consoles & Video Games">Consoles & Video Games</option>
                    <option value="Pet Supplies">Pet Supplies</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                    <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                    <option value="Toys & Games">Toys & Games</option>
                    <option value="Others">Others</option>
                  </select>
                }
                {selectSize === 'medium' &&
                  <select onChange={handleSelected} name="filter-style" className="select-nav select-medium" value={selected}>
                    <option value="All">All</option>
                    <option value="Baby">Baby</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Books">Books</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Car & Motorbike">Car & Motorbike</option>
                    <option value="CDs & Vinyl">CDs & Vinyl</option>
                    <option value="Computers & Accessories">Computers & Accessories</option>
                    <option value="DVD & Blu-ray">DVD & Blu-ray</option>
                    <option value="Electronics & Photo">Electronics & Photo</option>
                    <option value="Garden & Outdoors">Garden & Outdoors</option>
                    <option value="Health & Personal care">Health & Personal care</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Large Appliances">Large Appliances</option>
                    <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                    <option value="Musical Instruments">Musical Instruments</option>
                    <option value="Consoles & Video Games">Consoles & Video Games</option>
                    <option value="Pet Supplies">Pet Supplies</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                    <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                    <option value="Toys & Games">Toys & Games</option>
                    <option value="Others">Others</option>
                  </select>
                }
                {selectSize === 'big' &&
                  <select onChange={handleSelected} name="filter-style" className="select-nav select-big" value={selected}>
                    <option value="All">All</option>
                    <option value="Baby">Baby</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Books">Books</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Car & Motorbike">Car & Motorbike</option>
                    <option value="CDs & Vinyl">CDs & Vinyl</option>
                    <option value="Computers & Accessories">Computers & Accessories</option>
                    <option value="DVD & Blu-ray">DVD & Blu-ray</option>
                    <option value="Electronics & Photo">Electronics & Photo</option>
                    <option value="Garden & Outdoors">Garden & Outdoors</option>
                    <option value="Health & Personal care">Health & Personal care</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Large Appliances">Large Appliances</option>
                    <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                    <option value="Musical Instruments">Musical Instruments</option>
                    <option value="Consoles & Video Games">Consoles & Video Games</option>
                    <option value="Pet Supplies">Pet Supplies</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                    <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                    <option value="Toys & Games">Toys & Games</option>
                    <option value="Others">Others</option>
                  </select>
                }
                <input className='input-nav' type="text" placeholder='search' value={typed} onChange={handleTyped} />
              </div>
              <button className='button-adress home-button' onClick={handleClear}>Clear search</button>
              {noMatch &&
                <p className='p-centered'>No product match your criteria!</p>
              }
              <div className='product-row'>
                {filteredProducts.sort((a, b) => b.id - a.id).map(product => {
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
                          {/* {product.wished.some((wish) => {
                return wish.wish_owner.id === currentUserId
              }) ?
                <>
                  {likeInProgress &&
                    <p>loading</p>}
                  <button className='like-button like-button-bigger' onClick={() => handleDelete(product)}><img src={heart} alt='like'></img></button>
                </>
                :
                <>
                  {likeInProgress &&
                    <p>loading</p>}
                  <button className='like-button' onClick={() => handleHeartClick(product)}><img src={emptyHeart} alt='like'></img></button>
                </>
              } */}
                        </div>
                        <Link className='bootstrap-link home-link' to={`/products/${product.id}`}>
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

                              {/* <div className='flex-add-remove-basket'>
                    <button className='add-remove-button' onClick={() => handleBasketRemove(product)}><p className='button-minus'>-</p></button>
                    <p>{product.added_to_basket[
                      product.added_to_basket.findIndex((basket) => {
                        return basket.basket_owner.id === currentUserId
                      })
                    ].count}</p>
                    <button className='add-remove-button' onClick={() => handleBasketAdd(product)}><p className='button-plus'>+</p></button>
                  </div> */}

                              <div className="flex-add-remove-basket">
                                <select onChange={(e) => handleSelect(e, product)} name="filter-style" className="select-nav select-small" value={product.added_to_basket[
                                  product.added_to_basket.findIndex((basket) => {
                                    return basket.basket_owner.id === currentUserId
                                  })
                                ].count}>
                                  {/* <option value="0">0</option> */}
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
                            <button className='yellow-button' onClick={() => removeAll(product)}>Remove from basket</button>
                          </>
                          :
                          <>
                            <div className='flex-in-basket'>
                            </div>
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


                        {product.added_to_basket.some((basket) => {
                          return basket.basket_owner.id === currentUserId
                        }) &&
                          <button className='yellow-button' onClick={() => goToBasket()}>Go to basket</button>
                        }
                      </div>
                    </div>
                  )
                })
                }
              </div>
            </div>
          }
        </>
        :
        <div className='loading-pages-gif'>
          <>
            <img src={pageLoadingGif} alt='loading' />
          </>
        </div>
      }
    </main >
  )
}

export default Home


