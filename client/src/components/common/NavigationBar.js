import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link, useNavigate } from 'react-router-dom'

import brandLogo from '../../assets/images/logo-figma3.png'

import cartLogo from '../../assets/images/cart2.png'
import cart from '../../assets/images/cart.png'
import arrow from '../../assets/images/arrow.png'
import bars from '../../assets/images/3bars.png'


import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

import { isAuthenticated, handleLogout, getToken, getPayload } from '../../helpers/auth'


function NavigationBar({ selected, typed, setSelected, setTyped, basketCounter, username }) {

  // ! State

  const [selectSize, setSelectSize] = useState('small')
  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  // ! Variables

  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub

  const showDropdownRight = (e) => {
    setShowRight(!showRight)
  }
  const hideDropdownRight = e => {
    setShowRight(false)
  }
  const showDropdownLeft = (e) => {
    setShowLeft(!showLeft)
  }
  const hideDropdownLeft = e => {
    setShowLeft(false)
  }

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`/api/auth/${currentUserId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setUserData(data)
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  const handleSelect = (e) => {

    setSelected(e.target.value)

    if (e.target.value.length < 6) {
      setSelectSize('small')
    } else if (e.target.value.length < 12) {
      setSelectSize('medium')
    } else {
      setSelectSize('big')
    }
  }

  const handleChange = (e) => {
    setTyped(e.target.value)
  }

  const navigate = useNavigate()

  // ! UseEffect

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <>
      <div className='flex-navs'>
        < Navbar className='navigation-flex'>
          <Nav className='nav-items-container' id='drop-mobile'>
            <NavDropdown className='basic-nav-dropdown hover-underline-animation2' title={<img src={bars}></img>} id="dropdown-right">

              <>
                <NavDropdown.Item as={Link} to='/' >Home</NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/profile' >Account</NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/orders' >Orders</NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/wish-list' >Saved For Later</NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/products/new' >Sell new item</NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/on-sale' >My on-sale items</NavDropdown.Item>

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleLogout(navigate)} >Sign Out</NavDropdown.Item>
              </>
            </NavDropdown>
          </Nav>
          <Navbar.Brand as={Link} className='nav-brand brand-logo hover-underline-animation1' to='/' id='logo-big-screen'><img src={brandLogo} /></Navbar.Brand>

          {!isAuthenticated() &&
            <Link className='nav-link' to='/login' >Sign in</ Link>
          }
          <div className='flex-search' id='top-search'>
            {selectSize === 'small' &&
              <select onChange={handleSelect} name="filter-style" className="select-nav select-small" value={selected}>
                <option value="All">All</option>
                <option value="Baby">Baby</option>
                <option value="Beauty">Beauty</option>
                <option value="Books">Books</option>
                <option value="Fashion">Fashion</option>
                <option value="Car & Motorbike">Car & Motorbike</option>
                <option value="CDs & Vinyl">CDs & Vinyl</option>
                <option value="Computers & Accessories">Computers & Accessories</option>
                <option value="DVD & Blu-ray">DVD & Blu-ray</option>
                <option value="Electronics & Photo">Electronics & Photo</option>
                <option value="Garden & Outdoors">Garden & Outdoors</option>
                <option value="Health & Personal care">Health & Personal care</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Industrial & Scientific">Industrial & Scientific</option>
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
              </select>
            }
            {selectSize === 'medium' &&
              <select onChange={handleSelect} name="filter-style" className="select-nav select-medium" value={selected}>
                <option value="All">All</option>
                <option value="Baby">Baby</option>
                <option value="Beauty">Beauty</option>
                <option value="Books">Books</option>
                <option value="Fashion">Fashion</option>
                <option value="Car & Motorbike">Car & Motorbike</option>
                <option value="CDs & Vinyl">CDs & Vinyl</option>
                <option value="Computers & Accessories">Computers & Accessories</option>
                <option value="DVD & Blu-ray">DVD & Blu-ray</option>
                <option value="Electronics & Photo">Electronics & Photo</option>
                <option value="Garden & Outdoors">Garden & Outdoors</option>
                <option value="Health & Personal care">Health & Personal care</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Industrial & Scientific">Industrial & Scientific</option>
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
              </select>
            }
            {selectSize === 'big' &&
              <select onChange={handleSelect} name="filter-style" className="select-nav select-big" value={selected}>
                <option value="All">All</option>
                <option value="Baby">Baby</option>
                <option value="Beauty">Beauty</option>
                <option value="Books">Books</option>
                <option value="Fashion">Fashion</option>
                <option value="Car & Motorbike">Car & Motorbike</option>
                <option value="CDs & Vinyl">CDs & Vinyl</option>
                <option value="Computers & Accessories">Computers & Accessories</option>
                <option value="DVD & Blu-ray">DVD & Blu-ray</option>
                <option value="Electronics & Photo">Electronics & Photo</option>
                <option value="Garden & Outdoors">Garden & Outdoors</option>
                <option value="Health & Personal care">Health & Personal care</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Industrial & Scientific">Industrial & Scientific</option>
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
              </select>
            }
            <input className='input-nav' type="text" placeholder='search' value={typed} onChange={handleChange} />
          </div>
          {isAuthenticated() &&
            <>
              <Nav className='nav-items-container' id='drop-desktop'>
                <NavDropdown className='basic-nav-dropdown hover-underline-animation2' title={userData ? <div className='flex-nav-account'><p>Hello, {username}</p><h5>Account & Lists</h5></div> : <p>ho</p>} id="dropdown-right">

                  <>
                    <NavDropdown.Item as={Link} to='/' >Home</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/profile' >Account</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/orders' >Orders</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/wish-list' >Saved For Later</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/products/new' >Sell new item</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/on-sale' >My on-sale items</NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => handleLogout(navigate)} >Sign Out</NavDropdown.Item>
                  </>
                </NavDropdown>
              </Nav>

            </>
          }
          {isAuthenticated() &&
            <Link className='nav-link nav-link-relative hover-underline-animation1' to='/basket' id='big-cart'>
              <img src={cartLogo} />
              <p>{basketCounter}</p>
            </Link>
          }
          {isAuthenticated() &&
            <Link className='nav-link nav-link-relative hover-underline-animation1' to='/basket' id='small-cart'>
              <img src={cart} />
              <p>{basketCounter}</p>
            </Link>
          }
          {!isAuthenticated() &&
            <Link className='nav-link hover-underline-animation1' to='/login' id='login-desktop'>Sign in</ Link>
          }
        </Navbar >
        <div id='nav-bottom'>
          <div className='flex-search'>
            {selectSize === 'small' &&
              <select onChange={handleSelect} name="filter-style" className="select-nav select-small" value={selected}>
                <option value="All">All</option>
                <option value="Baby">Baby</option>
                <option value="Beauty">Beauty</option>
                <option value="Books">Books</option>
                <option value="Fashion">Fashion</option>
                <option value="Car & Motorbike">Car & Motorbike</option>
                <option value="CDs & Vinyl">CDs & Vinyl</option>
                <option value="Computers & Accessories">Computers & Accessories</option>
                <option value="DVD & Blu-ray">DVD & Blu-ray</option>
                <option value="Electronics & Photo">Electronics & Photo</option>
                <option value="Garden & Outdoors">Garden & Outdoors</option>
                <option value="Health & Personal care">Health & Personal care</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Industrial & Scientific">Industrial & Scientific</option>
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
              </select>
            }
            {selectSize === 'medium' &&
              <select onChange={handleSelect} name="filter-style" className="select-nav select-medium" value={selected}>
                <option value="All">All</option>
                <option value="Baby">Baby</option>
                <option value="Beauty">Beauty</option>
                <option value="Books">Books</option>
                <option value="Fashion">Fashion</option>
                <option value="Car & Motorbike">Car & Motorbike</option>
                <option value="CDs & Vinyl">CDs & Vinyl</option>
                <option value="Computers & Accessories">Computers & Accessories</option>
                <option value="DVD & Blu-ray">DVD & Blu-ray</option>
                <option value="Electronics & Photo">Electronics & Photo</option>
                <option value="Garden & Outdoors">Garden & Outdoors</option>
                <option value="Health & Personal care">Health & Personal care</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Industrial & Scientific">Industrial & Scientific</option>
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
              </select>
            }
            {selectSize === 'big' &&
              <select onChange={handleSelect} name="filter-style" className="select-nav select-big" value={selected}>
                <option value="All">All</option>
                <option value="Baby">Baby</option>
                <option value="Beauty">Beauty</option>
                <option value="Books">Books</option>
                <option value="Fashion">Fashion</option>
                <option value="Car & Motorbike">Car & Motorbike</option>
                <option value="CDs & Vinyl">CDs & Vinyl</option>
                <option value="Computers & Accessories">Computers & Accessories</option>
                <option value="DVD & Blu-ray">DVD & Blu-ray</option>
                <option value="Electronics & Photo">Electronics & Photo</option>
                <option value="Garden & Outdoors">Garden & Outdoors</option>
                <option value="Health & Personal care">Health & Personal care</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Industrial & Scientific">Industrial & Scientific</option>
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
              </select>
            }
            <input className='input-nav' type="text" placeholder='search' value={typed} onChange={handleChange} />
          </div>
        </div>
      </div>
    </>
  )

}

export default NavigationBar