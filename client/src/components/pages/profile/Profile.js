import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload } from '../../../helpers/auth'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { useParams, useNavigate } from 'react-router-dom' // Importing useParams, we have access to any placeholders in the url

import details from '../../../assets/images/details.png'
import basket from '../../../assets/images/basket.jpeg'
import sell from '../../../assets/images/sell.png'
import wishlist from '../../../assets/images/wishlist.png'
import orders from '../../../assets/images/orders.png'
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

  const handlePostAd = () => {
    navigate('/products/new')
  }

  return (
    <main className="profile-page-wrapper">
      <h1>Your account</h1>
      <div className="flex-profile-page">
        {profileData ?
          <>
            <Link className='bootstrap-link' to='/account-details'>
              <section className="account-section">
                <img src={details}></img>
                <div className="flex-account-section">
                  <div className="account-section-text">
                    <h2>Your account details</h2>
                    <p>View and edit your details</p>
                  </div>
                </div>
              </section>
            </Link>

            <Link className='bootstrap-link' to='/basket'>
              <section className="account-section">
                <img src={basket}></img>
                <div className="flex-account-section">
                  <div className="account-section-text">
                    <h2>Your basket</h2>
                    <p>Go to your basket and manage your items</p>
                  </div>
                </div>
              </section>
            </Link>

            <Link className='bootstrap-link' to='/orders'>
              <section className="account-section">
                <img src={orders}></img>
                <div className="flex-account-section">
                  <div className="account-section-text">
                    <h2>Your orders</h2>
                    <p>View your recent purchases</p>
                  </div>
                </div>
              </section>
            </Link>

            <Link className='bootstrap-link' to='/wish-list'>
              <section className="account-section">
                <img src={wishlist}></img>
                <div className="flex-account-section">
                  <div className="account-section-text">
                    <h2>Your wishlist</h2>
                    <p>View and manage items that you saved for later</p>
                  </div>
                </div>
              </section>
            </Link>

            <Link className='bootstrap-link' to='/on-sale'>
              <section className="account-section">
                <img src={sell}></img>
                <div className="flex-account-section">
                  <div className="account-section-text">
                    <h2>What you sell</h2>
                    <p>View and manage items that you are currently selling</p>
                  </div>
                </div>
              </section>
            </Link>
          </>
          :
          errors ? <h2>Something went wrong! Please try again later!</h2> : <h2>Loading</h2>
        }
      </div>

    </main >

  )
}


export default Profile