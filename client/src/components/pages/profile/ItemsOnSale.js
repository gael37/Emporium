import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload } from '../../../helpers/auth'
import { useParams, useNavigate } from 'react-router-dom' // Importing useParams, we have access to any placeholders in the url


const ItemsOnSale = () => {

  const [profileData, setProfileData] = useState(null)
  const [errors, setErrors] = useState(false)

  const payload = getPayload()
  const currentUserId = payload.sub

  const navigate = useNavigate()

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get(`api/auth/${currentUserId}/`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        console.log('data', data)
        setProfileData(data)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getProfile()
  }, [])

  const handlePostAd = () => {
    navigate('/products/new')
  }

  const navSell = () => {
    navigate('/products/new')
  }

  return (
    <main className="basket-main">
      {profileData ?
        <>
          <div className='profile-link-flex'>
            <h1 className='profile-title'>My items on sale</h1>
            {
              profileData.products.length < 1 &&
              <p className='profile-details'>You are not currently selling any items.</p>
            }
            {profileData.products.length < 1 &&
              <button className="yellow-button" onClick={handlePostAd}>Start selling</button>

            }
            {profileData.products.length > 0 &&
              <button className='yellow-button-small' onClick={navSell}>Sell a new item</button>
            }
          </div>

          <section className="basket-section">
            {profileData.products.length > 0 &&
              profileData.products.map(product => {
                return (
                  <>
                    <div key={product.id} className='basket-card'>
                      <Link className='bootstrap-link' to={`/products/${product.id}/${profileData.postcode}`}>

                        <div className="product-card-image basket-card-image" style={{ backgroundImage: `url(${product.images.split(' ')[0]})` }}></div>
                      </Link>
                      {/* <p className='profile-card-title'>{product.name}</p> */}
                      <div>
                        <p className='basket-card-description'>{product.description}</p>
                        <p className='basket-card-description'>£{product.price}</p>
                        <p className='profile-card-date'>Posted on: {product.created_at.toString().split('T').slice(0, 1).join()}</p>

                      </div>


                    </div>
                  </>
                )
              }
              )
            }
          </section>
        </>
        :
        errors ? <h2>Something went wrong! Please try again later!</h2> : <h2>Loading</h2>
      }
    </main >
  )
}


export default ItemsOnSale