import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'
import { useNavigate } from 'react-router-dom'

import validate from '../../../assets/images/validate.png'


function Wishlist({ basketCounter, setBasketCounter }) {

  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState(null)
  const [productJustLiked, setProductJustLiked] = useState(false)


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
    getUserData()
  }, [])

  const removeItem = async (wish) => {
    const wishPK = wish.id
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

  }

  useEffect(() => {
    getUserData()
  }, [productJustLiked])



  // ------------------------BASKET---------------------------


  const handleBasketAdd = async (wish) => {
    let currentCount
    let alreadyAddedToBasket = false
    let basketPK
    for (let i = 0; i < userData.basket.length; i++) {
      if (userData.basket[i].product_added_to_basket.id === wish.product_wished.id) {
        currentCount = userData.basket[i].count
        alreadyAddedToBasket = true
        basketPK = userData.basket[i].id
        console.log('already added_to_basket :', alreadyAddedToBasket)
        console.log('basketPK :', basketPK)
        console.log('current count :', currentCount)
      }
    }
    if (alreadyAddedToBasket === false) {
      // setAddedToBasket(true)
      try {
        const { data } = await axios.post('/api/basket/', { count: '1', basket_owner: currentUserId, product_added_to_basket: wish.product_wished.id }, {
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
        const { data } = await axios.put(`/api/basket/${basketPK}/`, { count: newCount, basket_owner: currentUserId, product_added_to_basket: wish.product_wished.id }, {
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






  const handleBasketRemove = async (wish) => {
    let currentCount
    let alreadyAddedToBasket = false
    let basketPK
    for (let i = 0; i < userData.basket.length; i++) {
      if (userData.basket[i].product_added_to_basket.id === wish.product_wished.id) {
        currentCount = userData.basket[i].count
        alreadyAddedToBasket = true
        basketPK = userData.basket[i].id
        console.log('already added_to_basket :', alreadyAddedToBasket)
        console.log('basketPK :', basketPK)
        console.log('current count :', currentCount)
      }
    }
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
        const { data } = await axios.put(`/api/basket/${basketPK}/`, { count: newCount, basket_owner: currentUserId, product_added_to_basket: wish.product_wished.id }, {
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
    getUserData()
  }



  const removeAll = async (wish) => {

    let currentCount
    let alreadyAddedToBasket = false
    let basketPK
    for (let i = 0; i < userData.basket.length; i++) {
      if (userData.basket[i].product_added_to_basket.id === wish.product_wished.id) {
        currentCount = userData.basket[i].count
        alreadyAddedToBasket = true
        basketPK = userData.basket[i].id
        console.log('already added_to_basket :', alreadyAddedToBasket)
        console.log('basketPK :', basketPK)
        console.log('current count :', currentCount)
      }
    }
    try {
      const { data } = await axios.delete(`/api/basket/${basketPK}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      // setCounter(newCount)
      console.log('RESPONSE FROM ALL BASKET DELETE ', data)
    } catch (err) {
      console.log(err)
    }
    setProductJustLiked(productJustLiked ? false : true)
  }


  const removeAllWishlist = async () => {

    for (let i = 0; i < userData.wishes.length; i++) {
      if (userData.wishes[i].wish_owner.id === currentUserId) {
        console.log('basket pk :', userData.wishes[i].id)
        try {
          const { data } = await axios.delete(`/api/wishes/${userData.wishes[i].id}/`, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          })
          // setCounter(newCount)
          console.log('RESPONSE FROM ALL BASKET DELETE ', data)
        } catch (err) {
          console.log(err)
        }
      }
    }
    getUserData()
    setProductJustLiked(productJustLiked ? false : true)
  }

  const handleShopping = () => {
    navigate('/')
  }


  return (
    <main className="basket-main">
      {userData && userData.wishes.length > 0 ?
        <>
          <div className="flex-delete-basket">
            <h1>Saved for later</h1>
            <button className='button-adress' onClick={() => removeAllWishlist()}>Delete list</button>
          </div>


          <section className="basket-section">
            {userData.wishes.sort((b, a) => a.id - b.id).map((wish) => {
              return (
                <div key={wish.id} className='basket-card'>

                  <Link className='bootstrap-link'>
                    <div className="product-card-image basket-card-image" style={{ backgroundImage: `url(${wish.product_wished.images.split(' ')[0]})` }}></div>
                  </Link>
                  <div>
                    <p className='basket-card-description'>{wish.product_wished.description}</p>
                    <p className='profile-card-price'>£ {wish.product_wished.price}</p>
                    {userData.basket.some((basket) => {
                      return basket.product_added_to_basket.id === wish.product_wished.id
                    }) ?
                      <>
                        <div className="flex-in-basket">
                          <div className="flex-validate">
                            <p><span>In basket</span></p>
                            <img src={validate} alt='in basket'></img>
                          </div>
                          <div className='flex-add-remove-basket'>
                            <button className='add-remove-button' onClick={() => handleBasketRemove(wish)}>-</button>
                            <p>{userData.basket[userData.basket.findIndex((basket) => {
                              return basket.product_added_to_basket.id === wish.product_wished.id
                            })].count}</p>
                            <button className='add-remove-button' onClick={() => handleBasketAdd(wish)}>+</button>
                          </div>

                        </div>
                        <div className="flex-wishlist-remove">
                          <button className='button-adress' onClick={() => removeAll(wish)}>Remove from basket</button>
                          <button className='button-adress' onClick={() => removeItem(wish)}>Remove from wishlist</button>
                        </div>


                      </>
                      :
                      <div className="flex-wishlist-remove">
                        <button className='yellow-button small-button' onClick={() => handleBasketAdd(wish)}>Add to basket</button>
                        <button className='button-adress' onClick={() => removeItem(wish)}>Remove from wishlist</button>
                      </div>
                    }
                  </div>


                </div>
              )
            })}
          </section>
        </>
        :
        <div className='basket-empty'>
          <h2>Your wishlist is empty</h2>
          <p><button className='button-adress' onClick={handleShopping}>Continue shopping</button></p>
        </div>
      }
    </main>
  )

}

export default Wishlist