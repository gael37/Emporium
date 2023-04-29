import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Container from 'react-bootstrap/Container'

import Nav2 from './components/common/Nav2'

import Home from './components/pages/Home'
import WishList from './components/pages/profile/WishList'

import SingleProduct from './components/pages/products/SingleProduct'
import EditProduct from './components/pages/products/EditProduct'
import DeleteProduct from './components/pages/products/DeleteProduct'
import Login from './components/pages/auth/Login'
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



function App() {

  // state of the selected and the searched (used in the NavigationBar and the Home components)
  const [selected, setSelected] = useState('All')
  const [typed, setTyped] = useState('')
  // const [userData, setUserData] = useState(null)
  const [basketCounter, setBasketCounter] = useState(0)


  return (
    <BrowserRouter>
      <Nav2 selected={selected} typed={typed} setSelected={setSelected} setTyped={setTyped} basketCounter={basketCounter} />
      <Routes>
        <Route path="/" element={<Home selected={selected} typed={typed} setBasketCounter={setBasketCounter} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/basket" element={<Basket setBasketCounter={setBasketCounter} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/edit-profile/:userId" element={<EditProfile />} />
        <Route path="/delete-account" element={<DeleteProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wish-list" element={<WishList setBasketCounter={setBasketCounter} />} />
        <Route path="/products/new" element={<NewProduct />} />
        <Route path="/products/:productId" element={<SingleProduct />} />
        <Route path="/reviews/:productId" element={<Review />} />
        <Route path="/edit-product/:productId" element={<EditProduct />} />
        <Route path="/delete-product" element={<DeleteProduct />} />
        <Route path="/delete-account" element={<DeleteProfile />} />
        <Route path="/are-you-sure" element={<AreYouSure />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel setBasketCounter={setBasketCounter} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )

}


export default App
