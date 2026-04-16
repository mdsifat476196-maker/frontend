import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Register from './Register'
import Login from './Login'
import {BrowserRouter ,Routes, Route} from "react-router-dom"
import Nav from './nav'
import User from './User'
import Chat from './Chat'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/'  element={<User />}/>
        <Route path='/register'  element={<Register />}/>
        <Route path='/login'  element={<Login />}/>
        <Route path='/chatpage/:id'  element={<Chat />}/>
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
