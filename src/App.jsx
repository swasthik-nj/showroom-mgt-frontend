import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './Home'
import Login from './components/Login'
import Register from './components/Register'
import SingleBike from './components/SingleBike'
import AvlBIkes from './components/AvlBIkes'

function App() {


  return (
    <>
    <BrowserRouter>
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 3000,
        }}
      />
       <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/register' element={<Register/>}/>
         <Route path='/available-bikes' element={<AvlBIkes/>}/>
         <Route path='/bikes/:id' element={<SingleBike/>}/>
       </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
