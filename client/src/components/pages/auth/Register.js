// React Components
import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'

// Imports
import axios from 'axios'

// Bootstrap Components
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { getToken, getPayload } from '../../../helpers/auth'

import dropImage from '../../../assets/images/drop.png'
import validate from '../../../assets/images/validate.png'
import gif from '../../../assets/gifs/photo-upload.gif'
import logoSlogan from '../../../assets/images/logo-figma2.png'





const Register = () => {

  // ! Location Variables
  // useNavigate() executed returns back the function we need to use to navigate around our React App
  const navigate = useNavigate()

  // ! State
  const [loading, setLoading] = useState(false)

  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    postcode: '',
    image: '',
  })

  const [errors, setErrors] = useState('')
  const [passError, setPassError] = useState('')
  const [selectedImages, setSelectedImages] = useState([])

  const [firstFormFieldsLoad, setFirstFormFieldsload] = useState(false)
  const [postcodeError, setPostcodeError] = useState('')
  const [postcodeData, setPostcodeData] = useState(null)

  let imagesString = []


  // ! Executions

  // Submitting the form
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
      await axios.post('/api/auth/register/', { ...formFields, image: imagesString })
      console.log('Register successful')
      // We can then use that function, passing in the path we want to follow, and it will redirect us
      navigate('/login-after-register')
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

  // Update formFields state when input changes
  const handleChange = (e) => {
    setPassError('')
    const updatedFormFields = {
      ...formFields,
      [e.target.name]: e.target.value,
    }
    setFormFields(updatedFormFields)

    // Setting errors back to empty string if we type into an input and an error is present
    if (errors) setErrors('')
  }

  function deleteHandler(image) {
    setSelectedImages(selectedImages.filter((e) => e !== image))
    // URL.revokeObjectURL(image)
  }

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


  // DROP ZONE




  const [files, setFiles] = useState([])

  const onDrop = useCallback((files) => {
    setLoading(true)
    setFiles(files)
  }, [setFiles])

  const { getRootProps, getInputProps, acceptedFiles, isDragActive } = useDropzone({ onDrop })

  useEffect(() => {
    const getFiles = async () => {
      const imagesArray = []
      for (let i = 0; i < files.length; i++) {
        try {
          const formData = new FormData()
          formData.append('file', files[i])
          formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
          const { data } = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData)
          imagesArray.push(data.secure_url)
        } catch (err) {
          console.log(err)
        }
      }
      setSelectedImages((previousImages) => previousImages.concat(imagesArray))
    }
    getFiles()
  }, [files])

  useEffect(() => {
    if (selectedImages.length > 0) {
      setLoading(false)
    }
  }, [selectedImages])

  const handleChangePostcode = async (e) => {
    console.log(`${e.target.name}: ${e.target.value}`)
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    if (errors) setErrors('')
    try {
      const { data } = await axios.get(`https://api.postcodes.io/postcodes/${e.target.value}/`)
      setPostcodeData(data)
      setPostcodeError(null)
    } catch (err) {
      console.log(err)
      setPostcodeError(err)
      setPostcodeData(null)
    }
  }

  const goLogin = () => {
    navigate('/login')
  }

  return (
    <main className="login-form-page">
      <div className='login-form-page-image'>
        <img src={logoSlogan} />
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Register</h1>
        {/* Username */}
        <label htmlFor="username">Username <span>*</span></label>
        < input
          type="text"
          name="username"
          onChange={handleChange}
          value={formFields.username}
          placeholder="Username"
          required
        />
        {/* Email */}
        < label htmlFor="email" > Email < span >*</span ></label >
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={formFields.email}
          placeholder="Email Address"
          required
        />
        {/* Postcode */}
        <label htmlFor="email">Postcode <span>*</span></label>
        <input
          type="text"
          name="postcode"
          onChange={handleChangePostcode}
          value={formFields.postcode}
          placeholder="Postcode"
          required
        />
        {
          postcodeData ?
            <div className="flex-validate">
              <p className='modal-p-validate'><span>Valid postcode</span></p>
              <img src={validate} alt='valid' />
            </div>
            :

            <div className="flex-invalidate">
              {formFields.postcode.length > 4 &&
                <p className='modal-p-invalidate'>Invalid postcode</p>
              }
              {/* <img src={validate} alt='valid' /> */}
            </div>
        }
        {/* Image */}
        <label>Upload a profile image:</label>
        <div className='section-upload'>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input className="blog-form-input" {...getInputProps()} />
            <div className="dropzone-flex">
              {isDragActive ?
                <p className="dropzone-content">
                  Release to drop the file here</p>
                :
                <div className="dropzone-content">
                  <p>Drag and drop your image here<br></br>or click this box</p>
                  <img src={dropImage}></img>
                </div>
              }
            </div>
          </div>
        </div>
        {
          loading &&
          <div className='flex-loading'>
            <img className='loading-gif' src={gif} alt='loading'></img>
            <p>Uploading images, please wait...</p>
          </div>
        }
        {
          selectedImages.length > 0 ?
            <div className='images-uploaded'>

              {selectedImages.length > 0 &&
                (selectedImages.length > 1 ? (
                  <p className="error">
                    You can&apos;t upload more than one image! <br />
                    <span>
                      Please delete <b> {selectedImages.length - 1} </b> of them{' '}
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
                        <div className="flex-delete-image">
                          <div className="flex-number-image">
                            <p>{index + 1}</p>
                          </div>
                          <img src={image} height="50" width="50" alt="upload" />
                          <button className='button-adress' onClick={() => deleteHandler(image)}>
                            delete
                          </button>
                        </div>
                      </div>

                    )
                  })}
              </div>
            </div>
            :
            <div className='no-images-uploaded'>
              <p>No image yet...</p>
            </div>
        }
        {/* Generic Message Error */}
        {errors && errors.message && <small className='text-danger'>{errors.message}</small>}


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
          className='pass-input'
          onChange={handleChange}
          value={formFields.password_confirmation}
          placeholder="Confirm Password"
          required
        />
        {/* Error Message */}
        {
          errors && <small className='text-danger'>{errors}</small>
        }
        {
          passError && <small className='text-danger'>{passError}</small>
        }
        {/* Submit */}
        {postcodeError &&
          <div className='too-many-images'>
            <p className="error" ><span>Please enter a valid postcode</span></p>
            <p className='regular-button greyed-button' >Register</p>
          </div>
        }
        {postcodeData && selectedImages.length < 2 &&
          <button className='yellow-button'>Register</button>
        }
        {postcodeData && (selectedImages.length > 1) &&
          <div className='too-many-images'>
            <p className="error" ><span>Please keep only one image</span></p>
            <p className='regular-button greyed-button' >Register</p>
          </div>
        }
      </form >
      <br></br>
      <p>Already have an emporium account?</p>
      <button className='button-adress big-button-adress' onClick={goLogin}>Sign in</button>
    </main >
  )
}

export default Register