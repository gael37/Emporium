// import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link } from 'react-router-dom'

import brandLogo from '../../assets/images/brand-logo.png'
// import cartLogo from '../../assets/images/cart-logo.png'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
function Navigation() {

  const [select, setSelect] = useState('small')

  const handleChange = (e) => {
    if (e.target.value < 5) {
      setSelect('small')
    } else {
      setSelect('big')
    }
  }


  return (
    <div className='flex-navs'>
      < Navbar className='navigation-flex'>
        <Navbar.Brand className='nav-brand brand-logo' id='logo-left' to='/'><img src={brandLogo} /></Navbar.Brand>
        <Link className='nav-link' to='/trends' id='trend'>Trends</ Link>
        <Nav className='nav-items-container' id='dropdown-left'>
          <NavDropdown className='nav-link basic-nav-dropdown' title="Hi!" id="dropdown-left">
            <NavDropdown.Item as={Link} to='/account' >Account</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/orders' >Orders</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/wish-list' >Wish List</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/sell' >Sell</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to='/sign-out' >
              Sign Out
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        {/* <Link className='nav-link' to='/sell' id="sell-big">Sell</ Link> */}
        <div className='flex-search' id='top-search'>
          {select === 'small' ?
            <select onChange={handleChange} name="filter-style" className="select-small">
              <option value="0">All</option>
              <option value="1">Baby</option>
              <option value="2">Beauty</option>
              <option value="3">Books</option>
              <option value="4">Fashion</option>
              <option value="5">Car & Motorbike</option>
              <option value="6">CDs & Vinyl</option>
              <option value="7">Computers & Accessories</option>
              <option value="8">DVD & Blu-ray</option>
              <option value="9">Electronics & Photo</option>
              <option value="10">Garden & Outdoors</option>
              <option value="11">Health & Personal care</option>
              <option value="12">Home & Kitchen</option>
              <option value="13">Industrial & Scientific</option>
              <option value="14">Large Appliances</option>
              <option value="15">Luggage & Travel Gear</option>
              <option value="16">Musical Instruments</option>
              <option value="17">PC & Video Games</option>
              <option value="18">Pet Supplies</option>
              <option value="19">Sports & Outdoors</option>
              <option value="20">Stationary & Office Supplies</option>
              <option value="21">Toys & Games</option>
            </select>
            :
            <select onChange={handleChange} name="filter-style" className="select-big">
              <option value="0">All</option>
              <option value="1">Baby</option>
              <option value="2">Beauty</option>
              <option value="3">Books</option>
              <option value="4">Fashion</option>
              <option value="5">Car & Motorbike</option>
              <option value="6">CDs & Vinyl</option>
              <option value="7">Computers & Accessories</option>
              <option value="8">DVD & Blu-ray</option>
              <option value="9">Electronics & Photo</option>
              <option value="10">Garden & Outdoors</option>
              <option value="11">Health & Personal care</option>
              <option value="12">Home & Kitchen</option>
              <option value="13">Industrial & Scientific</option>
              <option value="14">Large Appliances</option>
              <option value="15">Luggage & Travel Gear</option>
              <option value="16">Musical Instruments</option>
              <option value="17">PC & Video Games</option>
              <option value="18">Pet Supplies</option>
              <option value="19">Sports & Outdoors</option>
              <option value="20">Stationary & Office Supplies</option>
              <option value="21">Toys & Games</option>
            </select>
          }
          <input type="text" placeholder='search' />
        </div>
        <Nav className='nav-items-container'>
          {/* <Link className='nav-link' to='/sell' id='sell-small'>Sell</ Link> */}
          <NavDropdown className='nav-link basic-nav-dropdown' title="Hi!" id="dropdown-right">
            <NavDropdown.Item as={Link} to='/account' >Account</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/orders' >Orders</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/wish-list' >Wish List</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/sell' >Sell</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to='/sign-out' >
              Sign Out
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Navbar.Brand className='nav-brand brand-logo' id='logo-right' to='/'><img src={brandLogo} /></Navbar.Brand>
        <div className="nav-flex-p">
          <p>0</p>
          <Link className='nav-link nav-link-relative' to='/'><img src={cartLogo} /></ Link>
        </div>
      </Navbar >
      <div id='nav-bottom'>
        <div className='flex-search'>
          {select === 'small' ?
            <select onChange={handleChange} name="filter-style" className="select-small">
              <option value="0">All</option>
              <option value="1">Baby</option>
              <option value="2">Beauty</option>
              <option value="3">Books</option>
              <option value="4">Fashion</option>
              <option value="5">Car & Motorbike</option>
              <option value="6">CDs & Vinyl</option>
              <option value="7">Computers & Accessories</option>
              <option value="8">DVD & Blu-ray</option>
              <option value="9">Electronics & Photo</option>
              <option value="10">Garden & Outdoors</option>
              <option value="11">Health & Personal care</option>
              <option value="12">Home & Kitchen</option>
              <option value="13">Industrial & Scientific</option>
              <option value="14">Large Appliances</option>
              <option value="15">Luggage & Travel Gear</option>
              <option value="16">Musical Instruments</option>
              <option value="17">PC & Video Games</option>
              <option value="18">Pet Supplies</option>
              <option value="19">Sports & Outdoors</option>
              <option value="20">Stationary & Office Supplies</option>
              <option value="21">Toys & Games</option>
            </select>
            :
            <select onChange={handleChange} name="filter-style" className="select-big">
              <option value="0">All</option>
              <option value="1">Baby</option>
              <option value="2">Beauty</option>
              <option value="3">Books</option>
              <option value="4">Fashion</option>
              <option value="5">Car & Motorbike</option>
              <option value="6">CDs & Vinyl</option>
              <option value="7">Computers & Accessories</option>
              <option value="8">DVD & Blu-ray</option>
              <option value="9">Electronics & Photo</option>
              <option value="10">Garden & Outdoors</option>
              <option value="11">Health & Personal care</option>
              <option value="12">Home & Kitchen</option>
              <option value="13">Industrial & Scientific</option>
              <option value="14">Large Appliances</option>
              <option value="15">Luggage & Travel Gear</option>
              <option value="16">Musical Instruments</option>
              <option value="17">PC & Video Games</option>
              <option value="18">Pet Supplies</option>
              <option value="19">Sports & Outdoors</option>
              <option value="20">Stationary & Office Supplies</option>
              <option value="21">Toys & Games</option>
            </select>
          }
          <input type="text" placeholder='search' />
        </div>
      </div>
    </div >
  )
}

export default Navigation