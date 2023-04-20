// React
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Imports
import axios from 'axios'
import { getToken } from '../../../helpers/auth'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import { getPayload } from '../../../helpers/auth'

const EditProfile = () => {

  const navigate = useNavigate()

  const payload = getPayload()
  const currentUserId = payload.sub


  // ! State
  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    postcode: '',
    image: '',
    password: '',
    password_confirmation: '',

  })

  const [errors, setErrors] = useState('')
  const [firstFormFieldsLoad, setFirstFormFieldsload] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [passError, setPassError] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [postcodeData, setPostcodeData] = useState(null)


  let imagesString = []

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get(`/api/auth/${currentUserId}/`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setFormFields(data)
        setFirstFormFieldsload(true)

      } catch (err) {
        console.log(err)
      }
    }
    getUserData()
  }, [])

  useEffect(() => {
    setSelectedImages(formFields.image.split(' '))
  }, [firstFormFieldsLoad])

  useEffect(() => {
    const firstPotscodeCheck = async () => {
      try {
        const { data } = await axios.get(`https://api.postcodes.io/postcodes/${formFields.postcode}/`)
        setPostcodeData(data)
      } catch (err) {
        console.log(err)
        setPostcodeError(err)
        setPostcodeData(null)
      }
    }
    firstPotscodeCheck()

  }, [firstFormFieldsLoad])

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const { data } = await axios.delete(`/api/auth/${currentUserId}/`, {
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //     })
  //     console.log('EDIT SUCCESS ->', data)
  //     navigate('/profile')
  //   } catch (err) {
  //     console.log('EDIT FAIL ->', err)
  //     setErrors(err.response.data.message)
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()
    imagesString = selectedImages.join(' ')
    try {
      if (formFields.password !== formFields.password_confirmation) {
        setPassError('Passwords do not match!')
      }
      if (formFields.password.length < 8 || formFields.password_confirmation.length < 8) {
        setPassError('Password too short! It must be at least 8 characters long.')
      }
      // axios.post() is used to send a POST request - POST requests are used to submit new information
      await axios.put(`/api/auth/${currentUserId}/`, { ...formFields, image: imagesString }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('Profile edit successful')
      // We can then use that function, passing in the path we want to follow, and it will redirect us
      navigate('/profile')
    } catch (err) {
      if (formFields.password !== formFields.password_confirmation) {
        setErrors({
          message: 'Passwords do not match',
        })
      }
      console.log(err.response.data.message)
      setErrors(err.response.data.message)
    }
  }

  const handleChange = (e) => {
    console.log(`${e.target.name}: ${e.target.value}`)
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    if (errors) setErrors('')
  }

  const handleChangePostcode = async (e) => {
    console.log(`${e.target.name}: ${e.target.value}`)
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    if (errors) setErrors('')
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${e.target.value}/`)
      setPostcodeData(data)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
      setPostcodeData(null)
    }
  }

  useEffect(() => {
    console.log('postcode DATA :', postcodeData)
  }, [postcodeData])

  const onSelectFile = async (event) => {
    // let imageString = ''
    const imagesArray = []
    console.log(event.target.files)
    for (let i = 0; i < event.target.files.length; i++) {
      try {
        console.log('formFields before uploads', formFields)
        // File field on the formData we're creating

        const formData = new FormData()
        formData.append('file', event.target.files[i])
        console.log('formData composed of all files', formData)
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
        const { data } = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData)
        console.log('current url', data.secure_url)
        imagesArray.push(data.secure_url)
        // imageString = imageString + ' ' + data.secure_url
        // console.log('imageString', imageString)
        // Upload preset
        // Sending data as an axios request to the cloudinary API
      } catch (err) {
        console.log(err)
      }
    }
    const selectedFiles = event.target.files
    const selectedFilesArray = Array.from(selectedFiles)

    // const imagesArray = selectedFilesArray.map((file) => {
    //   return URL.createObjectURL(file)
    // })

    setSelectedImages((previousImages) => previousImages.concat(imagesArray))
    console.log('images array log :', imagesArray)
    // setFormFields({ ...formFields, images: imageString })
  }

  function deleteHandler(image) {
    setSelectedImages(selectedImages.filter((e) => e !== image))
    // URL.revokeObjectURL(image)
  }

  return (
    <main className="form-page">
      <Container className='mt-4'>
        <Row>
          <div className='col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4'>
            <form onSubmit={handleSubmit}>
              <h1>Edit your details</h1>
              {/* Username */}
              <label htmlFor="username">Username <span>*</span></label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                value={formFields.username}
                placeholder="Username"
                required
              />
              {/* Email */}
              <label htmlFor="email">Email <span>*</span></label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formFields.email}
                placeholder="Email Address"
                required
              />
              {/* Postcode */}
              <label htmlFor="postcode">Postcode <span>*</span></label>
              <input
                type="text"
                name="postcode"
                onChange={handleChangePostcode}
                value={formFields.postcode}
                placeholder="Postcode"
                required
              />
              {postcodeData ?
                <p>POSTCODE OK! ✅</p>
                :
                <p>BAD POSTCODE! 🙊</p>}
              {/* Image */}
              <label>Upload your profile picture:</label>
              <input
                type="file"
                name="images"
                onChange={onSelectFile}
                multiple
                accept="image/png , image/jpeg, image/webp"
              />
              {selectedImages.length > 0 &&
                (selectedImages.length > 1 ? (
                  <p className="error">
                    You can&apos;t upload more than one image! <br />
                    <span>
                      please delete <b> {selectedImages.length - 1} </b> of them{' '}
                    </span>
                  </p>
                ) : (
                  <p>Image uploaded! ✅</p>
                ))}

              <div className="images">
                {selectedImages &&
                  selectedImages.map((image, index) => {
                    return (
                      <div key={image} className="image">
                        <img src={image} height="50" width="50" alt="upload" />
                        <button onClick={() => deleteHandler(image)}>
                          delete image
                        </button>
                        <p>{index + 1}</p>
                      </div>
                    )
                  })}
              </div>
              {/* Generic Message Error */}
              {errors && errors.message && <small className='text-danger'>{errors.message}</small>}
              {/* Upload status */}
              {selectedImages.length > 0 &&
                (selectedImages.length > 1 ? (
                  <p className="error" >Image upload status: Oops! Looks like you have selected too many images!</p>
                ) : (
                  <p className="error" >Image upload status: Image succesfully uploaded! ✅</p>
                ))}


              {/* Password */}
              <label htmlFor="password">Password <span>*</span></label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={formFields.password}
                placeholder="Password"
                required
              />
              {/* PasswordConfirmation */}
              <label htmlFor="passwordConfirmation">Confirm Password <span>*</span></label>
              <input
                type="password"
                name="password_confirmation"
                onChange={handleChange}
                value={formFields.password_confirmation}
                placeholder="Confirm Password"
                required
              />
              {/* Error Message */}
              {errors && <small className='text-danger'>{errors}</small>}
              {/* Submit */}
              <button className='btn-form'>Edit</button>
            </form>
          </div>
        </Row>
      </Container>
    </main>
  )
}

export default EditProfile