import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Container from 'react-bootstrap/Container'

import NotFound from './components/pages/NotFound'
import Home from './components/pages/Home'
import NavigationBar from './components/common/NavigationBar'
import WishList from './components/pages/profile/WishList'
import Orders from './components/pages/profile/Orders'
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
import Nav2 from './components/common/Nav2'
import Basket from './components/pages/profile/Basket'


function App() {

  // state of the selected and the searched (used in the NavigationBar and the Home components)
  const [selected, setSelected] = useState('All')
  const [typed, setTyped] = useState('')
  const [userData, setUserData] = useState(null)


  return (
    <BrowserRouter>
      <Nav2 selected={selected} typed={typed} setSelected={setSelected} setTyped={setTyped} userData={userData} setUserData={setUserData} />
      <Routes>
        <Route path="/" element={<Home selected={selected} typed={typed} userData={userData} setUserData={setUserData} />} />
        <Route path="/profile" element={<Profile userData={userData} setUserData={setUserData} />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/orders" element={<Orders userData={userData} setUserData={setUserData} />} />
        <Route path="/edit-profile/:userId" element={<EditProfile userData={userData} setUserData={setUserData} />} />
        <Route path="/delete-account" element={<DeleteProfile userData={userData} setUserData={setUserData} />} />
        <Route path="/orders" element={<Orders userData={userData} setUserData={setUserData} />} />
        <Route path="/wish-list" element={<WishList userData={userData} setUserData={setUserData} />} />
        <Route path="/products/new" element={<NewProduct userData={userData} setUserData={setUserData} />} />
        <Route path="/products/:productId" element={<SingleProduct userData={userData} setUserData={setUserData} />} />
        <Route path="/edit-product/:productId" element={<EditProduct userData={userData} setUserData={setUserData} />} />
        <Route path="/delete-product" element={<DeleteProduct userData={userData} setUserData={setUserData} />} />
        <Route path="/delete-account" element={<DeleteProfile userData={userData} setUserData={setUserData} />} />
        <Route path="/are-you-sure" element={<AreYouSure />} userData={userData} setUserData={setUserData} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )

}


export default App
