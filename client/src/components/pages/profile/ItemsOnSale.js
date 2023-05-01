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

  return (
    <main className="profile-page-wrapper">
      {profileData ?
        <>
          <div className='profile-link-flex'>
            <h1 className='profile-title'>What I sell</h1>
            {
              profileData.products.length < 1 &&
              <p className='profile-details'>You have not posted any ads yet.</p>
            }
            {profileData.products.length < 1 &&
              <button className="yellow-button" onClick={handlePostAd}>Post a first ad!</button>

            }
            {profileData.products.length > 0 &&
              <Link to="/products/new" className='btn-post btn-prof'>Post a new ad!</Link>
            }
          </div>

          <div className='profile-row profile-row-bis'>
            {profileData.products.length > 0 &&
              profileData.products.map(product => {
                return (
                  <>
                    <div key={product.id} className='profile-card'>
                      <Link className='bootstrap-link' to={`/products/${product.id}/${profileData.postcode}`}>
                        <div className="buffer">

                          <div className="profile-card-image" style={{ backgroundImage: `url(${product.images.split(' ')[0]})` }}></div>

                          {/* <p className='profile-card-title'>{product.name}</p> */}
                          <p className='profile-card-description'>{product.description}</p>

                          <p className='profile-card-date'>Posted on: {product.created_at.toString().split('T').slice(0, 1).join()}</p>
                          <p className='profile-card-price'>£{product.price}</p>
                        </div>
                      </Link>
                    </div>
                  </>
                )
              }
              )
            }
          </div>
        </>
        :
        errors ? <h2>Something went wrong! Please try again later!</h2> : <h2>Loading</h2>
      }
    </main >
  )
}


export default ItemsOnSale