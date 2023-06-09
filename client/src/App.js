import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Container from 'react-bootstrap/Container'

import NavigationBar from './components/common/NavigationBar'

import Home from './components/pages/Home'
import WishList from './components/pages/profile/WishList'
import SingleProduct from './components/pages/products/SingleProduct'
import EditProduct from './components/pages/products/EditProduct'
import DeleteProduct from './components/pages/products/DeleteProduct'
import Login from './components/pages/auth/Login'
import LoginAfterRegister from './components/pages/auth/LoginAfterRegister'
import Register from './components/pages/auth/Register'
import Profile from './components/pages/profile/Profile'
import EditProfile from './components/pages/profile/EditProfile'
import DeleteProfile from './components/pages/profile/DeleteProfile'
import NewProduct from './components/pages/products/NewProduct'
import AreYouSure from './components/pages/profile/AreYouSure'
import Basket from './components/pages/profile/Basket'
import Cancel from './pages/Cancel'
import Success from './pages/Success'
import Orders from './components/pages/profile/Orders'
import Review from './components/pages/profile/Review'
import NotFound from './components/pages/NotFound'
import AccountDetails from './components/pages/profile/AccountDetails'
import ItemsOnSale from './components/pages/profile/ItemsOnSale'
import HomeGuest from './components/pages/HomeGuest'



function App() {

  // state of the selected and the searched (used in the NavigationBar and the Home components)

  // const [userData, setUserData] = useState(null)
  const [basketCounter, setBasketCounter] = useState(0)
  const [username, setUsername] = useState('')
  const [postcode, setPostcode] = useState('')



  return (
    <BrowserRouter>
      <NavigationBar basketCounter={basketCounter} username={username} />
      <Routes>
        <Route path="/" element={<HomeGuest />} />
        <Route path="/home-user" element={<Home setBasketCounter={setBasketCounter} setUsername={setUsername} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account-details" element={<AccountDetails basketCounter={basketCounter} setBasketCounter={setBasketCounter} postcode={postcode} setPostcode={setPostcode} />} />
        <Route path="/on-sale" element={<ItemsOnSale />} />
        <Route path="/basket" element={<Basket basketCounter={basketCounter} setBasketCounter={setBasketCounter} postcode={postcode} setPostcode={setPostcode} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/edit-profile/:userId" element={<EditProfile />} />
        <Route path="/delete-account" element={<DeleteProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wish-list" element={<WishList setBasketCounter={setBasketCounter} />} />
        <Route path="/products/new" element={<NewProduct />} />
        <Route path="/products/:productId" element={<SingleProduct setBasketCounter={setBasketCounter} postcode={postcode} setPostcode={setPostcode} />} />
        <Route path="/reviews/:productId" element={<Review />} />
        <Route path="/edit-product/:productId" element={<EditProduct />} />
        <Route path="/delete-product" element={<DeleteProduct />} />
        <Route path="/delete-account" element={<DeleteProfile />} />
        <Route path="/are-you-sure" element={<AreYouSure />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-after-register" element={<LoginAfterRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success setBasketCounter={setBasketCounter} />} />
        <Route path="/cancel" element={<Cancel setBasketCounter={setBasketCounter} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )

}


export default App
