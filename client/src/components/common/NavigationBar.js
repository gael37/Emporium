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

  const navigate = useNavigate()

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



  // const navigate = useNavigate()

  // ! UseEffect

  useEffect(() => {
    getUserData()
  }, [])

  useEffect(() => {
    // navigate('/')
  }, [selected])



  return (
    < Navbar className='navigation-flex'>
      <div className='flex-navig'>
        <Nav className='nav-items-container' id='drop-mobile'>
          <NavDropdown className='basic-nav-dropdown hover-underline-animation2' title={<img className='img-nav-bars' src={bars}></img>} id="dropdown-small">
            {isAuthenticated() &&
              <>
                {/* <NavDropdown.Item as={Link} to='/' ><div className='flex-nav-item'><img src={home} className='img-nav padding-bottom-xs' />Home</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/profile' ><div className='flex-nav-item'><img src={account} className='img-nav' />Account</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/orders' ><div className='flex-nav-item'><img src={orders} className='img-nav' />Orders</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/wish-list' ><div className='flex-nav-item'><img src={wishlist} className='img-nav' />Wishlist</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/products/new' ><div className='flex-nav-item'><img src={sell} className='img-nav' />Sell new item</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/on-sale' ><div className='flex-nav-item flex-nav-item-no-padding'><img src={onSale} className='img-nav' />On-sale items</div></NavDropdown.Item> */}
                < NavDropdown.Item as={Link} to='/home-user' ><div className='flex-nav-item'>Browse</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/profile' ><div className='flex-nav-item'>Account</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/orders' ><div className='flex-nav-item'>Orders</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/wish-list' ><div className='flex-nav-item'>Wishlist</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/products/new' ><div className='flex-nav-item'>Sell new item</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/on-sale' ><div className='flex-nav-item flex-nav-item-no-padding'>On-sale items</div></NavDropdown.Item>

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleLogout(navigate)} ><div className='flex-nav-item'><img src={logout} />Sign Out</div></NavDropdown.Item>

              </>
            }
            {!isAuthenticated() &&
              <>
                <NavDropdown.Item as={Link} to='/' ><div className='flex-nav-item'>Browse</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/login' ><div className='flex-nav-item'>Sign in</div></NavDropdown.Item>
              </>
            }
          </NavDropdown>
        </Nav>
        {isAuthenticated() ?
          <Navbar.Brand as={Link} className='nav-brand brand-logo' to='/home-user' id='logo-big-screen'><img src={brandLogo} /></Navbar.Brand>
          :
          <Navbar.Brand as={Link} className='nav-brand brand-logo' to='/' id='logo-big-screen'><img src={brandLogo} /></Navbar.Brand>
        }
      </div>
      <div className='flex-cart-links'>
        <div className='navigation-items'>
          <Link className='nav-link nav-link-relative hover-underline-animation1' to='/home-user' id='big-cart'>Browse</Link>
          {isAuthenticated() &&
            <Link className='nav-link nav-link-relative hover-underline-animation1' to='/products/new' id='big-cart'>Sell</Link>
          }
          {isAuthenticated() &&
            <Nav className='nav-items-container' id='drop-desktop'>
              <NavDropdown className='basic-nav-dropdown hover-underline-animation2' title='Account' id="dropdown-small">
                <>
                  {/* <NavDropdown.Item as={Link} to='/' ><div className='flex-nav-item'><img src={home} className='img-nav padding-bottom-xs' />Home</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/profile' ><div className='flex-nav-item'><img src={account} className='img-nav' />Account</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/orders' ><div className='flex-nav-item'><img src={orders} className='img-nav' />Orders</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/wish-list' ><div className='flex-nav-item'><img src={wishlist} className='img-nav' />Wishlist</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/products/new' ><div className='flex-nav-item'><img src={sell} className='img-nav' />Sell new item</div></NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/on-sale' ><div className='flex-nav-item flex-nav-item-no-padding'><img src={onSale} className='img-nav' />On-sale items</div></NavDropdown.Item> */}
                  <NavDropdown.Item as={Link} to='/profile' ><div className='flex-nav-item'>Overview</div></NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/orders' ><div className='flex-nav-item'>Orders</div></NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/wish-list' ><div className='flex-nav-item'>Wishlist</div></NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/on-sale' ><div className='flex-nav-item flex-nav-item-no-padding'>Products for sale</div></NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => handleLogout(navigate)} ><div className='flex-nav-item'><img src={logout} />Sign Out</div></NavDropdown.Item>
                </>
              </NavDropdown>
            </Nav>
          }
          {/* <Link className='nav-link nav-link-relative hover-underline-animation1' to='/profile' id='big-cart'>Account</Link>
          <Link className='nav-link nav-link-relative hover-underline-animation1' to='/orders' id='big-cart'>Orders</Link>
          <Link className='nav-link nav-link-relative hover-underline-animation1' to='/wish-list' id='big-cart'>Wishlist</Link> */}
        </div>
        {isAuthenticated() &&
          <Link className='nav-link nav-link-relative hover-underline-animation1' to='/basket' id='big-cart'>
            <img src={cartLogo} />
            {basketCounter.toString().length > 1 ?
              <h5>{basketCounter}</h5>
              :
              <p>{basketCounter}</p>
            }

          </Link>
        }
        {isAuthenticated() &&
          <Link className='nav-link nav-link-relative hover-underline-animation1' to='/basket' id='small-cart'>
            <img src={cart} />
            {basketCounter.toString().length > 1 ?
              <h5>{basketCounter}</h5>
              :
              <p>{basketCounter}</p>
            }
          </Link>
        }
        {!isAuthenticated() &&
          <Link className='nav-link hover-underline-animation2' to='/login' id='login-link'>Sign in</ Link>
        }
      </div>


      {/* {!isAuthenticated() &&
            <Link className='nav-link' to='/login' >Sign in</ Link>
          } */}




    </Navbar >
  )

}

export default NavigationBar