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
import dropImage from '../../../assets/images/drop.png'

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
      <h1>Please fill this product form</h1>
      <form className='form-perso' onSubmit={handleSubmit}>
        <div className="flex-form-product-sections">
          <div className='half-page'>
            <section className='form-section'>

              {/* Description */}
              <div>
                <label htmlFor="name">Title/Description<span>*</span></label>
                <input
                  className='form-input description-input'
                  type="text"
                  name="description"
                  onChange={handleChange}
                  value={formFields.description}
                  // placeholder="Description"
                  required
                />
              </div>


              {/* Price */}
              <div>
                <label htmlFor="name">Price<span>*</span></label>
                <input
                  className='form-input'
                  type="text"
                  name="price"
                  onChange={handleChange}
                  value={formFields.price}
                  // placeholder="Price"
                  required
                />
              </div>
              <label htmlFor="name">Category (at least one)<span>*</span></label>
              <Select name="category" className='select-input' options={options} isClearable={true} isMulti onChange={selectCategory} />

              {/* Dimensions */}
              <div>
                <label htmlFor="name">Dimensions</label>
                <input
                  className='form-input'
                  type="text"
                  name="dimensions"
                  onChange={handleChange}
                  value={formFields.dimensions}
                // placeholder="Dimensions"
                />
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="name">Weight</label>
                <input
                  className='form-input'
                  type="text"
                  name="weight"
                  onChange={handleChange}
                  value={formFields.weight}
                // placeholder="Weight"
                />
              </div>





              {/* Stripe id */}
              {/* <label htmlFor="name">Stripe</label>
              <input
                className='form-input'
                type="text"
                name="stripe_id"
                onChange={handleChange}
                value={formFields.stripe_id}
                placeholder="Stripe_id"
              /> */}
              {/* Categories */}
            </section>
          </div>

          <div className='half-page'>
            <section className='form-section'>
              {/* About */}

              <div>
                <label htmlFor="name">Additional information (start each paragraph with &quot;- &quot;)</label>
                <input
                  className='form-input form-input-about'
                  type="text"
                  name="about"
                  onChange={handleChange}
                  value={formFields.about}
                // placeholder="Start each paragraph with '- ' for an optimal display"
                />
              </div>
            </section>
          </div>
          <div className='half-page'>
            <section className='form-section-start'>
              {/* <div className='post-cat'>
                <p>Categorize your ad:</p>
                <Select className='select-input' options={options} isClearable={true} isMulti onChange={selectCategory} />
              </div> */}
              {errors && errors.description && <small className='text-danger'>{errors.description}</small>}
              {/* Images */}
              <p>Upload an image of your product<span>*</span> (up to 10)</p>
              <div className='section-upload'>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input className="blog-form-input" {...getInputProps()} />
                  <div className="dropzone-flex">
                    {isDragActive ?
                      <p className="dropzone-content">
                        Release to drop the files here</p>
                      :
                      <div className="dropzone-content">
                        <p>Drag and drop your images here<br></br>or click this box</p>
                        <img src={dropImage}></img>
                      </div>
                    }
                  </div>
                </div>
              </div>
              {loading &&
                <div className='flex-loading'>
                  <img className='loading-gif' src={gif} alt='loading'></img>
                  <p>Uploading images, please wait...</p>
                </div>
              }
              {selectedImages.length > 0 ?
                <div className='images-uploaded'>
                  {/* <p>Images uploaded</p> */}
                  {selectedImages.length > 0 &&
                    (selectedImages.length > 10 ? (
                      <p className="error">
                        You can&apos;t upload more than 10 images! <br />
                        <span>
                          Please delete <b> {selectedImages.length - 10} </b> of them{' '}
                        </span>
                      </p>
                    ) : (
                      <p className='success-upload'>Image{selectedImages.length === 1 ? '' : 's'} succesfully uploaded! ✅</p>
                    ))}

                  <div className="images">
                    {selectedImages.length > 0 &&
                      selectedImages.map((image, index) => {
                        return (
                          <div key={image} className="image">
                            <div className="flex-delete-image">
                              <div className="flex-number-image">
                                <p>{index + 1}</p>
                                <img src={image} height="50" width="50" alt="upload" />
                              </div>
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
                  <p>No images yet...</p>
                </div>
              }


            </section>




          </div>
        </div>

        {/* Generic Message Error */}
        {errors && errors.message && <small className='text-danger'>{errors.message}</small>}
        {/* Submit */}
        {/* {selectedImages.length > 0 &&
          (selectedImages.length > 10 ? (
            <div className='flex-cannot-submit'>
              <p className="error" >Looks like you have uploaded too many images!</p>
              <button className='greyed-button lower-button' >Sell my product now</button>
            </div>
          ) : (
            <button className='yellow-button lower-button' >Sell my product now</button>
          ))} */}
        {selectedImages.length > 0 && selectedImages.length > 10 &&

          <div className='flex-cannot-submit'>
            <button className='no-button lower-button' >Sell my product now</button>
            <p className="error" >You have uploaded too many images!</p>
          </div>

        }
        {selectedImages.length < 1 &&

          <div className='flex-cannot-submit'>
            <button className='no-button lower-button' >Sell my product now</button>
            <p className="error" >Upload at least one image</p>
          </div>

        }
        {selectedImages.length > 0 && selectedImages.length < 11 &&

          <button className='yellow-button lower-button' >Sell my product now</button>


        }




        {/* <button className='yellow-button lower-button' >Sell my product now</button> */}
      </form>

    </main >
  )

}

export default NewProduct