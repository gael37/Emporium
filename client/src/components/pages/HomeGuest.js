import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
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

const HomeGuest = () => {

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [errors, setErrors] = useState(false)
  const [selected, setSelected] = useState('')
  const [typed, setTyped] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [noMatch, setNoMatch] = useState(false)
  const [selectSize, setSelectSize] = useState('small')

  const navigate = useNavigate()

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

  // ----------------------------------- NAVIGATION LINKS -------------------------------------


  const goLogin = () => {
    navigate('/login')
  }



  // ----------------------------------- SEARCH -------------------------------------


  const handleTyped = (e) => {
    setSelected('All')
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
  // useEffect(() => {
  //   console.log('filtered products', filteredProducts)
  // }, [filteredProducts])

  // SELECT


  // const handleSubmit = (e) => {
  //   setSelect(e.target.value)
  // }

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

  // -----------------------------------USE EFFECTS -------------------------------------

  // useEffect(() => {
  //   getProducts()
  //   console.log('basket data :', basketData)
  // }, [basketData])

  // useEffect(() => {
  //   console.log('product just liked :', productJustLiked)
  //   getBasket()
  //   getUserData()
  // }, [productJustLiked])

  // useEffect(() => {
  //   const regex = new RegExp(typed, 'i')
  //   setTypedAndSelectedProducts(selectedProducts.filter(product => {
  //     return regex.test(product.description)
  //   }))
  // }, [typed])

  useEffect(() => {
    getProducts()
  }, [])

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
  //   const selection = products.filter(product => {
  //     if (product.categories.includes(selected)) {
  //       return product
  //     } else if (selected === 'All') {
  //       return product
  //     }
  //   })
  //   setSelectedProducts(selection)
  // }, [products])

  const handleClear = () => {
    setSelected('All')
    setTyped('')
    setNoMatch(false)
    setFilteredProducts(products)
  }

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
                        <div className='no-user'>
                          <p className='yellow-button p-button'>Add to basket</p>
                          <div className="flex-validate flex-info-no-user">
                            <img src={info} alt='in basket'></img>
                            <h6>Please <button className='button-adress' onClick={goLogin}>sign in</button> to add to basket or to add to wishlist</h6>
                          </div>
                        </div>
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

export default HomeGuest