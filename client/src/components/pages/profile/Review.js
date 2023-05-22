import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { Link, useRouteLoaderData } from 'react-router-dom'
import { getToken, getPayload, isAuthenticated } from '../../../helpers/auth'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/esm/Row'
import { useDropzone } from 'react-dropzone'

import pageLoadingGif from '../../../assets/gifs/page-loading-gif.gif'
import oneStar from '../../../assets/images/one-star.png'
import twoStars from '../../../assets/images/two-stars.png'
import threeStars from '../../../assets/images/three-stars.png'
import fourStars from '../../../assets/images/four-stars.png'
import fiveStars from '../../../assets/images/five-stars.png'
import emptyStar from '../../../assets/images/empty-star.png'
import fullStar from '../../../assets/images/full-star.png'
import validate from '../../../assets/images/validate.png'


import { Modal } from 'react-bootstrap'



const Review = ({ userData }) => {

  const [product, setProduct] = useState(null)
  const [errors, setErrors] = useState(false)
  const [bigImage, setBigImage] = useState('')
  const [textField, setTextField] = useState('')
  const [stars, setStars] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [show, setShow] = useState(false)


  const handleClose = () => {
    navigate('/orders')
    setShow(false)
  }

  const handleShow = async () => {
    setShow(true)
  }

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
    setShow(true)
  }

  const postedAd = () => {
    if (product.owner.id === currentUserId) {
      return true
    } else {
      return false
    }
  }

  return (
    <main className='single-page-wrapper'>
      {product ?
        <>
          <div className='single-page review-wrap'>
            <>
              <section className='single-section-images'>
                {bigImage ?
                  <div className="profile-card-image top-image" style={{ backgroundImage: `url(${bigImage})` }}></div>
                  // <img src={bigImage} className="profile-card-image top-image"></img>

                  :
                  <div className="profile-card-image top-image" style={{ backgroundImage: `url(${product.images.split(' ')[0]})` }}></div>
                  // <img src={product.images.split(' ')[0]} className="profile-card-image top-image"></img>

                }
                <div className='bottom-images-flex'>

                  {(product.images.split(' ')).map((image, index) => {
                    return (
                      <div key={index} name={image} onMouseEnter={getBigger} onMouseLeave={getSmaller} onClick={() => swapImage(image)} className="profile-card-image bottom-images" style={{ backgroundImage: `url(${image})` }}></div>
                    )
                  })
                  }

                </div>
              </section>

              <section className='single-description'>
                <div className='single-div-description'>

                  <p className='single-card-description-full'>{product.description}</p>
                  <div className='flex-single-reviews'>
                    <div className="buffer-reviews">
                      <a href='#reviews' className='a-link'>
                        {product.comments.length > 0 ?
                          Math.floor(product.comments.reduce((acc, obj) => {
                            return acc + parseInt(obj.rating)
                          }, 0) / product.comments.length) === 1 &&
                          <div className="flex-reviews add-padding">
                            <img src={oneStar}></img>
                            <p>{product.comments.length} ratings</p>
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
                            <p>{product.comments.length} ratings</p>
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
                            <p>{product.comments.length} ratings</p>
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
                            <p>{product.comments.length} ratings</p>
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
                            <p>{product.comments.length} ratings</p>
                          </div>
                          :
                          <div className='buffer-reviews'></div>
                        }
                      </a>
                    </div>
                  </div>
                  <p className='single-card-price'>£{product.price}</p>
                  {(product.about) &&
                    <>
                      <p className='about-title'><strong>About this item</strong></p>
                      <div>
                        <p className='single-card-about'><pre>{product.about}</pre></p>

                      </div>
                      {/* {product.about.split('- ').slice(1).map((paragraph, index) => {
                    return (
                      <p className='single-card-about' key={index}>• {paragraph}.</p>
                    )
                  })} */}
                    </>
                  }
                  {(product.dimensions) &&
                    <p className='single-card-info'><span>Dimensions</span> {product.dimensions}</p>
                  }
                  {(product.weight) &&
                    <p className='single-card-info'><span>Weight</span> {product.weight}</p>
                  }
                  {postedAd() ?
                    <p className='single-card-info'><span>Seller</span> me!</p>
                    :
                    <p className='single-card-info'><span>Seller</span> {product.owner.username}</p>
                  }
                </div>
              </section>


              <section className='reviews-section write-review-section'>
                <h2>Overall rating</h2>

                {
                  stars === 0 ?
                    <div className="flex-stars stars0">
                      <button onClick={giveOneStar}><img src={emptyStar} alt='empty star' ></img></button>
                      <button onClick={giveTwoStars}><img src={emptyStar} alt='empty star' ></img></button>
                      <button onClick={giveThreeStars}><img src={emptyStar} alt='empty star' ></img></button>
                      <button onClick={giveFourStars}><img src={emptyStar} alt='empty star' ></img></button>
                      <button onClick={giveFiveStars}><img src={emptyStar} alt='empty star' ></img></button>
                    </div>
                    :
                    <></>
                }
                {
                  stars === 1 ?
                    <div className="flex-stars stars1">
                      <button onClick={giveOneStar}><img src={fullStar} alt='full star' ></img></button>
                      <button onClick={giveTwoStars}><img src={emptyStar} alt='empty star' ></img></button>
                      <button onClick={giveThreeStars}><img src={emptyStar} alt='empty star' ></img></button>
                      <button onClick={giveFourStars}><img src={emptyStar} alt='empty star' ></img></button>
                      <button onClick={giveFiveStars}><img src={emptyStar} alt='empty star' ></img></button>
                    </div>
                    :
                    <></>
                }
                {stars === 2 ?
                  <div className="flex-stars stars2">
                    <button onClick={giveOneStar}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveTwoStars}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveThreeStars}><img src={emptyStar} alt='empty star' ></img></button>
                    <button onClick={giveFourStars}><img src={emptyStar} alt='empty star' ></img></button>
                    <button onClick={giveFiveStars}><img src={emptyStar} alt='empty star' ></img></button>
                  </div>
                  :
                  <></>
                }
                {stars === 3 ?
                  <div className="flex-stars stars3">
                    <button onClick={giveOneStar}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveTwoStars}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveThreeStars}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveFourStars}><img src={emptyStar} alt='empty star' ></img></button>
                    <button onClick={giveFiveStars}><img src={emptyStar} alt='empty star' ></img></button>
                  </div>
                  :
                  <></>
                }
                {stars === 4 ?
                  <div className="flex-stars stars4">
                    <button onClick={giveOneStar}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveTwoStars}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveThreeStars}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveFourStars}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveFiveStars}><img src={emptyStar} alt='empty star' ></img></button>
                  </div>
                  :
                  <></>
                }
                {stars === 5 ?
                  <div className="flex-stars stars5">
                    <button onClick={giveOneStar}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveTwoStars}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveThreeStars}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveFourStars}><img src={fullStar} alt='full star' ></img></button>
                    <button onClick={giveFiveStars}><img src={fullStar} alt='full star' ></img></button>
                  </div>
                  :
                  <></>
                }
                <div className="flex-rating">

                  {submitted ?
                    <div className="flex-submitted">
                      <p>✅ Submitted</p>
                      <button onClick={clear}>Clear</button>
                    </div>
                    :
                    <></>
                  }
                </div>
                <h2>Add a written review</h2>
                <textarea name='text' type='text' value={textField} onChange={changeInput}></textarea>
                <br></br>
                <button className='yellow-button' onClick={sendReview}>Submit</button>
              </section>
            </>
          </div>
          <Modal className='basket-modal' show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Review submitted</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="flex-modal-all review-submitted-msg">
                <div className="flex-validate flex-validate-login">
                  <img src={validate} alt='in basket'></img>
                  <p><span>Review submitted - Thank you!</span></p>
                </div>
                <div className='flex-buttons'>
                  <Link className='button-adress link-button' to={'/orders'}>Back to your orders</ Link>
                  <Link className='button-adress link-button' to={'/'}>Continue shopping</ Link>
                </div>

              </div>
            </Modal.Body>
          </Modal>
        </>
        :
        <div className='loading-pages-gif'>
          <img src={pageLoadingGif} alt='loading' />
          <p>Loading</p>
        </div>
      }
    </main >
  )
}

export default Review