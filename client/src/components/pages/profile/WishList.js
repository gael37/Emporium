import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'



function Wishlist() {

  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState(null)
  const [productJustLiked, setProductJustLiked] = useState(false)


  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub
  console.log('user id', currentUserId)

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`api/auth/${currentUserId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('user data, ', data)
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
  return (
    <main className="profile-page-wrapper">

      <h1>Saved for later</h1>


      <div className='basket-elements'>
        {userData ?
          userData.wishes.length > 0 &&
          userData.wishes.sort((b, a) => a.id - b.id).map((wish) => {
            return (
              <div key={wish.id} className='profile-card wish-card'>
                <div className="buffer">
                  <Link className='bootstrap-link'>
                    <div className="profile-card-image" style={{ backgroundImage: `url(${wish.product_wished.images.split(' ')[0]})` }}></div>
                  </Link>
                  <p className='profile-card-description'>{wish.product_wished.description}</p>
                  <p className='profile-card-price'>£ {wish.product_wished.price}</p>
                  <button onClick={() => removeItem(wish)}>Remove from list</button>
                </div>
              </div>
            )
          })
          :
          <h2>Loading...</h2>
        }
      </div>
    </main>
  )

}

export default Wishlist