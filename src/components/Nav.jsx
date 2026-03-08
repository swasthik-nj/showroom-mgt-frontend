import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AUTH_USER_KEY = 'authUser'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_USER_KEY)
    sessionStorage.removeItem(AUTH_USER_KEY)
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/login')
    setIsOpen(false)
  }

  return (
    <>
      <nav className='bg-red-950 h-16 fixed top-0 left-0 right-0 font-bold text-white rounded-tl-0 rounded-bl-4xl rounded-br-4xl flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-20 md:h-20 lg:h-20 z-40'>
        <div className='text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold'>
          <h1>
            Bike
            <span className='text-yellow-400 text-2xl'>Showroom</span>
          </h1>
        </div>

        <button
          onClick={toggleMenu}
          className='lg:hidden flex flex-col cursor-pointer z-50'
          aria-label='Toggle menu'
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white my-1 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          ></span>
        </button>

        <div className='hidden lg:flex items-center gap-4'>
          <div className='flex flex-row items-center'>
            <a href='#' className='px-4 py-3 lg:mx-2 lg:py-0 hover:text-yellow-400 lg:text-lg transition duration-300'>
              Home
            </a>
            <a href='#' className='px-4 py-3 lg:mx-2 lg:py-0 hover:text-yellow-400 lg:text-lg transition duration-300'>
              Collection
            </a>
            <a href='#' className='px-4 py-3 lg:mx-2 lg:py-0 hover:text-yellow-400 lg:text-lg transition duration-300'>
              Book
            </a>
            <a href='#' className='px-4 py-3 lg:mx-2 lg:py-0 hover:text-yellow-400 lg:text-lg transition duration-300'>
              Contact
            </a>
          </div>

          {user ? (
            <div className='flex items-center gap-3 ml-4 border-l border-yellow-400/30 pl-4'>
              <span className='text-yellow-400 text-sm font-normal'>
                Welcome, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className='px-4 py-2 bg-yellow-400 text-red-950 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition duration-300'
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='flex items-center gap-3 ml-4'>
              <Link
                to='/login'
                className='px-4 py-2 text-yellow-400 text-sm font-normal hover:text-yellow-300 transition duration-300'
              >
                Login
              </Link>
              <Link
                to='/register'
                className='px-4 py-2 bg-yellow-400 text-red-950 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition duration-300'
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800/95 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full text-white'>
          
          <div className='flex justify-end p-4'>
            <button
              onClick={() => setIsOpen(false)}
              className='text-white hover:text-yellow-400 focus:outline-none'
              aria-label='Close menu'
            >
              <svg
                className='h-6 w-6'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          
          <div className='flex flex-col space-y-1 px-4 py-2'>
            <a
              href='#'
              className='text-white hover:text-yellow-400 hover:bg-gray-700 px-4 py-3 rounded-md text-base font-medium transition duration-300'
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a
              href='#'
              className='text-white hover:text-yellow-400 hover:bg-gray-700 px-4 py-3 rounded-md text-base font-medium transition duration-300'
              onClick={() => setIsOpen(false)}
            >
              Collection
            </a>
            <a
              href='#'
              className='text-white hover:text-yellow-400 hover:bg-gray-700 px-4 py-3 rounded-md text-base font-medium transition duration-300'
              onClick={() => setIsOpen(false)}
            >
              Book
            </a>
            <a
              href='#'
              className='text-white hover:text-yellow-400 hover:bg-gray-700 px-4 py-3 rounded-md text-base font-medium transition duration-300'
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <div className='border-t border-gray-700 my-2'></div>

            {user ? (
              <div className='px-4 py-2'>
                <p className='text-yellow-400 text-sm mb-3'>
                  Welcome, <span className='font-semibold'>{user.username}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className='w-full px-4 py-3 bg-yellow-400 text-red-950 rounded-md text-base font-semibold hover:bg-yellow-300 transition duration-300'
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className='px-4 py-2 space-y-2'>
                <Link
                  to='/login'
                  className='block w-full px-4 py-3 text-center bg-gray-700 text-white rounded-md text-base font-medium hover:bg-gray-600 transition duration-300'
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='block w-full px-4 py-3 text-center bg-yellow-400 text-red-950 rounded-md text-base font-semibold hover:bg-yellow-300 transition duration-300'
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
