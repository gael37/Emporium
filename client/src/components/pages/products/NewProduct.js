import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { getToken, getPayload } from '../../../helpers/auth'

import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Select from 'react-select'
import { options } from '../../../helpers/constants'

import gif from '../../../assets/gifs/loading4.gif'

const NewProduct = () => {

  // ! State

  const [errors, setErrors] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [loading, setLoading] = useState(false)

  const [formFields, setFormFields] = useState({
    description: '',
    images: '',
    brand: '',
    dimensions: '',
    weight: '',
    about: '',
    price: '',
    stripe_id: '',
  })

  const navigate = useNavigate()

  const currentUserId = getPayload().sub
  console.log('current user id: ', currentUserId)

  const [categoriesArray, setCategoriesArray] = useState([])
  let array = []
  let imagesString = ''


  // ! Execution
  const handleSubmit = async (e) => {
    e.preventDefault()
    imagesString = selectedImages.join(' ')
    const categoriesPKArray = categoriesArray.map(item => {
      if (item === 'Baby') {
        return 1
      } else if (item === 'Beauty') {
        return 2
      } else if (item === 'Books') {
        return 3
      } else if (item === 'Fashion') {
        return 4
      } else if (item === 'Car & Motorbike') {
        return 5
      } else if (item === 'CDs & Vinyl') {
        return 6
      } else if (item === 'Computers & Accessories') {
        return 7
      } else if (item === 'DVD & Blu-ray') {
        return 8
      } else if (item === 'Electronics & Photo') {
        return 9
      } else if (item === 'Garden & Outdoors') {
        return 10
      } else if (item === 'Health & Personal care') {
        return 11
      } else if (item === 'Home & Kitchen') {
        return 12
      } else if (item === 'Industrial & Scientific') {
        return 13
      } else if (item === 'Large Appliances') {
        return 14
      } else if (item === 'Luggage & Travel Gear') {
        return 15
      } else if (item === 'Musical Instruments') {
        return 16
      } else if (item === 'Video Games & Consoles') {
        return 17
      } else if (item === 'Pet Supplies') {
        return 18
      } else if (item === 'Sports & Outdoors') {
        return 19
      } else if (item === 'Stationary & Office Supplies') {
        return 10
      } else if (item === 'Toys & Games') {
        return 21
      }
    }
    )
    try {
      console.log('form fields', formFields)
      await axios.post('/api/products/', { ...formFields, images: imagesString, owner: currentUserId, categories: categoriesPKArray }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('Product posted ✅')
      navigate('/')
    } catch (err) {
      console.log(err.response.data)
      setErrors(err.response.data)
    }
  }

  const handleChange = (e) => {
    // console.log(`${e.target.name}: ${e.target.value}`)
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    // Removing unneeded errors
    setErrors({ ...errors, [e.target.name]: '', message: '' })
  }

  const selectCategory = (e) => {
    array = []
    console.log('e', e)
    for (let i = 0; i < e.length; i++) {
      array.push(e[i].value)
    }
    setCategoriesArray(array)
  }

  function deleteHandler(image) {
    setSelectedImages(selectedImages.filter((e) => e !== image))
    URL.revokeObjectURL(image)
  }


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

  return (
    <main className="form-page">
      <Container className='mt-4'>
        <Row>
          <div className='div-form col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4'>
            <form className='form-perso' onSubmit={handleSubmit}>
              <h1>New product</h1>
              {/* Description */}
              <label htmlFor="name">Description<span>*</span></label>
              <input
                className='form-input'
                type="text"
                name="description"
                onChange={handleChange}
                value={formFields.description}
                placeholder="Description"
                required
              />
              {/* Dimensions */}
              <label htmlFor="name">Dimensions</label>
              <input
                className='form-input'
                type="text"
                name="dimensions"
                onChange={handleChange}
                value={formFields.dimensions}
                placeholder="Dimensions"
              />
              {/* Weight */}
              <label htmlFor="name">Weight</label>
              <input
                className='form-input'
                type="text"
                name="weight"
                onChange={handleChange}
                value={formFields.weight}
                placeholder="Weight"
              />
              {/* About */}
              <label htmlFor="name">About</label>
              <input
                className='form-input'
                type="text"
                name="about"
                onChange={handleChange}
                value={formFields.about}
                placeholder="About"
              />
              {/* Price */}
              <label htmlFor="name">Price<span>*</span></label>
              <input
                className='form-input'
                type="text"
                name="price"
                onChange={handleChange}
                value={formFields.price}
                placeholder="Price"
                required
              />
              {/* Stripe id */}
              <label htmlFor="name">Stripe</label>
              <input
                className='form-input'
                type="text"
                name="stripe_id"
                onChange={handleChange}
                value={formFields.stripe_id}
                placeholder="Stripe_id"
              />
              {/* Categories */}
              <div className='post-cat'>
                <p>Categorize your ad:</p>
                <Select className='select-input' options={options} isClearable={true} isMulti onChange={selectCategory} />
              </div>
              {errors && errors.description && <small className='text-danger'>{errors.description}</small>}
              {/* Images */}
              <label>Upload up to 10 images for your ad:</label>
              <section className='section-upload'>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input className="blog-form-input" {...getInputProps()} />
                  <div className="dropzone-flex">
                    {isDragActive ?
                      <p className="dropzone-content">
                        Release to drop the files here</p>
                      :
                      <p className="dropzone-content">
                        Drag and drop your images here, or click this box
                      </p>
                    }
                  </div>
                </div>
                {selectedImages.length > 0 &&
                  (selectedImages.length > 10 ? (
                    <p className="error">
                      You can&apos;t upload more than 10 images! <br />
                      <span>
                        please delete <b> {selectedImages.length - 10} </b> of them{' '}
                      </span>
                    </p>
                  ) : (
                    <p>Image{selectedImages.length === 1 ? '' : 's'} succesfully uploaded! ✅</p>
                  ))}

                <div className="images">
                  {selectedImages.length > 0 &&
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
                  {loading &&
                    <div className='flex-loading'>
                      <img className='loading-gif' src={gif} alt='loading'></img>
                      <p>Uploading images, please wait...</p>
                    </div>
                  }
                </div>
              </section>
              {/* Generic Message Error */}
              {errors && errors.message && <small className='text-danger'>{errors.message}</small>}
              {/* Submit */}
              {selectedImages.length > 0 &&
                (selectedImages.length > 10 ? (
                  <p className="error" >Post my ad</p>
                ) : (
                  <button className='btn-form' >Post my adv</button>
                ))}
            </form>
          </div>
        </Row>
      </Container>
    </main>
  )

}

export default NewProduct