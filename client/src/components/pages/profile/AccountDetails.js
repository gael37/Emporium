import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getPayload } from '../../../helpers/auth'

import { useParams, useNavigate } from 'react-router-dom' // Importing useParams, we have access to any placeholders in the url
import validate from '../../../assets/images/validate.png'
import info from '../../../assets/images/info-icon.png'
import { Modal } from 'react-bootstrap'



const AccountDetails = ({ basketCounter, setBasketCounter, postcode, setPostcode }) => {

  const [userData, setUserData] = useState(null)
  const [errors, setErrors] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [show, setShow] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [postcodeData, setPostcodeData] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [postcodeEntered, setPostcodeEntered] = useState('')

  const payload = getPayload()
  const currentUserId = payload.sub

  const navigate = useNavigate()

  const getUserData = async () => {
    console.log('user id', currentUserId)
    try {
      const { data } = await axios.get(`/api/auth/${currentUserId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setUserData(data)
      const counter = data.basket.reduce((acc, obj) => {
        return acc + parseInt(obj.count)
      }, 0)
      console.log('user data, ', data)
      console.log('basket counter, ', counter)
      setBasketCounter(counter)
      if (postcode === '') {
        setPostcode(data.postcode)
      }
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  const getPostcodeData = async () => {
    console.log('postcode updated :', postcode)
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${postcode}/`)
      console.log('postcode datra', data)
      setPostcodeData(data)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
    }
  }

  // --------------------------Change delivery adress-----------------------------



  const handleClose = () => {
    setShow(false)
    setPostcode(postcodeData.result.postcode)
  }

  const handleShow = async () => {
    setShow(true)
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${postcode}/`)
      setPostcodeEntered(data)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
      setPostcodeEntered(null)
    }
  }

  const handleChange = async (e) => {
    if (errors) setErrors('')
    setPostcode(e.target.value)
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${e.target.value}/`)
      setPostcodeEntered(data)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
      setPostcodeEntered(null)
    }
  }

  const onSubmit = async (e) => {
    setShow(false)
    e.preventDefault()
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${postcodeEntered}/`)
      console.log('postcode datra', data)
      setPostcodeData(data)
      setPostcode(postcodeEntered)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
    }
  }


  // ! Effects




  useEffect(() => {
    getPostcodeData()
  }, [postcode])

  useEffect(() => {
    getUserData()
  }, [])

  const handleClickDelete = () => {
    navigate('/are-you-sure')
  }

  const handleClickEdit = () => {
    navigate(`/edit-profile/${currentUserId}`)
  }

  return (
    <main className="order-page-wrapper account-page-wrapper">
      {reviewSubmitted &&
        <div className="flex-validate">
          <img src={validate} alt='in basket'></img>
          <p><span>Review submitted - Thank you!</span></p>
        </div>
      }
      <h1>Account details</h1>

      {userData ?
        <div className="basket-elements">
          <h2 className='profile-details'><span id='span-username'>{userData.username}</span></h2>

          {userData.image &&
            <img className="profile-pic" src={userData.image}></img>
          }
          <h4>Email</h4>

          <p className='profile-details'><span id='span-email'>{userData.email}</span></p>




          <div className="single-deliver">
            <h4>Delivery adress</h4>
            <div className="single-deliver flex-deliver-basket">
              {userData && postcodeData && postcode &&
                <p>{userData.username}<br></br> {postcodeData.result.postcode} <br></br>{postcodeData.result.admin_district}, {postcodeData.result.country}</p>
              }
              <button className='button-adress' onClick={handleShow}>Change delivery adress</button>
            </div>
          </div>


          <Modal className='basket-modal' show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Change your delivery adress </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="flex-modal-all">
                <label htmlFor="name">Enter a UK postcode</label>
                <div className='flex-modal-input-submit'>
                  <input
                    type="text"
                    name="adress"
                    onChange={handleChange}
                    value={postcode}
                    placeholder="Enter a valid postcode here"
                    required
                  />
                  {postcodeEntered ?
                    <button className='yellow-button button-submit-change-adress' onClick={onSubmit}>Submit</button>
                    :
                    <button className='regular-button button-submit-change-adress greyed-button'>Submit</button>
                  }
                </div>
                {postcodeEntered ?
                  <>
                    <div className="flex-validate">
                      <p className='modal-p-validate'>Valid postcode</p>
                      <img src={validate} alt='valid' />
                    </div>
                    {/* <button className='yellow-button button-submit-change-adress' onClick={onSubmit}>Submit</button> */}
                  </>
                  :
                  <>
                    <div className="flex-invalidate">
                      <p>Invalid postcode</p>
                      {/* <img src={validate} alt='valid' /> */}
                    </div>
                  </>
                }
                <button onClick={handleClose} className='regular-button'>Cancel</button>
              </div>
            </Modal.Body>
          </Modal>
          {userData.username === 'guest' ?
            <>
              <button className="button-adress red-button-adress">Delete my account</button>
              <div className='no-user'>
                <div className="flex-validate flex-info-no-user">
                  <img src={info} alt='info'></img>
                  <h6>You cannot delete the guest account</h6>
                </div>
              </div>
            </>
            :
            <button className="button-adress red-button-adress" onClick={handleClickDelete}>Delete my account</button>
          }

        </div>
        :
        errors ? <h2>Something went wrong! Please try again later!</h2> : <h2>Loading</h2>
      }
    </main >
  )
}


export default AccountDetails