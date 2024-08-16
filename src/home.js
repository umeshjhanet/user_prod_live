import React from 'react'
import Header from './Components/Header'
import SideBar from './Components/SideBar'

const Home = () => {
  const userLog = JSON.parse(localStorage.getItem('user'));
  console.log(userLog);
  return (
    <>
    <Header/>
    <SideBar/>
    </>
  )
}

export default Home
