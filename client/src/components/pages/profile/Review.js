import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { Link, useRouteLoaderData } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/esm/Row'
import { useDropzone } from 'react-dropzone'

const Review = ({ userData }) => {

  const [product, setProduct] = useState(null)
  const [errors, setErrors] = useState(false)
  const [bigImage, setBigImage] = useState('')
  const [textField, setTextField] = useState('')
  const [stars, setStars] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    console.log('user data', userData)
  }, [])

  const { productId } = useParams()
  const navigate = useNavigate()

  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub

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

  const swapImage = (image) => {
    setBigImage(image)
  }
  const getBigger = (e) => {
    e.target.className = 'profile-card-image bottom-images bigger'
  }
  const getSmaller = (e) => {
    e.target.className = 'profile-card-image bottom-images'
  }

  const clear = () => {
    setStars(0)
    setSubmitted(false)
  }
  const giveOneStar = () => {
    setStars(1)
    setSubmitted(true)
  }
  const giveTwoStars = () => {
    setStars(2)
    setSubmitted(true)
  }
  const giveThreeStars = () => {
    setStars(3)
    setSubmitted(true)
  }
  const giveFourStars = () => {
    setStars(4)
    setSubmitted(true)
  }
  const giveFiveStars = () => {
    setStars(5)
    setSubmitted(true)
  }

  const changeInput = (e) => {
    setTextField(e.target.value)
  }

  const sendReview = async () => {
    try {
      const { data } = await axios.post('/api/comments/', { rating: stars, text: textField, comment_owner: currentUserId, product_reviewed: productId }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      // setCounter(newCount)
      console.log('RESPONSE FROM REVIEW POST ', data)
    } catch (err) {
      console.log(err)
    }
    navigate('/orders')
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
                    <div className="profile-card-image top-image review-big-image" style={{ backgroundImage: `url(${bigImage})` }}></div>
                    :
                    <div className="profile-card-image top-image review-big-image" style={{ backgroundImage: `url(${product.images.split(' ')[0]})` }}></div>

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
                  <p className='single-card-price'>£{product.price}</p>
                  <p className='single-card-date'>Posted by <span>{product.owner.username}</span> on <span>{product.created_at.toString().split('T').slice(0, 1).join()}</span></p>
                  {product &&
                    <p>Categories: {product.categories[0].name}</p>
                  }
                </div>
              </div>
              <div className="flex-rating">
                <h2>Overall rating</h2>
                {submitted ?
                  <div className="flex-submitted">
                    <p>✅ Submitted</p>
                    <button onClick={clear}>Clear</button>
                  </div>
                  :
                  <></>
                }
              </div>



              {
                stars === 0 ?
                  <div className="flex-stars stars0">
                    <button onClick={giveOneStar}>☆</button>
                    <button onClick={giveTwoStars}>☆</button>
                    <button onClick={giveThreeStars}>☆</button>
                    <button onClick={giveFourStars}>☆</button>
                    <button onClick={giveFiveStars}>☆</button>
                  </div>
                  :
                  <></>
              }
              {
                stars === 1 ?
                  <div className="flex-stars stars1">
                    <button onClick={giveOneStar}>⭐️</button>
                    <button onClick={giveTwoStars}>☆</button>
                    <button onClick={giveThreeStars}>☆</button>
                    <button onClick={giveFourStars}>☆</button>
                    <button onClick={giveFiveStars}>☆</button>
                  </div>
                  :
                  <></>
              }
              {stars === 2 ?
                <div className="flex-stars stars2">
                  <button onClick={giveOneStar}>⭐️</button>
                  <button onClick={giveTwoStars}>⭐️</button>
                  <button onClick={giveThreeStars}>☆</button>
                  <button onClick={giveFourStars}>☆</button>
                  <button onClick={giveFiveStars}>☆</button>
                </div>
                :
                <></>
              }
              {stars === 3 ?
                <div className="flex-stars stars3">
                  <button onClick={giveOneStar}>⭐️</button>
                  <button onClick={giveTwoStars}>⭐️</button>
                  <button onClick={giveThreeStars}>⭐️</button>
                  <button onClick={giveFourStars}>☆</button>
                  <button onClick={giveFiveStars}>☆</button>
                </div>
                :
                <></>
              }
              {stars === 4 ?
                <div className="flex-stars stars4">
                  <button onClick={giveOneStar}>⭐️</button>
                  <button onClick={giveTwoStars}>⭐️</button>
                  <button onClick={giveThreeStars}>⭐️</button>
                  <button onClick={giveFourStars}>⭐️</button>
                  <button onClick={giveFiveStars}>☆</button>
                </div>
                :
                <></>
              }
              {stars === 5 ?
                <div className="flex-stars stars5">
                  <button onClick={giveOneStar}>⭐️</button>
                  <button onClick={giveTwoStars}>⭐️</button>
                  <button onClick={giveThreeStars}>⭐️</button>
                  <button onClick={giveFourStars}>⭐️</button>
                  <button onClick={giveFiveStars}>⭐️</button>
                </div>
                :
                <></>


              }
              <h2>Add a written review</h2>
              <input name='text' type='text' placeholder='What did you like or dislike?' value={textField} onChange={changeInput}></input>
              <button onClick={sendReview}>Submit</button>


            </>
            :
            errors ? <h2>Something went wrong! Please try again later!</h2> : <h2>Loading</h2>
          }
        </Row>
      </Container>

    </main >
  )
}

export default Review