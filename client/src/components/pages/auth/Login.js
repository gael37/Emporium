import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Imports
import axios from 'axios'
import { setToken } from '../../../helpers/auth'

// Bootstrap Components
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import logoSlogan from '../../../assets/images/logo-figma2.png'
const Login = () => {

  const [passError, setPassError] = useState('')
  // ! Location Variables
  const navigate = useNavigate()

  // ! State
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  // ! Executions
  const handleChange = (e) => {
    setError('')
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login/', formFields)
      console.log(data)
      console.log(data.token)
      setToken(data.token)
      navigate('/')
    } catch (err) {
      console.log(err)
      setError('Invalid credentials')
    }
  }

  const goRegister = () => {
    navigate('/register')
  }

  const loginAsGuest = async () => {
    setFormFields({
      email: 'guest@email.com',
      password: 'TestPass37!',
    })
    try {
      const { data } = await axios.post('/api/auth/login/', formFields)
      console.log(data)
      console.log(data.token)
      setToken(data.token)
      navigate('/')
    } catch (err) {
      console.log(err)
      setError('')
    }
  }

  // ! JSX
  return (

    <main className="login-form-page">
      <div className='login-form-page-image'>
        <img src={logoSlogan} />
      </div>
      <form className="login-form" onSubmit={handleSubmit} id='login-form'>
        <h1>Sign in</h1>
        {/* Email */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          // className='login-input'
          onChange={handleChange}
          value={formFields.email}
          placeholder="Email Address"
          required
        />
        {/* Password */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          // className='login-input'

          onChange={handleChange}
          value={formFields.password}
          placeholder="Password"
          required
        />
        {/* Error Message */}
        {error && <small className='text-danger'>{error}</small>}
        {/* Submit */}
        <button className='yellow-button login-button'>Sign in</button>
        <button onClick={loginAsGuest} className='yellow-button login-button green-button'>Skip and sign in as a guest</button>
      </form>
      <br />
      <p>New to emporium?</p>
      <button className='button-adress big-button-adress' onClick={goRegister}>Create your emporium account</button>
    </main>
  )
}

export default Login