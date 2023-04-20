import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload } from '../../../helpers/auth'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { useParams, useNavigate } from 'react-router-dom' // Importing useParams, we have access to any placeholders in the url


const Profile = () => {

  const [profileData, setProfileData] = useState(null)
  const [errors, setErrors] = useState(false)
  // const [messagesReceived, setMessagesReceived] = useState([])
  // const [messagesSent, setMessagesSent] = useState([])

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
        // setMessagesReceived(data.commentsReceived)
        // setMessagesSent(data.commentsSent)
        // setMessagesArray(data.products.comments)
      } catch (err) {
        console.log(err)
        setErrors(true)
      }
    }
    getProfile()
  }, [])

  // useEffect(() => {
  //   console.log('messages received', messagesReceived)
  // }, [messagesReceived])



  // const [messageField, setMessageField] = useState({
  //   text: '',
  // })


  const handleChange = (e) => {
    const updatedReviewField = {
      // ...messageField,
      [e.target.name]: e.target.value,
      commentOwner: currentUserId,
      // productowner: message.commentOwner.username
      // productOwner: messagesReceived.owner.id,
    }
    // setMessageField(updatedReviewField)
    if (errors) setErrors('')
  }





  // const handleClick = async (e) => {
  //   // console.log('message field', messageField)
  //   try {
  //     const { data } = await axios.post('/api/comments/', { ...messageField }, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     setMessageField({
  //       text: 'Message sent!',
  //     })
  //     console.log('review SUCCESS ->', data)
  //   } catch (err) {
  //     console.log('review FAIL ->', err)
  //     setErrors(err.response.data)
  //   }
  // }


  const handleClickDelete = () => {
    navigate('/are-you-sure')
  }


  // const handleDelete = async (e) => {
  //   try {
  //     const { data } = await axios.delete(`/api/auth/${currentUserId}`, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     // setMessageField({
  //     //   text: 'Ad deleted!',
  //     // })
  //     navigate('/delete-account')
  //     console.log('delete SUCCESS ->', data)
  //   } catch (err) {
  //     console.log('review FAIL ->', err)
  //     setErrors(err.response.data)
  //   }
  // }
  const handleClickEdit = () => {
    navigate(`/edit-profile/${currentUserId}`)
  }



  return (
    <main className="profile-page-wrapper">
      {profileData ?
        <>
          {profileData.image ?
            <>
              <div className="single-card-image profile-pic" style={{ backgroundImage: `url(${profileData.image})` }}></div>
            </>
            :
            <>
            </>
          }
          <p className='profile-details'>username: <span id='span-username'>{profileData.username}</span></p>
          <p className='profile-details'>e-mail: <span id='span-email'>{profileData.email}</span></p>
          <p className='profile-details'>Postcode: <span id='span-email'>{profileData.postcode}</span></p>
          <hr></hr>
          <div className='profile-link-flex'>
            <h2 className='profile-title'>My ads</h2>
            {profileData.products.length < 1 &&
              <Link to="/products/new" className='btn-post btn-prof'>Post a first ad!</Link>
            }
            {profileData.products.length > 0 &&
              <Link to="/products/new" className='btn-post btn-prof'>Post a new ad!</Link>
            }
          </div>
          {
            profileData.products.length < 1 &&
            <p className='profile-details'>You have not posted any ads yet.</p>
          }
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
          {/* <h2 className='profile-title'>Messages received</h2>
          {messagesReceived.length < 1 &&
            <p className='profile-details'>You have not received any messages.</p>
          }
          <div className='profile-row'>
            {messagesReceived.length > 0 &&
              messagesReceived.slice(0).reverse().map(message => {
                return (
                  <div key={message.id} className='profile-card message-card'>
                    <div>
                      <h2 className='profile-card-title message-text'>&apos;{message.text}&apos;</h2>
                      <p className='message-p'>From <span>{message.commentOwner.username}</span> on {message.created_at.toString().split('T').slice(0, 1).join()}</p>
                    </div>
                    <Link className='btn-post btn-profile btn-reply' to={`/comments/${message.id}/`}>Reply</Link>
                  </div>
                )
              }
              )
            }
          </div>
          <h2 className='profile-title'>Messages sent</h2>

          {messagesSent.length < 1 &&
            <p className='profile-details'>You have not sent any messages.</p>
          }
          <div className='profile-row'>
            {messagesSent.length > 0 &&
              messagesSent.slice(0).reverse().map(message => {
                return (
                  <div key={message.id} className='profile-card message-card'>
                    <div>
                      <h2 className='profile-card-title message-text'>&apos;{message.text}&apos;</h2>
                      <p className='message-p'>To {message.productOwner.username} on {message.created_at.toString().split('T').slice(0, 1).join()}</p>
                    </div>
                  </div>
                )
              }
              )
            } */}
          {/* </div> */}
          {/* <Link as={Link} className="btn-post-delete2" to='/edit-profile/${currentUserId}/'>EDIT MY PROFILE</Link> */}
          <button className="btn-post-delete2" onClick={handleClickEdit}>EDIT MY ACCOUNT</button>
          <button className="btn-post-delete2" onClick={handleClickDelete}>DELETE MY ACCOUNT</button>
        </>
        :
        errors ? <h2>Something went wrong! Please try again later!</h2> : <h2>Loading</h2>
      }
    </main >
  )
}


export default Profile