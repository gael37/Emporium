import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'


import axios from 'axios'
import { getToken, getPayload } from '../../../helpers/auth'

import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Select from 'react-select'
import { options } from '../../../helpers/constants'


const EditProduct = () => {

  // ! State

  const [errors, setErrors] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [imagesCount, setImagesCount] = useState(0)
  const [firstFormFieldsLoad, setFirstFormFieldsload] = useState(false)

  const [selectValue, setSelectValue] = useState([])
  const [categoriesArray, setCategoriesArray] = useState([])
  const [selectArray, setSelectArray] = useState([])

  const [formFields, setFormFields] = useState({
    description: '',
    images: '',
    brand: '',
    dimensions: '',
    weight: '',
    about: '',
    price: '',
    categories: [],
  })

  const navigate = useNavigate()
  const currentUserId = getPayload().sub
  const categoriesArray1 = []
  const categoriesArray2 = []
  let imagesString = ''
  const a = useParams().productId
  let categoriesArray2WithoutDup = []



  // ! Execution

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${a}/`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        console.log('PRODUCT ON PAGE LOAD ⚱️', data)
        setFormFields(data)
        setFirstFormFieldsload(true)
      } catch (err) {
        console.log(err)
      }
    }
    getProduct()
  }, [])

  useEffect(() => {
    setImagesCount(formFields.images.split(' ').length)
    setSelectedImages(formFields.images.split(' '))
    console.log('CATEGORIES ON PRODUCT LOAD 𐩿:', formFields.categories)
    console.log('IMAGES ON P~RODUCT LOAD 🏙️:', formFields.images)
    setSelectValue((formFields.categories).map(({ name }) => ({ value: name, label: name })))
    setCategoriesArray((formFields.categories).map(({ name }) => name))

  }, [firstFormFieldsLoad])


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
      await axios.put(`/api/products/${a}/`, { ...formFields, images: imagesString, owner: currentUserId, categories: categoriesPKArray }, {
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
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    // Removing unneeded errors
    setErrors({ ...errors, [e.target.name]: '', message: '' })
  }

  const selectCategory = (e) => {
    console.log('e', e)
    for (let i = 0; i < e.length; i++) {
      categoriesArray2.push(e[i].value)
    }
    categoriesArray2WithoutDup = Array.from(new Set(categoriesArray2))
    setSelectValue((categoriesArray2WithoutDup).map((item) => ({ label: item, value: item })))
    setCategoriesArray(categoriesArray2WithoutDup)
  }



  function deleteHandler(image) {
    setSelectedImages(selectedImages.filter((e) => e !== image))
  }


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

  return (
    <main className="form-page">
      <Container className='mt-4'>
        <Row>
          <div className='div-form col-10 offset-1 col-md-6 offset-md-3 col-lg-4 offset-lg-4'>
            <form className='form-perso' onSubmit={handleSubmit}>
              <h1>Edit Product Ad</h1>
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
              {/* Brand */}
              <label htmlFor="name">Brand</label>
              <input
                className='form-input'
                type="text"
                name="brand"
                onChange={handleChange}
                value={formFields.brand}
                placeholder="Brand"
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
              {/* Categories */}
              <div className='post-cat'>
                <p>Categorize your ad:</p>
                {formFields &&
                  <Select value={selectValue} className='select-input' options={options} isClearable={true} isMulti onChange={selectCategory} />
                }
              </div>
              {errors && errors.description && <small className='text-danger'>{errors.description}</small>}
              {/* Images */}
              {/* <p>Images: {imagesCount}</p>
              <div className='flex-images-pre'>
                {formFields.images ?
                  (formFields.images.split(' ')).map((image, index) => {
                    return (
                      <div key={index} className="profile-card-image bottom-images" style={{ backgroundImage: `url(${ image })` }}></div>
                    )
                  })
                  :
                  <p>none</p>
                }
              </div> */}
              <label>Upload up to 10 images for your ad:</label>
              <section>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input className="blog-form-input" {...getInputProps()} />
                  <div className="blog-form-input">
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
                    <p>Image{selectedImages.length === 1 ? '' : 's'} uploaded! ✅</p>
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

export default EditProduct