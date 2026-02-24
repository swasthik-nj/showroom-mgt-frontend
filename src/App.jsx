import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Login from './components/Login'
import Register from './components/Register'
import SingleBike from './components/SingleBike'

function App() {


  return (
    <>
    <BrowserRouter>
       <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/register' element={<Register/>}/>
         <Route path='/bikes/hunter-350' element={<SingleBike/>}/>
       </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
