// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import MainTemplate from './layouts/MainTemplate'
import Form from './test/form'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      {/* <MainTemplate /> */}
      {/* <Form /> */}
      <Router>
        <Routes>
          <Route element={<MainLayout/>}>
            <Route path='/' element={<Home/>}/>
            <Route path='/about' element={<About/> }/>
            <Route path="*" element={<NotFound/>}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
