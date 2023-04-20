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


const Register = () => {

  // ! Location Variables
  // useNavigate() executed returns back the function we need to use to navigate around our React App
  const navigate = useNavigate()

  // ! State
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
      navigate('/login')
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

  const onDrop = useCallback(files => setFiles(files), [setFiles])

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

  return (
    <div className='register-page-wrapper'>
      <main className="form-page">
        <Container className='mt-4'>
          <Row>
            <div className='col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4'>
              <form onSubmit={handleSubmit}>
                <h1>Register</h1>
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
                <label htmlFor="email">Postcode <span>*</span></label>
                <input
                  type="text"
                  name="postcode"
                  onChange={handleChangePostcode}
                  value={formFields.postcode}
                  placeholder="Postcode"
                  required
                />
                {postcodeData ?
                  <p>POSTCODE VALID! ✅</p>
                  :
                  <p>Oops! That does not appear to be a valid postcode 🙊</p>}
                {/* Image */}
                <label>Upload a profile image:</label>
                <section>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input className="blog-form-input" {...getInputProps()} />
                    <div className="blog-form-input">
                      {isDragActive ?
                        <p className="dropzone-content">
                          Release to drop the file here</p>
                        :
                        <p className="dropzone-content">
                          Drag and drop your image here, or click this box
                        </p>
                      }
                    </div>
                  </div>
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
                </section>
                {/* Generic Message Error */}
                {errors && errors.message && <small className='text-danger'>{errors.message}</small>}
                {/* Upload status */}
                {selectedImages.length > 0 &&
                  (selectedImages.length > 1 ? (
                    <p className="error" >Oops! Looks like you have selected too many images!</p>
                  ) : (
                    <p className="error" >Image succesfully uploaded! ✅</p>
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
                {errors && <small className='text-danger'>{errors}</small>
                }
                {passError && <small className='text-danger'>{passError}</small>
                }
                {/* Submit */}
                {selectedImages.length > 0 &&
                  (selectedImages.length > 1 ? (
                    <>
                      <p className="error" >Keep only one image if you wan&apos;t to create an account!</p>
                      <button className='btn-form' >Register greyed out</button>
                    </>
                  ) : (
                    <button className='btn-form' >Register</button>
                  ))}
              </form>
            </div>
          </Row>
        </Container>
      </main>
    </div >
  )
}

export default Register