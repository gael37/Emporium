// import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link, useNavigate } from 'react-router-dom'

import brandLogo from '../../assets/images/logo-figma3.png'
import cartLogo from '../../assets/images/cart-logo.png'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

import { isAuthenticated, handleLogout, getToken, getPayload } from '../../helpers/auth'


function Nav2({ selected, typed, setSelected, setTyped, basketCounter, username }) {

  const [selectSize, setSelectSize] = useState('small')
  const [errors, setErrors] = useState(false)
  const [userData, setUserData] = useState(null)
  // const [basketCounter, setBasketCounter] = useState(0)

  getToken()
  const currentUserPayload = getPayload()
  const currentUserId = currentUserPayload.sub
  // console.log('user id', currentUserId)

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`api/auth/${currentUserId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      // const counter = data.basket.reduce((acc, obj) => {
      //   return acc + parseInt(obj.count)
      // }, 0)

      // console.log('basket counter, ', counter)
      // setBasketCounter(counter)
      setUserData(data)
    } catch (err) {
      console.log(err)
      setErrors(true)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  const handleSelect = (e) => {

    setSelected(e.target.value)

    if (e.target.value < 5) {
      setSelectSize('small')
    } else {
      setSelectSize('big')
    }
  }

  const handleChange = (e) => {
    setTyped(e.target.value)
  }

  const navigate = useNavigate()

  return (
    <>
      {selectSize === 'small' ?
        <div className='flex-navs'>
          < Navbar className='navigation-flex'>
            <Navbar.Brand as={Link} to='/' className='nav-brand brand-logo' id='logo-left'><img src={brandLogo} /></Navbar.Brand>
            {/* <Link className='nav-link' to='/trends' id='trend'>Trends</ Link> */}
            {isAuthenticated() &&
              <Nav className='nav-items-container' id='dropdown-left'>
                <NavDropdown className='nav-link basic-nav-dropdown' title={userData ? `Hello, ${username}` : 'Hello!'} id="dropdown-left">
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
            }


            <div className='flex-search' id='top-search'>
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
              <input className='input-nav' type="text" placeholder='search' value={typed} onChange={handleChange} />
            </div>
            {isAuthenticated() &&
              <Nav className='nav-items-container'>
                <NavDropdown className='basic-nav-dropdown' title={userData ? `Hello, ${username}` : 'Hello!'} id="dropdown-right">

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
            }
            <Navbar.Brand as={Link} className='nav-brand brand-logo' id='logo-right' to='/'><img src={brandLogo} /></Navbar.Brand>
            {isAuthenticated() ?
              <div className="nav-flex-p">
                <p>{basketCounter}</p>
                <Link className='nav-link nav-link-relative' to='/basket'><img src={cartLogo} /></ Link>
              </div>
              :
              <Link className='nav-link' to='/login'>Sign In</ Link>
            }
          </Navbar >
          <div id='nav-bottom'>
            <div className='flex-search'>
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
              <input className='input-nav' type="text" placeholder='search' value={typed} onChange={handleChange} />
            </div>
          </div>
        </div >
        :
        <div className='flex-navs'>
          < Navbar className='navigation-flex'>
            <Navbar.Brand as={Link} className='nav-brand brand-logo' id='logo-left' to='/'><img src={brandLogo} /></Navbar.Brand>
            {/* <Link className='nav-link' to='/trends' id='trend'>Trends</ Link> */}

            {isAuthenticated() &&
              <Nav className='nav-items-container' id='dropdown-left'>
                <NavDropdown className='nav-link basic-nav-dropdown' title={userData ? `Hello, ${username}` : 'Hello!'} id="dropdown-left">
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
            }

            <div className='flex-search' id='top-search'>
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
              <input className='input-nav' type="text" placeholder='search' value={typed} onChange={handleChange} />
            </div>

            {isAuthenticated() &&
              <Nav className='nav-items-container'>
                <NavDropdown className='nav-link basic-nav-dropdown' title={userData ? `Hello, ${username}` : 'Hello!'} id="dropdown-right">
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
            }

            <Navbar.Brand as={Link} className='nav-brand brand-logo' id='logo-right' to='/'><img src={brandLogo} /></Navbar.Brand>
            <div className="nav-flex-p">
              <p>{basketCounter}</p>
              <Link className='nav-link nav-link-relative' to='/basket'><img src={cartLogo} /></ Link>
            </div>
          </Navbar >
          <div id='nav-bottom'>
            <div className='flex-search'>
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
              <input className='input-nav' type="text" placeholder='search' value={typed} onChange={handleChange} />
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Nav2