import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link, useNavigate } from 'react-router-dom'

import brandLogo from '../../assets/images/logo-figma3.png'

import cartLogo from '../../assets/images/cart2.png'
import cart from '../../assets/images/cart.png'
import arrow from '../../assets/images/arrow.png'
import bars from '../../assets/images/3bars.png'
import sell from '../../assets/images/sell.png'
import account from '../../assets/images/account.png'
import home from '../../assets/images/home.png'
import orders from '../../assets/images/orders.png'
import wishlist from '../../assets/images/wishlist.png'
import onSale from '../../assets/images/on-sale.png'
import logout from '../../assets/images/logout.png'


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
            <NavDropdown className='basic-nav-dropdown hover-underline-animation2' title={<img className='img-nav-bars' src={bars}></img>} id="dropdown-small">

              <>
                {/* <NavDropdown.Item as={Link} to='/' ><div className='flex-nav-item'><img src={home} className='img-nav padding-bottom-xs' />Home</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/profile' ><div className='flex-nav-item'><img src={account} className='img-nav' />Account</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/orders' ><div className='flex-nav-item'><img src={orders} className='img-nav' />Orders</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/wish-list' ><div className='flex-nav-item'><img src={wishlist} className='img-nav' />Wishlist</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/products/new' ><div className='flex-nav-item'><img src={sell} className='img-nav' />Sell new item</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/on-sale' ><div className='flex-nav-item flex-nav-item-no-padding'><img src={onSale} className='img-nav' />On-sale items</div></NavDropdown.Item> */}
                <NavDropdown.Item as={Link} to='/' ><div className='flex-nav-item'>Home</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/profile' ><div className='flex-nav-item'>Account</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/orders' ><div className='flex-nav-item'>Orders</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/wish-list' ><div className='flex-nav-item'>Wishlist</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/products/new' ><div className='flex-nav-item'>Sell new item</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/on-sale' ><div className='flex-nav-item flex-nav-item-no-padding'>On-sale items</div></NavDropdown.Item>

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleLogout(navigate)} ><div className='flex-nav-item'><img src={logout} />Sign Out</div></NavDropdown.Item>
              </>
            </NavDropdown>
          </Nav>
          <Navbar.Brand as={Link} className='nav-brand brand-logo' to='/' id='logo-big-screen'><img src={brandLogo} /></Navbar.Brand>

          {/* {!isAuthenticated() &&
            <Link className='nav-link' to='/login' >Sign in</ Link>
          } */}
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
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Others">Others</option>
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
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Others">Others</option>
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
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Others">Others</option>
              </select>
            }
            <input className='input-nav' type="text" placeholder='search' value={typed} onChange={handleChange} />
          </div>
          {isAuthenticated() &&
            <>
              <Nav className='nav-items-container' id='drop-desktop'>
                <NavDropdown id='dropdown-right' className='basic-nav-dropdown hover-underline-animation2' title={userData ? <div className='flex-nav-account'><p>Hello, {username}</p><h5>Account & Lists</h5></div> : <p>ho</p>}>

                  <>
                    {/* <NavDropdown.Item as={Link} to='/' ><div className='flex-nav-item'><img src={home} className='img-nav padding-bottom-xs' />Home</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/profile' ><div className='flex-nav-item'><img src={account} className='img-nav' />Account</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/orders' ><div className='flex-nav-item'><img src={orders} className='img-nav' />Orders</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/wish-list' ><div className='flex-nav-item'><img src={wishlist} className='img-nav' />Wishlist</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/products/new' ><div className='flex-nav-item'><img src={sell} className='img-nav' />Sell new item</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/on-sale' ><div className='flex-nav-item flex-nav-item-no-padding'><img src={onSale} className='img-nav' />On-sale items</div></NavDropdown.Item> */}
                    <NavDropdown.Item as={Link} to='/' ><div className='flex-nav-item'>Home</div></NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/profile' ><div className='flex-nav-item'>Account</div></NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/orders' ><div className='flex-nav-item'>Orders</div></NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/wish-list' ><div className='flex-nav-item'>Wishlist</div></NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/products/new' ><div className='flex-nav-item'>Sell new item</div></NavDropdown.Item>
                    <NavDropdown.Item as={Link} to='/on-sale' ><div className='flex-nav-item flex-nav-item-no-padding'>On-sale items</div></NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => handleLogout(navigate)} ><div className='flex-nav-item'><img src={logout} />Sign Out</div></NavDropdown.Item>
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
            <Link className='nav-link hover-underline-animation2' to='/login' id='login-link'>Sign in</ Link>
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
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Others">Others</option>
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
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Others">Others</option>
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
                <option value="Large Appliances">Large Appliances</option>
                <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Consoles & Video Games">Consoles & Video Games</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Stationary & Office Supplies">Stationary & Office Supplies</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Others">Others</option>
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