import React, { useState } from 'react'
import Createnft from '../CreateNFT/Createnft'
import DetailView from '../DetailView/DetailView'
import { Footer } from '../Footer/Footer'
import { Home } from '../Home/Home'
import Marketplace from '../Marketplace/Marketplace'
import Navbar from '../NavBar/Navbar'
import Profile from '../Profile/Profile'
import UserProfile from '../Profile/UserProfile'
import ProfileForm from '../ProfileForm/ProfileForm'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import ErrorPage from '../404page/ErrorPage'
import Ranking from '../Ranking/Ranking'
const MainRouter = () => {

    const [SelectedNftId, setSelectedNftId] = useState()
const [SelectedUserId, setSelectedUserId] = useState()
const selectedNFT =(data)=>{
if(data!==undefined){
  setSelectedNftId(data)
}
}
const selecteduseId =(id)=>{
  if(id!==undefined){
  setSelectedUserId(id)}
}
    return (
        <> 
          <Router>
        <Navbar />
            <Routes>
                <Route path='/' element={<Home id={selecteduseId} />} />
                <Route element={<ProtectedRoute />}>

                    <Route path='/userprofile' element={<UserProfile />} />
                    <Route path='/profileform' element={<ProfileForm />} />
                    <Route path='/create' element={<Createnft />} />
                </Route>
                <Route path='/profile' element={<Profile uid={SelectedUserId} />} />
                <Route path='/detail' element={<DetailView id={SelectedNftId} />} />
                <Route path='/ranking' element={<Ranking/>} />
                <Route path='/marketplace' element={<Marketplace selectednfts={selectedNFT} />} />
                <Route path='/*' element={<ErrorPage/>} />

            </Routes>
            <Footer />
            </Router>
        </>
    )
}

export default MainRouter